import { useState, useRef, useEffect } from "react";

const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";
const API_KEY = import.meta.env.VITE_HF_API_KEY;

const SYSTEM_PROMPT = `You are a luxury salon AI assistant for Goodness Glamour Salon.
You help users with hairstyles, haircuts, hair coloring, hair treatments, hair care routines, salon suggestions, and styling tips.
Keep replies friendly, elegant, professional, short to medium length, and use emojis naturally.
If unrelated questions are asked, politely redirect to salon and hair topics.`;

const SUGGESTIONS = [
  "Best haircut for round face? ✂️",
  "Hair color ideas ✨",
  "How to stop hair fall? 🌿",
  "Keratin vs smoothening 💆‍♀️",
];

export default function GeminiChatSidebar() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello beautiful ✨ I'm your Goodness Glamour Hair Assistant. Ask me about hairstyles, treatments, hair colors, or salon care 💇‍♀️",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    if (open) inputRef.current?.focus();
  }, [messages, open]);

  const sendMessage = async (customText) => {
    const text = (customText || input).trim();
    if (!text || loading) return;

    const updatedMessages = [...messages, { role: "user", text }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      console.log(API_KEY);
      // ✅ Build prompt in Mistral instruct format
      let prompt = `<s>[INST] <<SYS>>\n${SYSTEM_PROMPT}\n<</SYS>>\n\n`;

      // Add conversation history
      const history = updatedMessages.filter((_, i) => i > 0); // skip greeting
      history.forEach((msg, i) => {
        if (msg.role === "user") {
          if (i === 0) {
            prompt += `${msg.text} [/INST]`;
          } else {
            prompt += ` <s>[INST] ${msg.text} [/INST]`;
          }
        } else {
          prompt += ` ${msg.text} </s>`;
        }
      });

      const response = await fetch("http://localhost:4000/api/hair-ai", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: text }),
});

const data = await response.json();

if (data.error) throw new Error(data.error);

let reply = data.reply || "✨ Sorry, I couldn't respond right now.";

      // Clean up any leftover prompt artifacts
      reply = reply.replace(/\[INST\]|\[\/INST\]|<<SYS>>|<\/SYS>>|<s>|<\/s>/g, "").trim();

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (error) {
      console.error("HF error:", error.message);
      let errorMsg = "⚠️ Something went wrong. Please try again.";
      if (error.message?.includes("loading")) {
        errorMsg = "⏳ Model is loading, please wait 20 seconds and try again.";
      } else if (error.message?.includes("token") || error.message?.includes("auth")) {
        errorMsg = "⚠️ API key issue. Check VITE_HF_API_KEY in your .env file.";
      }
      setMessages((prev) => [...prev, { role: "assistant", text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          right: open ? "370px" : "0",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 9999,
          border: "none",
          cursor: "pointer",
          padding: "14px 10px",
          borderRadius: "14px 0 0 14px",
          background: "linear-gradient(180deg, #c89b6d 0%, #8b5e3c 50%, #3d2a1f 100%)",
          color: "white",
          fontWeight: "700",
          letterSpacing: "0.08em",
          boxShadow: "-4px 0 20px rgba(0,0,0,0.25)",
          transition: "0.3s",
        }}
      >
        <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "12px" }}>
          HAIR AI ✂️
        </div>
      </button>

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: open ? 0 : "-370px",
          width: "370px",
          height: "100vh",
          background: "#fdf8f4",
          backdropFilter: "blur(18px)",
          boxShadow: "-10px 0 40px rgba(0,0,0,0.18)",
          zIndex: 9998,
          transition: "0.35s ease",
          display: "flex",
          flexDirection: "column",
          borderLeft: "1px solid rgba(200,155,109,0.25)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "22px 20px",
            background: "linear-gradient(135deg, #c89b6d 0%, #8b5e3c 50%, #3d2a1f 100%)",
            color: "white",
            boxShadow: "0 3px 14px rgba(0,0,0,0.12)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>✨ Hair Assistant</h2>
              <p style={{ margin: "5px 0 0", fontSize: "12px", opacity: 0.9 }}>
                Goodness Glamour · AI
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "none",
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                color: "white",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {messages.length <= 1 && (
            <div style={{ marginTop: "14px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  style={{
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    borderRadius: "30px",
                    padding: "7px 12px",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {messages.map((msg, index) => (
            <div key={index} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div
                style={{
                  maxWidth: "80%",
                  padding: "12px 14px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.role === "user" ? "linear-gradient(135deg,#c89b6d,#6e4a31)" : "white",
                  color: msg.role === "user" ? "white" : "#333",
                  lineHeight: "1.6",
                  fontSize: "13.5px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ background: "white", width: "80px", padding: "14px", borderRadius: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
              Thinking ✨
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "14px", borderTop: "1px solid #ead9c9", background: "#fff" }}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              background: "#faf5ef",
              borderRadius: "14px",
              padding: "10px",
              border: "1px solid #e5d2bf",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask your hair question..."
              style={{ flex: 1, border: "none", outline: "none", resize: "none", background: "transparent", fontSize: "14px" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                background: loading || !input.trim() ? "#ccc" : "linear-gradient(135deg,#c89b6d,#6e4a31)",
                color: "white",
                fontSize: "16px",
              }}
            >
              ➤
            </button>
          </div>
          <p style={{ textAlign: "center", fontSize: "11px", marginTop: "7px", color: "#9d8875" }}>
            Press Enter to send ✨
          </p>
        </div>
      </div>
    </>
  );
}