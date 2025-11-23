export async function askGemini(message) {
  const response = await fetch("https://chatbot-backend-ej2h.onrender.com/api/gemini/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: message }),
  });

  return response.text(); 
}

export async function predictSeatConfirmation(data) {
  const response = await fetch(
    "https://chatbot-backend-ej2h.onrender.com/api/prediction/seat-confirmation",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  return response.json();
}
