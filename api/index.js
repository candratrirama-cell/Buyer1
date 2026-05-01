const axios = require('axios');
const admin = require('firebase-admin');

// Inisialisasi Firebase Admin (Gunakan Service Account untuk keamanan maksimal)
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
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { question, userId } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    try {
        const cleanQ = question.toLowerCase().trim();
        
        // 1. CEK DATABASE (Brain) TERLEBIH DAHULU
        const brainRef = db.ref('brain');
        const snapshot = await brainRef.orderByChild('topic').equalTo(cleanQ).once('value');
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            const firstKey = Object.keys(data)[0];
            return res.status(200).json({ 
                answer: data[firstKey].content, 
                sources: [],
                fromCache: true 
            });
        }

        // 2. DETEKSI JENIS PERTANYAAN
        const isNews = /berita|terkini|hari ini|update|peristiwa|siapa|kapan|dimana/i.test(question);
        let finalResponse = { answer: "", sources: [] };

        if (isNews) {
            const searchApi = axios.create({ 
                baseURL: 'https://www.turboseek.io/api', // Endpoint tetap, teks tampilan dihapus
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

        // 3. SIMPAN KE DATABASE (Brain & History)
        await db.ref('brain').push({ topic: cleanQ, content: finalResponse.answer, t: Date.now() });
        if (userId) {
            await db.ref(`chats/${userId}`).push({ q: question, a: finalResponse.answer, t: Date.now() });
        }

        return res.status(200).json(finalResponse);

    } catch (error) {
        return res.status(500).json({ answer: "Kesalahan pada sistem neural.", sources: [] });
    }
};
