import { marked } from "marked";

import { useEffect, useRef, useState } from "react";
import { askGemini } from "../api/geminiApi";
import "../styles/ChatBot.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false); // chat window open/close
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Typing effect
  const typeEffect = async (fullText) => {
    setIsTyping(true);
    let displayed = "";

    for (let i = 0; i < fullText.length; i++) {
      await new Promise((res) => setTimeout(res, 15));
      displayed += fullText[i];

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = displayed;
        return updated;
      });
    }
    setIsTyping(false);
  };

  // Send message to backend
  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setInput("");

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setIsLoading(true);

    // Temporary bot message for typing animation
    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

    const response = await askGemini(text);
    setIsLoading(false);

    await typeEffect(response);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!open && (
        <div className="chat-icon" onClick={() => setOpen(true)}>
          💬
        </div>
      )}

      {/* Chat Window */}
      {open && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            IRCTC Chatbot
            <button className="close-btn" onClick={() => setOpen(false)}>
              ×
            </button>
          </div>

          {/* Chat Body */}
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-message ${
                 msg.sender === "user" ? "user-msg" : "bot-msg"
              } ${msg.text === "..." ? "loading-msg" : ""}`}
                dangerouslySetInnerHTML={{ __html: marked(msg.text || "") }}

              />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="typing">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          {/* Suggested Quick Replies */}
          <div style={{ display: "flex", gap: 6, padding: "8px" }}>
            <button onClick={() => sendMessage("Check PNR status")}>
              Check PNR
            </button>
            <button onClick={() => sendMessage("Train running status")}>
              Train Status
            </button>
            <button onClick={() => sendMessage("Book a train ticket")}>
              Book Ticket
            </button>
          </div>

          {/* Footer Input */}
          <div className="chat-footer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask IRCTC Chatbot..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            />

            <button onClick={() => sendMessage(input)}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
