const axios = require('axios');
const admin = require('firebase-admin');

// Inisialisasi Firebase Admin dengan Service Account (Environment Variables)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
        databaseURL: process.env.FIREBASE_RTDB_URL
    });
}

const db = admin.database();

module.exports = async (req, res) => {
    // Pengaturan CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { question, uid } = req.body;
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    try {
        let newsInfo = "";

        // 1. FITUR NEWS: Cari berita melalui Turboseek
        try {
            const searchApi = axios.create({ baseURL: 'https://www.turboseek.io/api', timeout: 6000 });
            const { data: sources } = await searchApi.post('/getSources', { question });
            const { data: answer } = await searchApi.post('/getAnswer', { question, sources });
            
            newsInfo = answer.replace(/<\/?[^>]+(>|$)/g, '').trim();

            // 2. FITUR LEARNING: Simpan berita ke database agar AI bisa belajar jika limit
            await db.ref('news_learning').push({
                topic: question,
                content: newsInfo,
                timestamp: admin.database.ServerValue.TIMESTAMP
            });
        } catch (searchError) {
            // Fallback: Ambil dari database "pengetahuan" internal
            const memorySnap = await db.ref('news_learning').limitToLast(3).once('value');
            if (memorySnap.exists()) {
                newsInfo = Object.values(memorySnap.val()).map(m => m.content).join("\n");
            } else {
                newsInfo = "Gagal mengambil berita terbaru.";
            }
        }

        // 3. FITUR GROQ: Kirim ke Groq Console
        const groqResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            messages: [
                { role: "system", content: `Anda adalah Lunan AI. Gunakan berita ini sebagai referensi: ${newsInfo}` },
                { role: "user", content: question }
            ],
            model: "llama-3.3-70b-versatile",
        }, {
            headers: { 
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json' 
            }
        });

        const finalAIResult = groqResponse.data.choices[0].message.content;

        // 4. FITUR RIWAYAT: Simpan riwayat chat user secara permanen
        await db.ref(`chats/${uid}`).push({
            question: question,
            answer: finalAIResult,
            timestamp: admin.database.ServerValue.TIMESTAMP
        });

        return res.status(200).json({ answer: finalAIResult });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Terjadi kesalahan pada sistem Lunan." });
    }
};
