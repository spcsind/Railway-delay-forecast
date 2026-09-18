import { useState } from "react";

function TrainHeader({ trainData }) {
const { trainNumber, trainName, journey, currentStatus } = trainData;

  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();

    if (!searchValue.trim()) {
      return;
    }

    console.log("Searching for train:", searchValue);
  };

  const getStatusStyle = () => {
    switch (currentStatus.status) {
      case "RUNNING":
        return "bg-green-100 text-green-700";
      case "DELAYED":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">

      {/* Top row */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

        {/* Train information */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium text-gray-500">
              Train {trainNumber}
            </p>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle()}`}
            >
              {currentStatus.status}
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            {trainName}
          </h1>

          <p className="mt-1 text-gray-600">
            {journey.origin} → {journey.destination}
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-sm gap-2"
        >
          <input
            type="text"
            placeholder="Search train number..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
          />

          <button
            type="submit"
            className="rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Current journey status */}
      <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Currently at
          </p>

          <p className="mt-1 text-lg font-semibold text-gray-900">
            {currentStatus.currentStation}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Next station
          </p>

          <p className="mt-1 text-lg font-semibold text-gray-900">
            {currentStatus.nextStation}
          </p>
        </div>

      </div>
    </section>
  );
}

export default TrainHeader;