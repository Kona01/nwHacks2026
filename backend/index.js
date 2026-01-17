import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai'; // The new SDK

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Initialize the client (Note: The new SDK can also pick up GEMINI_API_KEY from .env automatically)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  try {
    // 2. In the new SDK, use 'ai.models.generateContent' directly
    // Or use 'ai.chats.create' for stateful conversations
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", 
      contents: [{ role: 'user', parts: [{ text: message }] }]
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});