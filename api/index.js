const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { question } = req.body;

    try {
        // 1. Ambil Berita dari Turboseek
        const turboseek = axios.create({ baseURL: 'https://www.turboseek.io/api', timeout: 6000 });
        const { data: sources } = await turboseek.post('/getSources', { question });
        const { data: rawAns } = await turboseek.post('/getAnswer', { question, sources });
        const newsContext = rawAns.replace(/<\/?[^>]+(>|$)/g, '').trim();

        // 2. Olah ke Groq
        const groq = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            messages: [
                { role: "system", content: "Kamu adalah Lunan AI, asisten yang sangat cerdas. Jawab dengan gaya ChatGPT menggunakan Markdown." },
                { role: "user", content: `Sumber Berita: ${newsContext}\n\nPertanyaan: ${question}` }
            ],
            model: "llama-3.3-70b-versatile"
        }, {
            headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
        });

        res.status(200).json({ 
            answer: groq.data.choices[0].message.content,
            sources: sources,
            learned: newsContext
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
