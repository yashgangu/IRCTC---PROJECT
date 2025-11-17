export async function askGemini(message) {
  const response = await fetch("http://localhost:8080/api/gemini/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: message }),
  });

  return response.text(); 
}
