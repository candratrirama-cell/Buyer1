const API_KEY = "AIzaSyDHSXSFVo2f63fjOMhLRY6xSnAzDZK3ouI";

export default async function handler(req, res) {
    // Detect environment & get question
    let question;
    if (req.query && req.query.question) {
        question = req.query.question;
    } else {
        const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
        question = url.searchParams.get('question');
    }

    // CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (req.method === 'OPTIONS') {
        if (res && res.status) return res.status(200).end();
        return new Response(null, { status: 200, headers });
    }

    if (!question) {
        const errorBody = JSON.stringify({ error: 'Please provide a question' });
        if (res && res.status) return res.status(400).send(errorBody);
        return new Response(errorBody, { status: 400, headers });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: question }] }]
            })
        });

        const data = await response.json();
        const fullText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tidak ada jawaban.";

        // Format output 100% sesuai kebutuhan script.js asli
        const result = JSON.stringify({
            answer: fullText,
            sources: ["https://google.com"],
            similarQuestions: ["Jelaskan lebih detail", "Berikan contoh lain", "Apa kesimpulannya?"]
        });

        if (res && res.status) {
            return res.status(200).send(result);
        } else {
            return new Response(result, { status: 200, headers });
        }
    } catch (error) {
        const errorMsg = JSON.stringify({ error: error.message });
        if (res && res.status) return res.status(500).send(errorMsg);
        return new Response(errorMsg, { status: 500, headers });
    }
}
