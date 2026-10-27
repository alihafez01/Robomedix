import React, { useEffect, useState } from "react";

const DiseaseResult = ({ summary }) => {
  const [disease, setDisease] = useState(null);
  const [error, setError] = useState("");
  const [goToMedication, setGoToMedication] = useState(false);

  useEffect(() => {
    const predictDisease = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/predict-disease/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(summary),
        });
        const data = await res.json();
        setDisease(data.disease);
      } catch (err) {
        setError("Prediction failed.");
      }
    };

    predictDisease();
  }, [summary]);

  // ✅ Trigger redirect
  if (goToMedication && disease) {
    const symptoms = [summary.Symptom_1, summary.Symptom_2, summary.Symptom_3]
      .filter(Boolean)
      .join(", ");
    const encoded = encodeURIComponent(JSON.stringify({ disease, symptoms }));
    window.location.href = `/medication?data=${encoded}`;
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white flex items-center justify-center">
      <div className="bg-[#2a2a4a] p-8 rounded-xl shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4">🧬 Prediction Result</h2>
        {disease ? (
          <>
            <p className="text-xl text-green-400 mb-4">
              Predicted Disease: <strong>{disease}</strong>
            </p>
            <button
              onClick={() => setGoToMedication(true)}
              className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-full text-white font-semibold"
            >
              Get Medication
            </button>
          </>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <p>Analyzing...</p>
        )}
      </div>
    </div>
  );
};

export default DiseaseResult;
