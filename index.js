// index.js

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config(); // Load .env variables

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// POST route to handle explanation request
app.post("/explain", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided." });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "HTTP-Referer": "https://bolt.new", // You can update this later to your deployed frontend
        "X-Title": "Explain Like I'm Root"
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.85,
        max_tokens: 300
      })
    });

    const data = await response.json();
    console.log("✅ Loaded API Key:", process.env.API_KEY);

    // ✅ Add this log to see the full response
    console.log("✅ OpenRouter API FULL Response:", JSON.stringify(data, null, 2));

    res.json({
      choices: [
        {
          message: {
            content: data.choices?.[0]?.message?.content || "🤯 No explanation received."
          }
        }
      ]
    });

  } catch (error) {
    console.error("🚨 Backend error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
