import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

// Add validation for API key
if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const handleChat = async (req, res) => {
    try {
        const { message, conversation } = req.body;
        
        // Initialize model with error handling
        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro",
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE",
                }
            ],
        });
        
        // Format conversation history
        const chatHistory = conversation
            .map(msg => `${msg.sender}: ${msg.text}`)
            .join('\n');

        // Create prompt
        const prompt = `
You are a helpful assistant for the IIIT Buy-Sell platform. Help users with:
- Finding and purchasing items
- Selling items on the platform
- Platform navigation and features
- General marketplace questions

Previous conversation:
${chatHistory}

User: ${message}
Assistant:`;

        // Generate response with error handling
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        if (!result || !result.response) {
            throw new Error('No response from Gemini API');
        }

        const response = result.response.text();

        res.json({ 
            success: true, 
            response: response.trim() 
        });

    } catch (error) {
        console.error('Chat error:', {
            message: error.message,
            stack: error.stack,
            details: error
        });
        
        res.status(500).json({ 
            success: false, 
            message: 'Error processing chat message',
            error: error.toString()
        });
    }
};