import Navbar from "../components/Navbar";
import TrainHeader from "../components/TrainHeader";
import StatusCards from "../components/StatusCards";
import TrainMap from "../components/TrainMap";
import ETAChart from "../components/ETAChart";
import StationTimeline from "../components/StationTimeline";

function Dashboard({ trainData }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-6">
        <TrainHeader trainData={trainData} />

        <StatusCards trainData={trainData} />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TrainMap trainData={trainData} />
          <ETAChart trainData={trainData} />
        </div>

        <StationTimeline trainData={trainData} />
      </main>
    </div>
  );
}

export default Dashboard;