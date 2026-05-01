const axios = require('axios');

// VARIABEL PRIVATE (Pastikan pasang di Environment Variables Vercel)
const GROQ_API_KEY = process.env.GROQ_API_KEY || "MASUKKAN_KEY_DISINI_JIKA_LOKAL"; 
const FB_DB = "https://lunan-b6bfe-default-rtdb.asia-southeast1.firebasedatabase.app";

/**
 * LOGIKA BRUTAL TURBOSEEK (Untuk Berita & Sumber)
 */
async function getSearchData(q) {
    try {
        const inst = axios.create({
            baseURL: 'https://www.turboseek.io/api',
            headers: {
                'origin': 'https://www.turboseek.io',
                'referer': 'https://www.turboseek.io/',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const { data: sources } = await inst.post('/getSources', { question: q });
        const { data: similar } = await inst.post('/getSimilarQuestions', { question: q, sources });
        return { 
            urls: sources.map(s => s.url), 
            similar: similar || [] 
        };
    } catch (e) {
        return { urls: [], similar: [] };
    }
}

/**
 * LOGIKA OTAK LUNAN (Groq)
 */
async function lunanBrain(q) {
    const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama-3.3-70b-versatile",
        messages: [
            { 
                role: "system", 
                content: "Kamu adalah Lunan AI, asisten cerdas buatan Rama (@maramadhona). Jawab dengan gaya profesional, teknis, dan sangat akurat." 
            },
            { role: "user", content: q }
        ]
    }, {
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
    });
    return res.data.choices[0].message.content;
}

/**
 * SERVERLESS HANDLER
 */
module.exports = async (req, res) => {
    // CORS CONFIG
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { question } = req.method === 'POST' ? req.body : req.query;
    if (!question) return res.status(400).json({ error: 'Mana pertanyaannya, Rama?' });

    try {
        const qClean = question.toLowerCase().trim();

        // 1. CEK DATABASE (Brain Memory)
        const dbRes = await axios.get(`${FB_DB}/brain.json`);
        const memory = dbRes.data;
        let cachedAnswer = null;

        if (memory) {
            for (let id in memory) {
                if (memory[id].topic.toLowerCase() === qClean) {
                    cachedAnswer = memory[id].content;
                    break;
                }
            }
        }

        // 2. JALANKAN LOGIKA PARALEL (Groq + Turboseek)
        let finalAnswer;
        const searchData = await getSearchData(question);

        if (cachedAnswer) {
            finalAnswer = cachedAnswer; // Pakai memori lama jika ada
        } else {
            finalAnswer = await lunanBrain(question); // Panggil Groq jika baru
            
            // Simpan ke Brain Database agar Lunan makin pinter
            await axios.post(`${FB_DB}/brain.json`, {
                topic: question,
                content: finalAnswer,
                timestamp: Date.now()
            });
        }

        // 3. RESPONSE FINAL KE UI
        return res.status(200).json({
            answer: finalAnswer,
            sources: searchData.urls,
            similarQuestions: searchData.similar
        });

    } catch (err) {
        return res.status(500).json({ 
            error: 'Lunan AI sedang maintenance', 
            msg: err.message 
        });
    }
};
