const OPENROUTER_API_KEY = "YOUR_API_KEY_HERE"; // Use free OpenRouter key

function startListening() {
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();

  speak("I'm listening");

  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript;
    console.log("Heard:", text);
    const reply = await askAI(text);
    speak(reply);
  };
}

async function askAI(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistral/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;
  console.log("AI:", reply);
  return reply;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}
