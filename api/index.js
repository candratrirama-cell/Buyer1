const axios = require('axios');
const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
        databaseURL: process.env.FIREBASE_RTDB_URL
    });
}
const db = admin.database();

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { question, uid } = req.body;
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    try {
        let newsData = "";
        try {
            // 1. Ambil Berita (Turboseek)
            const search = axios.create({ baseURL: 'https://www.turboseek.io/api' });
            const { data: sources } = await search.post('/getSources', { question });
            const { data: answer } = await search.post('/getAnswer', { question, sources });
            newsData = answer.replace(/<\/?[^>]+(>|$)/g, '').trim();

            // 2. Simpan untuk Learning Mode
            await db.ref('news_learning').push({ topic: question, content: newsData, t: Date.now() });
        } catch (e) {
            // Fallback: Ambil data lama jika API Limit
            const snap = await db.ref('news_learning').limitToLast(2).once('value');
            newsData = snap.exists() ? Object.values(snap.val()).map(v => v.content).join(" ") : "No context.";
        }

        // 3. Groq AI Processing
        const groq = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            messages: [
                { role: "system", content: `Nama Anda Lunan AI. Gunakan info ini: ${newsData}` },
                { role: "user", content: question }
            ],
            model: "llama-3.3-70b-versatile"
        }, { headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` } });

        const aiResult = groq.data.choices[0].message.content;

        // 4. Simpan Riwayat Chat & Login (tanda aktivitas)
        await db.ref(`chats/${uid}`).push({ q: question, a: aiResult, t: Date.now() });
        await db.ref(`users/${uid}/last_active`).set(Date.now());

        res.status(200).json({ answer: aiResult });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
