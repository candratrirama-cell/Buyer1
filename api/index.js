const axios = require('axios');
const admin = require('firebase-admin');

// Konfigurasi Firebase Admin (Pastikan Env terpasang di Vercel)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: "lunan-b6bfe",
            clientEmail: "firebase-adminsdk-xxxxx@lunan-b6bfe.iam.gserviceaccount.com",
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        }),
        databaseURL: "https://lunan-b6bfe-default-rtdb.asia-southeast1.firebasedatabase.app"
    });
}

const db = admin.database();

module.exports = async (req, res) => {
    // 1. Headers & CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { question, apiKey: bodyKey } = req.body;
    const apiKey = req.headers['x-api-key'] || bodyKey;

    if (!question) return res.status(400).json({ error: 'Question is required' });

    try {
        // --- LOGIKA VALIDASI API KEY & LIMIT ---
        if (apiKey) {
            const usersRef = db.ref('users');
            const userSnap = await usersRef.orderByChild('apiKey').equalTo(apiKey).once('value');
            
            if (!userSnap.exists()) {
                return res.status(403).json({ error: 'Invalid API Key' });
            }

            const uid = Object.keys(userSnap.val())[0];
            const userData = userSnap.val()[uid];
            const currentMonth = new Date().getMonth();

            // Reset limit jika sudah berganti bulan
            if (userData.lastReset !== currentMonth) {
                await usersRef.child(uid).update({ usage: 0, lastReset: currentMonth });
                userData.usage = 0;
            }

            // Cek Limit 100 per bulan
            if (userData.usage >= 100) {
                return res.status(429).json({ error: 'Monthly limit reached (100/100)' });
            }

            // Increment usage
            await usersRef.child(uid).child('usage').set(admin.database.ServerValue.increment(1));
        }

        // --- CEK DATABASE BRAIN (Agar akurat dan hemat limit Groq) ---
        const brainSnap = await db.ref('brain').once('value');
        const brainData = brainSnap.val();
        if (brainData) {
            const cleanQ = question.toLowerCase().trim();
            for (let id in brainData) {
                if (cleanQ === brainData[id].topic.toLowerCase().trim()) {
                    return res.status(200).json({ 
                        answer: brainData[id].content, 
                        sources: [], 
                        from_cache: true 
                    });
                }
            }
        }

        // --- LOGIKA AI (Berita vs Umum) ---
        const isNews = /berita|terkini|hari ini|update|peristiwa|siapa|kapan|dimana/i.test(question);
        let finalResponse = { answer: "", sources: [] };

        if (isNews) {
            const turboseek = axios.create({ 
                baseURL: 'https://www.turboseek.io/api',
                headers: { 'user-agent': 'Mozilla/5.0 (Linux; Android 15)' }
            });

            const { data: sources } = await turboseek.post('/getSources', { question });
            const { data: rawAns } = await turboseek.post('/getAnswer', { question, sources });
            
            finalResponse.answer = rawAns.replace(/<\/?[^>]+(>|$)/g, "").trim();
            finalResponse.sources = sources.map(s => ({ title: s.title || "Referensi", link: s.url }));
        } else {
            const groqRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                messages: [
                    { role: "system", content: "Kamu adalah Lunan AI, asisten yang cerdas. Gunakan bahasa Indonesia yang baik." },
                    { role: "user", content: question }
                ],
                model: "llama-3.3-70b-versatile"
            }, {
                headers: { 
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            finalResponse.answer = groqRes.data.choices[0].message.content;
        }

        // Simpan ke Brain Kolektif
        await db.ref('brain').push({ topic: question, content: finalResponse.answer, t: Date.now() });

        return res.status(200).json(finalResponse);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            answer: "Maaf, terjadi gangguan pada neural sistem.",
            sources: [] 
        });
    }
};
