import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { readFile } from 'node:fs/promises'; 

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const clubList = await readFile('./data/ams_clubs_list.csv', 'utf8');
const clubData = await readFile('./data/ams_clubs_data.json', 'utf8');

// 1. Initialize the client (Note: The new SDK can also pick up GEMINI_API_KEY from .env automatically)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  try {
    // 2. In the new SDK, use 'ai.models.generateContent' directly
    // Or use 'ai.chats.create' for stateful conversations
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", 
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        // PERSONA & CONTEXT INJECTION
        systemInstruction: `
          You are the UBC AMS Club Assistant. 
          Use the following club data to answer user questions:
          
          CLUB LIST + ID: ${clubList}
          
          Guidelines:
          1. If a club is not in the data, politely say you don't have information on it.
          2. Always be helpful and encouraging to students.
          3. Never answer questions unrelated to clubs at UBC.
        `,
        // // FORMAT INJECTION (Forces JSON output)
        // responseMimeType: "application/json",
        // responseSchema: {
        //   type: "object",
        //   properties: {
        //     replyText: { type: "string", description: "The main conversational response." },
        //     suggestedClubs: { 
        //       type: "array", 
        //       items: { type: "string" },
        //       description: "A list of 2-3 club names relevant to the user's query." 
        //     },
        //     isClubRelated: { type: "boolean" }
        //   },
        //   required: ["replyText", "suggestedClubs"]
        // }
      }
    });

    // --- LOG TOKEN USAGE HERE ---
    const usage = response.usageMetadata;
    console.log(`\n--- Token Usage ---`);
    console.log(`Prompt Tokens: ${usage.promptTokenCount}`);
    console.log(`Response Tokens: ${usage.candidatesTokenCount}`);
    console.log(`Total Tokens: ${usage.totalTokenCount}`);
    console.log(`-------------------\n`);

    res.json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

/*
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: 'user', parts: [{ text: message }] }],
      config: {
        // PERSONA & CONTEXT INJECTION
        systemInstruction: `
          You are the UBC AMS Club Assistant. 
          Use the following club data to answer user questions:
          
          CLUB LIST + ID: ${clubList}
          
          Guidelines:
          1. If a club is not in the data, politely say you don't have information on it.
          2. Always be helpful and encouraging to students.
        `,
        // // FORMAT INJECTION (Forces JSON output)
        // responseMimeType: "application/json",
        // responseSchema: {
        //   type: "object",
        //   properties: {
        //     replyText: { type: "string", description: "The main conversational response." },
        //     suggestedClubs: { 
        //       type: "array", 
        //       items: { type: "string" },
        //       description: "A list of 2-3 club names relevant to the user's query." 
        //     },
        //     isClubRelated: { type: "boolean" }
        //   },
        //   required: ["replyText", "suggestedClubs"]
        // }
      }
    });

    // Since we forced JSON, we parse it before sending to the frontend
    const result = JSON.parse(response.text);
    res.json(result);

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});
*/

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});