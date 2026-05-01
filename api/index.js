const axios = require('axios');

module.exports = async (req, res) => {
    // Header agar tidak kena blokir (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { question } = req.body;

    try {
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            messages: [
                { role: "system", content: "Kamu adalah Lunan AI, asisten pintar yang ramah." },
                { role: "user", content: question }
            ],
            model: "llama-3.3-70b-versatile"
        }, {
            headers: { 
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({ answer: response.data.choices[0].message.content });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
