import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline
} from "react-leaflet";

import "leaflet/dist/leaflet.css";


function TrainMap({ trainData }) {
  const { currentStatus, upcomingStations } = trainData;

  const currentPosition = [
    currentStatus.location.lat,
    currentStatus.location.lng
  ];

  const stationPositions = upcomingStations.map((station) => [
    station.location.lat,
    station.location.lng
  ]);

  const route = [currentPosition, ...stationPositions];

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Live Train Map
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Current location and upcoming route
        </p>
      </div>

      <div className="h-[400px]">
        <MapContainer
          center={currentPosition}
          zoom={9}
          scrollWheelZoom={false}
          className="h-full w-full"
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Current train */}
          <Marker position={currentPosition}>
            <Popup>
              <strong>{trainData.trainName}</strong>
              <br />
              Currently at {currentStatus.currentStation}
              <br />
              Speed: {currentStatus.speed} km/h
            </Popup>
          </Marker>

          {/* Upcoming stations */}
          {upcomingStations.map((station) => (
            <Marker
              key={station.stationCode}
              position={[
                station.location.lat,
                station.location.lng
              ]}
            >
              <Popup>
                <strong>{station.stationName}</strong>
                <br />
                ETA: {station.predictedArrival}
              </Popup>
            </Marker>
          ))}

          {/* Route */}
          <Polyline positions={route} />

        </MapContainer>
      </div>
    </section>
  );
}

export default TrainMap;