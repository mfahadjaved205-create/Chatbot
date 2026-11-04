const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// API ke liye history (sirf user/assistant roles, pehla message user ka hona chahiye)
const history = [];

function addMessage(text, from) {
  const div = document.createElement("div");
  div.className = `msg ${from}`;
  const span = document.createElement("span");
  span.textContent = text; // textContent use kiya taake HTML injection na ho
  div.appendChild(span);
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text || sendBtn.disabled) return;

  addMessage(text, "user");
  history.push({ role: "user", content: text });
  userInput.value = "";
  sendBtn.disabled = true;

  const typing = addMessage("Typing...", "bot");

  try {
    const res = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history }),
    });
    const data = await res.json();

    typing.remove();
    const reply = data.reply || "Kuch masla ho gaya, dobara try karein.";
    addMessage(reply, "bot");
    history.push({ role: "assistant", content: reply });
  } catch (err) {
    typing.remove();
    addMessage("Server se connect nahi ho paya.", "bot");
    history.pop(); // fail hone par last user message history se hata do
  } finally {
    sendBtn.disabled = false;
    userInput.focus();
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

addMessage("Salam! Mujh se kuch bhi poochein.", "bot");