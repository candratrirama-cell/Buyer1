const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { question } = req.body;

    try {
        // 1. Ambil Berita (Turboseek)
        const turboseek = axios.create({ baseURL: 'https://www.turboseek.io/api', timeout: 5000 });
        const { data: sources } = await turboseek.post('/getSources', { question });
        const { data: answerRaw } = await turboseek.post('/getAnswer', { question, sources });
        const newsContent = answerRaw.replace(/<\/?[^>]+(>|$)/g, '').trim();

        // 2. Olah dengan Groq
        const groq = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            messages: [
                { role: "system", content: "Anda Lunan AI. Jawab dengan cerdas dan ringkas." },
                { role: "user", content: `Info berita: ${newsContent}\n\nPertanyaan: ${question}` }
            ],
            model: "llama-3.3-70b-versatile"
        }, {
            headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
        });

        res.status(200).json({ 
            answer: groq.data.choices[0].message.content,
            sources: sources,
            learnedContent: newsContent
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
