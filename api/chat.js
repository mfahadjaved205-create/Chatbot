module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

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

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};