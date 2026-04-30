export default async function handler(req) {
    // Handle CORS agar frontend bisa memanggil API
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }

    const url = new URL(req.url);
    const question = url.searchParams.get('question');
    const API_KEY = "AIzaSyDHSXSFVo2f63fjOMhLRY6xSnAzDZK3ouI";

    if (!question) {
        return new Response(JSON.stringify({ error: 'Please provide a question' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }

    try {
        // Panggil Gemini API v1beta
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: question }] }]
            })
        });

        const data = await response.json();
        
        // Ambil teks jawaban
        const fullText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tidak ada jawaban.";

        // Kembalikan objek yang strukturnya sama persis dengan yang diharapkan script.js (frontend)
        const result = {
            answer: fullText,
            sources: ["https://google.com"], // Placeholder agar UI tidak kosong di bagian source
            similarQuestions: [
                "Jelaskan lebih lanjut tentang ini",
                "Apa manfaat dari hal tersebut?",
                "Berikan contoh lainnya"
            ]
        };

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}
