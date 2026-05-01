const axios = require('axios');

// KONFIGURASI API (Ganti dengan API Key milikmu)
const GROQ_API_KEY = "GANTI_DENGAN_GROQ_API_KEY_KAMU";
const FIREBASE_DB_URL = "https://lunan-b6bfe-default-rtdb.asia-southeast1.firebasedatabase.app";

async function turboseekLogic(question) {
    const inst = axios.create({
        baseURL: 'https://www.turboseek.io/api',
        headers: {
            'origin': 'https://www.turboseek.io',
            'referer': 'https://www.turboseek.io/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    });

    const { data: sources } = await inst.post('/getSources', { question });
    const { data: similar } = await inst.post('/getSimilarQuestions', { question, sources });
    
    return { sources: sources.map(s => s.url), similar };
}

async function getGroqChat(question) {
    const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: "Kamu adalah SmartAI. Berikan jawaban yang cerdas, teknis, dan akurat." },
            { role: "user", content: question }
        ]
    }, {
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}` }
    });
    return res.data.choices[0].message.content;
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'No question' });

    try {
        const cleanQ = question.toLowerCase().trim();
        
        // 1. CEK DATABASE (Firebase)
        const dbRes = await axios.get(`${FIREBASE_DB_URL}/brain.json`);
        const brainData = dbRes.data;
        
        let existingAnswer = null;
        if (brainData) {
            for (let id in brainData) {
                if (brainData[id].topic.toLowerCase() === cleanQ) {
                    existingAnswer = brainData[id].content;
                    break;
                }
            }
        }

        // 2. LOGIKA HYBRID
        let finalAnswer;
        const searchData = await turboseekLogic(question);

        if (existingAnswer) {
            finalAnswer = existingAnswer; // Ambil dari Database
        } else {
            finalAnswer = await getGroqChat(question); // Ambil dari Groq
            
            // Simpan ke Database biar kedepannya makin pinter
            await axios.post(`${FIREBASE_DB_URL}/brain.json`, {
                topic: question,
                content: finalAnswer,
                timestamp: Date.now()
            });
        }

        return res.status(200).json({
            answer: finalAnswer,
            sources: searchData.sources,
            similarQuestions: searchData.similar
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
