

function StationTimeline({ trainData }) {
  const { upcomingStations } =  trainData ;

  return (
    <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Upcoming Stations
        </h2>

        <p className="text-sm text-gray-500">
          Predicted arrival times along the remaining route
        </p>
      </div>

      <div className="space-y-4">
        {upcomingStations.map((station, index) => {
          const confidence = Math.round(station.confidence * 100);

          return (
            <div
              key={station.stationCode}
              className="flex items-center gap-4 rounded-xl border border-gray-100 p-4"
            >
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-blue-600" />

                {index !== upcomingStations.length - 1 && (
                  <div className="mt-1 h-10 w-px bg-gray-200" />
                )}
              </div>

              {/* Station information */}
              <div className="flex-1">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {station.stationName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {station.stationCode}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-gray-900">
                      {station.predictedArrival}
                    </p>

                    <p className="text-sm text-gray-500">
                      Scheduled: {station.scheduledArrival}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-gray-100 px-3 py-1">
                    +{station.predictedDelayMinutes} min delay
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-1">
                    {confidence}% confidence
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default StationTimeline;