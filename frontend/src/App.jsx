import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import mockTrainData from "./data/mockTrainData";

function App() {
  const [trainData, setTrainData] = useState(mockTrainData);

  return (
    <Dashboard trainData={trainData} />
  );
}

export default App;
