
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/message")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }
        return response.json();
      })
      .then(setData)
      .catch(() => {
        setError("Could not connect to the backend. Please check FastAPI.");
      });
  }, []);

  return (
    <main style={{
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      padding: "60px 20px",
      background: "#f0fdf4",
      minHeight: "100vh",
      boxSizing: "border-box"
    }}>
      <h1 style={{ color: "#166534" }}>🌱 FarmPay AI</h1>

      {data ? (
        <>
          <h2>{data.message}</h2>
          <p>{data.description}</p>
          <p style={{ color: "#166534" }}>{data.backend}</p>
        </>
      ) : (
        <p>{error || "Connecting to FarmPay AI backend..."}</p>
      )}
    </main>
  );
}

export default App;
