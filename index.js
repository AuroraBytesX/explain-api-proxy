import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/explain", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": "https://yourfrontend.com",
        "X-Title": "Explain Like I'm Root"
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85,
        max_tokens: 300
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(3000, () => {
  console.log("✅ API proxy server running on port 3000");
});
