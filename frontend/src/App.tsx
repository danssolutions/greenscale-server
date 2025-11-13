import { useState, useEffect } from 'react'
import './App.css'


function App() {
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/telemetry-data/latest", {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => setTelemetry(data))
    .catch((err) => console.error(err));
  }, []);

  return (
    <pre>{JSON.stringify(telemetry, null, 2)}</pre>
  );
}

export default App
