import React, { useState, useEffect } from "react";
import axios from "axios";
import DiseaseResult from "./DiseaseResult"; // make sure it's in same folder or adjust path


const ChatbotUI = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [structuredSummary, setStructuredSummary] = useState(null);
  const [showDiseasePage, setShowDiseasePage] = useState(false);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/sensors/");
        const data = res.data;
        setSensorData(data);
        setMessages([
          {
            type: "bot",
            text: "Let me know how you're feeling today.",
          },
        ]);
      } catch (err) {
        console.error("Error fetching sensor data:", err);
        setSensorData(null);
      }
    };

    fetchSensorData();
  }, []);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { type: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    let botResponse = [];

    try {
      if (currentQuestion) {
        const res = await axios.post(
          "http://localhost:8000/api/chatbot/followup/",
          {
            question: String(currentQuestion),
            answer: String(userInput.trim()),
          },
          {
            withCredentials: true,
          }
        );

        let nextQ = res.data?.next_question;
        console.log("🔁 Follow-up Next Question:", nextQ);

        if (typeof nextQ !== "string" && nextQ !== null) {
          nextQ = JSON.stringify(nextQ, null, 2);
        }

        if (nextQ) {
          botResponse.push({ type: "bot", text: nextQ });
          setCurrentQuestion(nextQ);
        } else {
          const summaryRes = await axios.get(
            "http://localhost:8000/api/chatbot/summary/",
            {
              withCredentials: true,
            }
          );

          let summary = summaryRes.data?.summary || "Summary not available.";
          let structured = summaryRes.data?.structured || {};
          setStructuredSummary(structured); // ✅ Store for prediction
          if (typeof summary !== "string") {
            summary = JSON.stringify(summary, null, 2);
          }

          botResponse = [
            { type: "bot", text: "Thanks for your answers. Here's the summary:" },
            { type: "bot", text: summary },
            { type: "bot", text: "🧾 Structured Health Report:" },
            { type: "bot", text: JSON.stringify(structured, null, 2) }
          ];

          setShowPopup(true);  // ✅ Show popup
          setCurrentQuestion(null);
        }
      } else {
        const res = await axios.post(
          "http://localhost:8000/api/chatbot/message/",
          {
            message: userInput,
          },
          {
            withCredentials: true,
          }
        );

        console.log("📦 Bot Reply:", res.data.response);
        console.log("🧠 Next Question:", res.data.next_question);

        let botReply = res.data?.response || "Sorry, I didn't get that.";
        let nextQ = res.data?.next_question;

        if (typeof botReply !== "string") {
          botReply = JSON.stringify(botReply, null, 2);
        }

        if (typeof nextQ !== "string" && nextQ !== null) {
          nextQ = JSON.stringify(nextQ, null, 2);
        }

        botResponse.push({ type: "bot", text: botReply });

        if (nextQ) {
          botResponse.push({ type: "bot", text: nextQ });
          setCurrentQuestion(nextQ);
        } else {
          setCurrentQuestion(null);
        }
      }

      setMessages((prev) => [...prev, ...botResponse]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "⚠️ Error: Could not reach server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  if (showDiseasePage && structuredSummary) {
  return <DiseaseResult summary={structuredSummary} />;
}
  return (

    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col items-center justify-center px-4 py-8 relative">
      {/* Header */}
      <div className="mb-8 text-center">
        <img src="/logo.png" alt="robomedix" className="mx-auto w-20 mb-2" />
        <h1 className="text-2xl md:text-3xl font-bold">
          How Are you feeling Today ?
        </h1>
        <p className="text-sm text-gray-300 mt-1">
          Tell me about your health condition in detail, for diagnosis & medication
        </p>
      </div>

      {/* Sensor Data */}
      {sensorData ? (
        <div className="mb-6 text-center text-sm p-4 rounded-xl shadow-md max-w-xl w-full">
          <p>🌡️ <strong>Temperature:</strong> {sensorData.temperature}°F</p>
          <p>❤️ <strong>Heart Rate:</strong> {sensorData.heart_rate} bpm</p>
          <p>🫁 <strong>Oxygen Level:</strong> {sensorData.oxygen_level}%</p>
        </div>
      ) : (
        <div className="mb-6 text-center text-sm p-4 rounded-xl shadow-md max-w-xl w-full">
          <p>Loading sensor data...</p>
        </div>
      )}

      {/* Chat Messages */}
      <div className="w-full max-w-2xl h-[300px] overflow-y-auto bg-[#1c1c3a] rounded-2xl p-4 mb-6 space-y-2 shadow-inner">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] px-4 py-2 rounded-xl text-sm whitespace-pre-line ${
              msg.type === "user"
                ? "ml-auto bg-purple-600 text-white"
                : "mr-auto bg-gray-700 text-gray-100"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-xs italic text-gray-400">Bot is thinking...</div>
        )}
      </div>

      {/* Input */}
      <div className="relative w-full max-w-2xl">
        <input
          type="text"
          placeholder="Type here..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full bg-[#1a1a2e] border border-purple-500 rounded-full py-3 px-5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
        />
        <button
          onClick={sendMessage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 p-2 rounded-full shadow-md transition"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2.94 2.94a1.5 1.5 0 012.12 0l12 12a1.5 1.5 0 01-2.12 2.12l-12-12a1.5 1.5 0 010-2.12z" />
          </svg>
        </button>
      </div>

      {/* ✅ Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1f1f3d] text-white rounded-2xl shadow-xl px-8 py-6 max-w-md w-full text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Thanks for your answers.</h2>
            <p className="text-sm text-gray-300 mb-5">
              Click on below button to know your disease
            </p>
            <button
              onClick={() => {
                setShowPopup(false);
                console.log("🧠 Get Disease clicked");
                setShowDiseasePage(true);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-full transition shadow-md"
            >
              Get Disease
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotUI;
