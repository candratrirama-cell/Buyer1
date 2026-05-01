const axios = require('axios');
const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: "lunan-b6bfe",
            clientEmail: "firebase-adminsdk-xxxxx@lunan-b6bfe.iam.gserviceaccount.com", // Ganti dengan email asli service account
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        }),
        databaseURL: "https://lunan-b6bfe-default-rtdb.asia-southeast1.firebasedatabase.app"
    });
}

const db = admin.database();

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { question, apiKey: bodyKey } = req.body;
    const apiKey = req.headers['x-api-key'] || bodyKey;

    if (!question) return res.status(400).json({ error: 'Question is required' });

    try {
        let usage = 0;
        // API Key Validation & Database Check
        if (apiKey) {
            const userSnap = await db.ref('users').orderByChild('apiKey').equalTo(apiKey).once('value');
            if (!userSnap.exists()) return res.status(403).json({ error: 'Invalid API Key' });

            const uid = Object.keys(userSnap.val())[0];
            const userData = userSnap.val()[uid];
            const currentMonth = new Date().getMonth();

            if (userData.lastReset !== currentMonth) {
                await db.ref(`users/${uid}`).update({ usage: 0, lastReset: currentMonth });
                userData.usage = 0;
            }

            if (userData.usage >= 100) return res.status(429).json({ error: 'Limit reached (100/mo)' });
            
            await db.ref(`users/${uid}/usage`).set(admin.database.ServerValue.increment(1));
            usage = (userData.usage || 0) + 1;
        }

        // Brain Memory Check (Cek cache pertanyaan yang sama)
        const brainSnap = await db.ref('brain').once('value');
        const brainData = brainSnap.val();
        if (brainData) {
            const q = question.toLowerCase().trim();
            for (let id in brainData) {
                if (q === brainData[id].topic.toLowerCase().trim()) {
                    return res.status(200).json({ answer: brainData[id].content, sources: [], usage });
                }
            }
        }

        // AI Logic
        const isNews = /berita|spesifikasi|terkini|update|siapa|kapan|dimana/i.test(question);
        let result = { answer: "", sources: [], usage };

        if (isNews) {
            const turboseek = axios.create({ baseURL: 'https://www.turboseek.io/api' });
            const { data: s } = await turboseek.post('/getSources', { question });
            const { data: a } = await turboseek.post('/getAnswer', { question, sources: s });
            result.answer = a.replace(/<\/?[^>]+(>|$)/g, "").trim();
            result.sources = s.map(i => ({ title: i.title, link: i.url }));
        } else {
            const groqRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                messages: [{ role: "system", content: "Kamu adalah Lunan AI..." }, { role: "user", content: question }],
                model: "llama-3.3-70b-versatile"
            }, { headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` } });
            result.answer = groqRes.data.choices[0].message.content;
        }

        // Simpan ke Brain Kolektif
        await db.ref('brain').push({ topic: question, content: result.answer });

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ error: "Neural System Error" });
    }
};
