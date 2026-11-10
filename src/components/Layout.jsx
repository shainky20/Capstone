import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import api from "../api";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I'm your Gemini Copilot ✦  Ask me about delays, routes, risks, or any shipment.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const askGemini = async () => {
    const userText = input.trim();
    if (!userText || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chat", {
        message: userText,
      });

      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("The chat service returned an empty response.");
      }

      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (err) {
      console.error("Chat request failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `⚠️ ${err.response?.data?.error || err.message || "Chat service unavailable."} Please try again.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askGemini();
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "24px",
          background: "linear-gradient(135deg,#f0f7ff 0%,#e8f4fd 50%,#f8faff 100%)",
          position: "relative",
          minHeight: "100vh",
        }}
      >
        <Topbar />
        {children}

        {/* FLOAT BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          title="Open Gemini Copilot"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            border: "none",
            background: "linear-gradient(135deg,#2563eb,#0ea5e9)",
            color: "white",
            fontSize: "26px",
            cursor: "pointer",
            boxShadow: "0 4px 24px rgba(37,99,235,.45)",
            zIndex: 1000,
            transition: "transform 0.2s",
          }}
        >
          {open ? "✕" : "✦"}
        </button>

        {/* CHAT PANEL */}
        {open && (
          <div
            style={{
              position: "fixed",
              bottom: "100px",
              right: "24px",
              width: "380px",
              height: "540px",
              background: "#ffffff",
              borderRadius: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 12px 48px rgba(37,99,235,.18)",
              display: "flex",
              flexDirection: "column",
              zIndex: 1000,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(135deg,#2563eb,#0ea5e9)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "22px" }}>✦</span>
              <div>
                <div style={{ color: "white", fontWeight: "700", fontSize: "15px" }}>
                  Gemini Copilot
                </div>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px" }}>
                  Powered by Gemini
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "82%",
                      padding: "11px 14px",
                      borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg,#2563eb,#0ea5e9)"
                          : "#f1f5f9",
                      color: msg.role === "user" ? "white" : "#1e293b",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      boxShadow: msg.role === "user"
                        ? "0 2px 8px rgba(37,99,235,.25)"
                        : "none",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div style={{ display: "flex", gap: "4px", paddingLeft: "4px" }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#94a3b8",
                        animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                      }}
                    />
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                gap: "8px",
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about shipments, risks, routes…"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "11px 14px",
                  borderRadius: "12px",
                  border: "1.5px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#1e293b",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
              <button
                onClick={askGemini}
                disabled={loading || !input.trim()}
                style={{
                  padding: "11px 16px",
                  border: "none",
                  borderRadius: "12px",
                  background: loading || !input.trim()
                    ? "#e2e8f0"
                    : "linear-gradient(135deg,#2563eb,#0ea5e9)",
                  color: loading || !input.trim() ? "#94a3b8" : "white",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  fontWeight: "700",
                  fontSize: "15px",
                  transition: "all 0.2s",
                }}
              >
                ➤
              </button>
            </div>
          </div>
        )}

        {/* Bounce animation for typing dots */}
        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}