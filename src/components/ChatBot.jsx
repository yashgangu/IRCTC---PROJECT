import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import { askGemini } from "../api/geminiApi";
import "../styles/ChatBot.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const stopRef = useRef(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Typing effect
  const typeEffect = async (fullText) => {
    setIsTyping(true);
    stopRef.current = false;
    let displayed = "";

    for (let i = 0; i < fullText.length; i++) {
      if (stopRef.current) break;

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

  // Seat Prediction
  const predictSeatConfirmation = (text) => {
    const wlRegex = /(?:wl|waitlist|waiting\s?list|wlist|wating\s?list)\s*(\d+)/i;
    const match = text.match(wlRegex);

    if (!match) {
      return {
        waitlist: null,
        probability: "N/A",
        status: "Please specify a waitlist number like 'WL 25'.",
      };
    }

    const waitlist = parseInt(match[1]);
    let probability = 0;

    if (waitlist <= 10) probability = 90;
    else if (waitlist <= 20) probability = 75;
    else if (waitlist <= 40) probability = 55;
    else if (waitlist <= 60) probability = 35;
    else probability = 10;

    return {
      waitlist,
      probability: probability + "%",
      status: probability >= 50 ? "High Chance" : "Low Chance",
    };
  };

  // Send message
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setInput("");
    stopRef.current = false;

    setMessages((prev) => [...prev, { sender: "user", text }]);

    // Detect WL
    const wlMatch = text.match(/(?:wl|waitlist|waiting\s?list|wlist|wating\s?list)\s*(\d+)/i);

    if (wlMatch) {
      setIsTyping(true);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Calculating seat confirmation probability..." },
      ]);
      await new Promise((res) => setTimeout(res, 1200));

      if (stopRef.current) { setIsTyping(false); return; }

      const result = predictSeatConfirmation(text);

      setMessages((prev) =>
        prev.filter((msg) => msg.text !== "Calculating seat confirmation probability...")
      );

      const response = `
**🎯 Seat Confirmation Prediction**

- Waitlist: **${result.waitlist}**
- Probability: **${result.probability}**
- Expected Status: **${result.status}**

Let me know if you want prediction using train number & journey date for more accuracy 🚆🙂
      `;

      setMessages((prev) => [...prev, { sender: "bot", text: response }]);
      setIsTyping(false);
      return;
    }

    // Normal chatbot flow
    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

    try {
      const response = await askGemini(text, { signal: abortControllerRef.current.signal });
      if (!stopRef.current) {
        await typeEffect(response);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setMessages((prev) => [...prev, { sender: "bot", text: "_Response stopped._" }]);
      } else {
        console.error(err);
      }
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleStop = () => {
    stopRef.current = true;
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setIsTyping(false);
    setIsLoading(false);
  };

  return (
    <>
      {!open && (
        <div className="chat-icon" onClick={() => setOpen(true)}>💬</div>
      )}

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            IRCTC Chatbot
            <button className="close-btn" onClick={() => setOpen(false)}>×</button>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
                dangerouslySetInnerHTML={{ __html: marked(msg.text || "") }}
              />
            ))}

            {isTyping && (
              <div className="typing">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          <div className="chat-footer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask IRCTC Chatbot..."
              onKeyDown={(e) => e.key === "Enter" && (isTyping || isLoading ? handleStop() : sendMessage(input))}
            />
            <button onClick={() => (isTyping || isLoading ? handleStop() : sendMessage(input))}>
              {isTyping || isLoading ? "⏹ Stop" : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
