const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { question, context } = req.body;

    try {
        // Panggil Groq AI
        const groqRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            messages: [
                { role: "system", content: `Anda Lunan AI. Gunakan info ini jika relevan: ${context}` },
                { role: "user", content: question }
            ],
            model: "llama-3.3-70b-versatile"
        }, {
            headers: { 
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json' 
            }
        });

        res.status(200).json({ answer: groqRes.data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
