const axios = require('axios');

module.exports = async (req, res) => {
    // 1. Headers & CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question is required' });

    try {
        // 2. Deteksi Jenis Pertanyaan (Berita vs Umum)
        const isNews = /berita|terkini|hari ini|update|peristiwa|siapa|kapan|dimana/i.test(question);
        let finalResponse = {
            answer: "",
            sources: []
        };

        if (isNews) {
            // LOGIKA TURBOSEEK (Berita)
            const turboseek = axios.create({ 
                baseURL: 'https://www.turboseek.io/api',
                headers: {
                    'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
                }
            });

            const { data: sources } = await turboseek.post('/getSources', { question });
            const { data: rawAns } = await turboseek.post('/getAnswer', { question, sources });
            
            // Pembersihan tag HTML dari Turboseek
            const cleanText = rawAns.replace(/<\/?[^>]+(>|$)/g, "").trim();
            
            finalResponse.answer = cleanText;
            finalResponse.sources = sources.map(s => ({
                title: s.title || "Referensi Berita",
                link: s.url
            }));
        } else {
            // LOGIKA GROQ (Pertanyaan Umum / AI)
            const groqRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                messages: [
                    { role: "system", content: "Kamu adalah Lunan AI, asisten yang cerdas. Gunakan bahasa Indonesia yang baik." },
                    { role: "user", content: question }
                ],
                model: "llama-3.3-70b-versatile"
            }, {
                headers: { 
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            finalResponse.answer = groqRes.data.choices[0].message.content;
            finalResponse.sources = []; // Groq tidak mengirim link source
        }

        // Return hasil ke frontend
        return res.status(200).json(finalResponse);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            answer: "Maaf, terjadi kesalahan pada server neural. Silakan coba lagi.",
            sources: [] 
        });
    }
};
