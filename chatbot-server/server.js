import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Render ke liye check route (browser mein "Cannot GET /" ki jagah ye dikhega)
app.get("/", (req, res) => {
  res.send("Chatbot server is running");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        max_tokens: 1500,
        messages: [
          {
            role: "system",
            content:
              "You are a friendly assistant. Reply in Hinglish (Roman Urdu mixed with English). Keep answers short.",
          },
          ...messages,
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));