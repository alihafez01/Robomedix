import React, { useEffect, useState } from "react";

const Medication = () => {
  const [meds, setMeds] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const raw = query.get("data");

    if (!raw) return setError("Missing data.");
    const { disease, symptoms } = JSON.parse(decodeURIComponent(raw));

    const fetchMeds = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/predict-meds/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ disease, symptoms }),
        });
        const data = await res.json();
        setMeds(data.medicines || []);
      } catch (err) {
        setError("Error fetching medications.");
      }
    };

    fetchMeds();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white flex items-center justify-center px-4">
      <div className="bg-[#2a2a4a] p-8 rounded-xl shadow-xl text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">💊 Recommended Medicines</h2>
        {error ? (
          <p className="text-red-400">{error}</p>
        ) : meds.length > 0 ? (
          <ul className="text-left space-y-2">
            {meds.map((med, idx) => (
              <li key={idx}>• {med}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Medication;
