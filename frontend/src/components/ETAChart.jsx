import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";



function ETAChart({ trainData }) {
  const { upcomingStations } = trainData;

  const chartData = upcomingStations.map((station) => ({
    station: station.stationCode,

    scheduled: new Date(
      `2026-09-07T${station.scheduledArrival}:00`
    ).getTime(),

    predicted: new Date(
      `2026-09-07T${station.predictedArrival}:00`
    ).getTime(),
  }));

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          ETA Forecast
        </h2>

        <p className="text-sm text-gray-500">
          Scheduled vs predicted arrival
        </p>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="station" />

            <YAxis
              type="number"
              domain={["auto", "auto"]}
              tickFormatter={(value) =>
                new Date(value).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            />

            <Tooltip
              labelFormatter={(label) =>
                `Station: ${label}`
              }
              formatter={(value) =>
                new Date(value).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="scheduled"
              name="Scheduled"
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicted"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ETAChart;