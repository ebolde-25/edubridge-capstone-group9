const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const API_KEY = "";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const conversationHistory = [];

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const message = userInput.value.trim();
  if (message === "") return;

  addMessage("You", message);
  userInput.value = "";

  callGroqAPI(message);
}

function addMessage(sender, text) {
  const msg = document.createElement("p");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function callGroqAPI(prompt) {
  const thinkingMsg = document.createElement("p");
  thinkingMsg.innerHTML = `<strong>AI:</strong> Thinking...`;
  thinkingMsg.id = "thinking";
  chatBox.appendChild(thinkingMsg);

  conversationHistory.push({
    role: "user",
    content: prompt
  });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI tutor for EduBridge, an educational platform. Help students understand their lessons clearly and simply."
          },
          ...conversationHistory
        ]
      })
    });

    const data = await response.json();
    console.log("Groq response:", data);
    const aiResponse = data.choices?.[0]?.message?.content || "I couldn't understand that.";

    conversationHistory.push({ role: "assistant", content: aiResponse });

    document.getElementById("thinking")?.remove();
    addMessage("AI", aiResponse);

  } catch (error) {
    document.getElementById("thinking")?.remove();
    addMessage("AI", "Oops! Something went wrong: " + error.message);
    console.error("Full error:", error);
  }
}