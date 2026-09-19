import { useEffect, useState } from "react";

export default function useTrainWebSocket(trainNumber) {
  const [liveData, setLiveData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!trainNumber) {
      return;
    }

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/trains/ws/${trainNumber}`
    );

    ws.onopen = () => {
      console.log(`WebSocket connected: ${trainNumber}`);
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("Live train update:", data);

      setLiveData(data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log(`WebSocket closed: ${trainNumber}`);
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [trainNumber]);

  return {
    liveData,
    connected,
  };
}