app.post("/explain", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "HTTP-Referer": "https://bolt.new",  // ✅ Use your actual frontend URL if deployed
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

    // ✅ Return only the part your frontend expects
    res.json({
      choices: [
        {
          message: {
            content: data.choices?.[0]?.message?.content || "🤯 No explanation received."
          }
        }
      ]
    });

  } catch (err) {
    console.error("🚨 Backend error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

