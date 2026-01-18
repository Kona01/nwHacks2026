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
const clubDataStr = await readFile('./data/ams_clubs_data.json', 'utf8');
const clubData = JSON.parse(clubDataStr);

// 1. Initialize the client (Note: The new SDK can also pick up GEMINI_API_KEY from .env automatically)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getClubIds = async (req) => {
  const { message, history } = req.body;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: `
        You are the UBC AMS Club Assistant. 
        Use the following club data to answer user questions:
        
        CLUB LIST (Name, ID): 
        ${clubList}
        
        TASK:
        2. Return the 'id' for each relevant club in the 'matchingIds' array.
        3. If the user's query is general or does not mention specific clubs from the list, 'matchingIds' must be an empty list [].
        4. Always be helpful and encouraging.
        5. Never answer questions unrelated to UBC clubs.
        6. Assume the user knows nothing about any club, and cannot see the list given to you.
      `,
      // Force JSON output
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          replyText: {
            type: "string",
            description: "The conversational response to the student. Do not reference club id"
          },
          matchingIds: {
            type: "array",
            items: { type: "integer" },
            description: "A list of IDs for clubs the user is interested in. Empty if none."
          }
        },
        required: ["replyText", "matchingIds"]
      }
    }
  });

  // Logging Usage
  const usage = response.usageMetadata;
  console.log(`\n--- Token Usage (Get Club Id) ---`);
  console.log(`Prompt Tokens: ${usage.promptTokenCount}`);
  console.log(`Total Tokens: ${usage.totalTokenCount}\n`);

  const result = JSON.parse(response.text);

  return result;
}


app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  const clubIdsRes = await getClubIds(req);
  const replyText = clubIdsRes["replyText"];
  const replyIds = clubIdsRes["matchingIds"]

  console.log("=== CLUB ID RESPONSE ===")
  console.log(clubIdsRes)
  console.log("========================")

  if ( !replyIds ) {
    if (replyText) {
      res.json({ text: replyText });
    } else {
      console.error("Gemini API Error: Malformed getClubIds Response");
      console.error(clubIdsRes);
      res.status(500).json({ error: "Failed to fetch AI response" });
    }

    return;
  }

  const clubIdsInfo = replyIds.reduce((acc, key) => {
    if (clubData[String(key)]) {
      acc[key] = clubData[String(key)];
    }
    return acc;
  }, {});

  console.log(clubIdsInfo);

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

          Guidelines:
          1. If a club is not in the data, politely say you don't have information on it.
          2. Always be helpful and encouraging to students.
          3. Never answer questions unrelated to clubs at UBC.
          4. Assume the user knows nothing about any club, and cannot see the list given to you.
          5. Do not reference club ids in your response.
          6. If referencing a club, format their information in markdown.

          Your original response without additional data: ${replyText}

          NEW ADDITIONAL DATA (Cannot be seen by user):
          ${JSON.stringify(clubIdsInfo)}
        `
      }
    });

    // --- LOG TOKEN USAGE HERE ---
    const usage = response.usageMetadata;
    console.log(`\n--- Token Usage ---`);
    console.log(`Prompt Tokens: ${usage.promptTokenCount}`);
    console.log(`Response Tokens: ${usage.candidatesTokenCount}`);
    console.log(`Total Tokens: ${usage.totalTokenCount}`);
    console.log(`-------------------\n`);

    res.json({ text: response.text, referencedIds: replyIds });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to fetch AI response" });
  }
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});