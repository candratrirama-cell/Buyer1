// api/index.js
const axios = require('axios');

// Fungsi utama dari request kamu
async function turboseekLogic(question) {
    try {
        if (!question) throw new Error('Question is required.');
        
        const inst = axios.create({
            baseURL: 'https://www.turboseek.io/api',
            headers: {
                origin: 'https://www.turboseek.io',
                referer: 'https://www.turboseek.io/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        // 1. Get Sources
        const { data: sources } = await inst.post('/getSources', {
            question: question
        });
        
        // 2. Get Similar Questions
        const { data: similarQuestions } = await inst.post('/getSimilarQuestions', {
            question: question,
            sources: sources
        });
        
        // 3. Get Answer
        const { data: answer } = await inst.post('/getAnswer', {
            question: question,
            sources: sources
        });
        
        // Cleaning answer logic as provided
        const cleanAnswer = answer.match(/<p>(.*?)<\/p>/gs)?.map(match => {
            return match.replace(/<\/?p>/g, '').replace(/<\/?strong>/g, '').replace(/<\/?em>/g, '').replace(/<\/?b>/g, '').replace(/<\/?i>/g, '').replace(/<\/?u>/g, '').replace(/<\/?[^>]+(>|$)/g, '').trim();
        }).join('\n\n') || answer.replace(/<\/?[^>]+(>|$)/g, '').trim();
        
        return {
            answer: cleanAnswer,
            sources: sources.map(s => s.url), // Mengambil URL saja
            similarQuestions
        };
    } catch (error) {
        throw error;
    }
}

// Vercel Serverless Handler
module.exports = async (req, res) => {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { question } = req.query || req.body;

    if (!question) {
        return res.status(400).json({ error: 'Please provide a question' });
    }

    try {
        const result = await turboseekLogic(question);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
