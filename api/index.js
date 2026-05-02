const axios = require('axios');
const admin = require('firebase-admin');
const crypto = require('crypto');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
        databaseURL: "https://lunan-b6bfe-default-rtdb.asia-southeast1.firebasedatabase.app"
    });
}
const db = admin.database();

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const mode = req.query.mode || req.body?.mode;
    const secret = req.query.secret || req.body?.secret;

    try {
        // ===== HIDDEN APIKEY REQUEST SYSTEM =====
        if (mode === 'request') {
            const { webName, domain, reason } = req.body || {};
            if (!webName || !domain) return res.status(400).json({ status:false, msg:'webName dan domain wajib' });
            const id = 'REQ-' + Date.now();
            await db.ref(`apikey_requests/${id}`).set({ webName, domain, reason: reason || '-', status:'pending', t:Date.now() });
            return res.status(200).json({ status:true, msg:'Request berhasil dikirim', requestId:id });
        }

        if (mode === 'admin' && secret === process.env.ADMIN_SECRET) {
            const snap = await db.ref('apikey_requests').once('value');
            return res.status(200).json(snap.val() || {});
        }

        if (mode === 'approve' && secret === process.env.ADMIN_SECRET) {
            const { requestId } = req.body || {};
            if (!requestId) return res.status(400).json({ status:false, msg:'requestId kosong' });
            const reqSnap = await db.ref(`apikey_requests/${requestId}`).once('value');
            if (!reqSnap.exists()) return res.status(404).json({ status:false, msg:'request tidak ada' });
            const apiKey = 'LUNAN-' + crypto.randomBytes(12).toString('hex').toUpperCase();
            const data = reqSnap.val();
            await db.ref(`apikeys/${apiKey}`).set({ webName:data.webName, domain:data.domain, active:true, t:Date.now() });
            await db.ref(`apikey_requests/${requestId}/status`).set('approved');
            await db.ref(`apikey_requests/${requestId}/apiKey`).set(apiKey);
            return res.status(200).json({ status:true, apiKey });
        }

        if (mode === 'verify') {
            const apiKey = req.query.apikey || req.body?.apikey;
            if (!apiKey) return res.status(400).json({ status:false });
            const snap = await db.ref(`apikeys/${apiKey}`).once('value');
            return res.status(200).json({ valid: snap.exists() });
        }

        // ===== NORMAL LUNAN AI CHAT SYSTEM =====
        const { question, userId } = req.body;
        if (!question) return res.status(400).json({ error: 'Question is required' });

        const cleanQ = question.toLowerCase().trim();
        const brainRef = db.ref('brain');
        const snapshot = await brainRef.orderByChild('topic').equalTo(cleanQ).once('value');
        if (snapshot.exists()) {
            const data = snapshot.val();
            const firstKey = Object.keys(data)[0];
            return res.status(200).json({ answer: data[firstKey].content, sources: [], fromCache: true });
        }

        const isNews = /berita|terkini|hari ini|update|peristiwa|siapa|kapan|dimana/i.test(question);
        let finalResponse = { answer: "", sources: [] };

        if (isNews) {
            const searchApi = axios.create({ baseURL: 'https://www.turboseek.io/api', headers: { 'user-agent': 'Mozilla/5.0' } });
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
            }, { headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` } });
            finalResponse.answer = groqRes.data.choices[0].message.content;
        }

        await db.ref('brain').push({ topic: cleanQ, content: finalResponse.answer, t: Date.now() });
        if (userId) await db.ref(`chats/${userId}`).push({ q: question, a: finalResponse.answer, t: Date.now() });
        return res.status(200).json(finalResponse);

    } catch (error) {
        return res.status(500).json({ answer: "Kesalahan pada sistem neural.", sources: [], err:error.message });
    }
};
