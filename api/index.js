const axios = require('axios');
const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
        databaseURL: "https://lunan-b6bfe-default-rtdb.asia-southeast1.firebasedatabase.app"
    });
}

const db = admin.database();

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key'); // Tambahkan header key
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { question, userId } = req.body;
    const apiKey = req.headers['x-api-key']; // Ambil API Key dari header

    if (!question) return res.status(400).json({ error: 'Question is required' });
    if (!apiKey) return res.status(401).json({ error: 'API Key is required' });

    try {
        // --- VALIDASI API KEY & LIMIT ---
        const apiKeySnap = await db.ref('api_keys').orderByValue().equalTo(apiKey).once('value');
        if (!apiKeySnap.exists()) return res.status(403).json({ error: 'Invalid API Key' });
        
        const ownerId = Object.keys(apiKeySnap.val())[0];
        const userRef = db.ref(`users/${ownerId}`);
        const userSnap = await userRef.once('value');
        const userData = userSnap.val() || { limit: 100 };

        if (userData.limit <= 0) {
            return res.status(429).json({ error: 'API Limit exhausted (0/100)' });
        }

        const cleanQ = question.toLowerCase().trim();
        
        // 1. CEK DATABASE (Brain) TERLEBIH DAHULU (Sesuai Permintaan)
        const brainRef = db.ref('brain');
        const snapshot = await brainRef.orderByChild('topic').equalTo(cleanQ).once('value');
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            const firstKey = Object.keys(data)[0];
            // Kurangi limit meski dari cache
            await userRef.update({ limit: userData.limit - 1 });
            return res.status(200).json({ 
                answer: data[firstKey].content, 
                sources: [],
                fromCache: true,
                remainingLimit: userData.limit - 1
            });
        }

        // 2. DETEKSI JENIS PERTANYAAN
        const isNews = /berita|terkini|hari ini|update|peristiwa|siapa|kapan|dimana/i.test(question);
        let finalResponse = { answer: "", sources: [] };

        if (isNews) {
            const searchApi = axios.create({ 
                baseURL: 'https://www.turboseek.io/api',
                headers: { 'user-agent': 'Mozilla/5.0' }
            });
            const { data: sources } = await searchApi.post('/getSources', { question });
            const { data: rawAns } = await searchApi.post('/getAnswer', { question, sources });
            finalResponse.answer = rawAns.replace(/<\/?[^>]+(>|$)/g, "").trim();
            finalResponse.sources = sources.map(s => ({ title: s.title || "Sumber Info", link: s.url }));
        } else {
            const groqRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                messages: [
                    { role: "system", content: "Kamu adalah Lunan AI, asisten yang cerdas. Gunakan bahasa Indonesia yang baik." },
                    { role: "user", content: question }
                ],
                model: "llama-3.3-70b-versatile"
            }, {
                headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
            });
            finalResponse.answer = groqRes.data.choices[0].message.content;
        }

        // 3. UPDATE LIMIT & SIMPAN HISTORY
        await userRef.update({ limit: userData.limit - 1 });
        await db.ref('brain').push({ topic: cleanQ, content: finalResponse.answer, t: Date.now() });
        if (userId) {
            await db.ref(`chats/${userId}`).push({ q: question, a: finalResponse.answer, t: Date.now() });
        }

        return res.status(200).json({ ...finalResponse, remainingLimit: userData.limit - 1 });

    } catch (error) {
        return res.status(500).json({ answer: "Kesalahan pada sistem neural.", error: error.message });
    }
};
