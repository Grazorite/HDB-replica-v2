import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// AI Chatbot endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Invalid messages array." });
      return;
    }

    // Prepare system instructions for HDB context
    const systemInstruction = `You are 'Ask HDB', an intelligent and friendly AI Virtual Assistant for the Housing & Development Board (HDB) of Singapore. Your role is to answer citizens' queries about HDB flats, BTO (Build-To-Order) applications, Resale flats, HDB Flat Eligibility (HFE) letters, housing grants, and season parking. 

Key details to keep in mind:
1. Enhanced CPF Housing Grant (EHG): Up to $80,000 for families depending on monthly household income (must not exceed $9,000).
2. Family Grant: Up to $80,000 for couples buying resale flats (income ceiling $14,000).
3. Proximity Housing Grant (PHG): Up to $30,000 for those living near or with parents/children.
4. Season parking: Standard parking costs around $80 - $110/month depending on car park type.
5. HFE Letter: Standard document that details eligibility for buying, grants, and loans.

Keep your responses highly concise, structured with bullet points, extremely professional, and warm. Limit answers to under 150 words. Invite users to use the interactive HFE Calculator and Season Parking renewal tools available directly on this portal!`;

    // Map messages for Gemini
    // For general text tasks, use "gemini-3.5-flash"
    const contents = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I apologize, but I couldn't generate a response. Please try again.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with AI Assistant." });
  }
});

// Simple health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Setup Vite Dev server or production static serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HDB Server running at http://0.0.0.0:${PORT}`);
  });
}

setupVite().catch(err => {
  console.error("Vite setup failure:", err);
});
