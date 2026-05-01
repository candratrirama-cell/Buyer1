// api/index.js
const axios = require('axios');

// Ambil API Key dari variable Vercel
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// 1. LOGIKA TURBOSEEK (UNTUK BERITA & DATA INTERNET)
async function turboseekLogic(question) {
    try {
        const inst = axios.create({
            baseURL: 'https://www.turboseek.io/api',
            headers: {
                origin: 'https://www.turboseek.io',
                referer: 'https://www.turboseek.io/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        const { data: sources } = await inst.post('/getSources', { question });
        const { data: similarQuestions } = await inst.post('/getSimilarQuestions', { question, sources });
        const { data: answer } = await inst.post('/getAnswer', { question, sources });
        
        const cleanAnswer = answer.match(/<p>(.*?)<\/p>/gs)?.map(match => {
            return match.replace(/<\/?(p|strong|em|b|i|u)>/g, '').replace(/<\/?[^>]+(>|$)/g, '').trim();
        }).join('\n\n') || answer.replace(/<\/?[^>]+(>|$)/g, '').trim();
        
        return {
            answer: cleanAnswer,
            sources: sources.map(s => ({ title: s.title || s.url, url: s.url })),
            similarQuestions,
            type: "news"
        };
    } catch (error) {
        throw error;
    }
}

// 2. LOGIKA GROQ (UNTUK TANYA AI UMUM)
async function groqLogic(question) {
    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "Kamu adalah Smart AI yang cerdas dan membantu." },
                { role: "user", content: question }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        return {
            answer: response.data.choices[0].message.content,
            sources: [],
            similarQuestions: [],
            type: "ai"
        };
    } catch (error) {
        throw new Error("Gagal terhubung ke Groq AI");
    }
}

// VERCEL HANDLER
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { question } = req.query || req.body;
    if (!question) return res.status(400).json({ error: 'Pertanyaan wajib diisi' });

    try {
        // DETEKSI OTOMATIS: Jika ada kata berita/hari ini/update, gunakan Turboseek
        const isNewsRequest = /berita|terkini|hari ini|update|siapa|kapan|peristiwa/i.test(question);
        
        let result;
        if (isNewsRequest) {
            result = await turboseekLogic(question);
            // Tambahkan atribusi sumber jika berita
            result.answer = `${result.answer}\n\n*Dilansir dari berbagai sumber berita.*`;
        } else {
            result = await groqLogic(question);
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
