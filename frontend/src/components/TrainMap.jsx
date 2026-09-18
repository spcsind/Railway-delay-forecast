import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons in Vite
const trainIcon = L.divIcon({
  className: "train-marker",
  html: "🚆",
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});

const stationIcon = L.divIcon({
  className: "station-marker",
  html: "●",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function TrainMap({ train }) {

  // Punjab corridor - demo coordinates
  const stations = [
    {
      name: "Ambala",
      code: "UMB",
      position: [30.3782, 76.7767],
    },
    {
      name: "Ludhiana",
      code: "LDH",
      position: [30.9009, 75.8573],
    },
    {
      name: "Jalandhar",
      code: "JUC",
      position: [31.3260, 75.5762],
    },
    {
      name: "Beas",
      code: "BEAS",
      position: [31.5390, 75.3000],
    },
    {
      name: "Amritsar",
      code: "ASR",
      position: [31.6340, 74.8723],
    },
  ];

  const routeCoordinates = stations.map(
    (station) => station.position
  );

  const currentStation = stations.find(
    (station) =>
      station.name === train.currentStation
  );

  const nextStation = stations.find(
    (station) =>
      station.name === train.nextStation
  );

  return (
    <div className="map-wrapper">

      <MapContainer
        center={[31.1, 75.7]}
        zoom={8}
        scrollWheelZoom={true}
        className="train-map"
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Railway Route */}
        <Polyline
          positions={routeCoordinates}
        />

        {/* Stations */}
        {stations.map((station) => (

          <Marker
            key={station.code}
            position={station.position}
            icon={stationIcon}
          >

            <Popup>

              <strong>
                {station.name}
              </strong>

              <br />

              Code: {station.code}

            </Popup>

          </Marker>

        ))}

        {/* Current Train */}
        {currentStation && (

          <Marker
            position={currentStation.position}
            icon={trainIcon}
          >

            <Popup>

              <strong>
                {train.number} {train.name}
              </strong>

              <br />

              Current Location:
              {" "}
              {train.currentStation}

              <br />

              Speed:
              {" "}
              {train.speed} km/h

              <br />

              Delay:
              {" "}
              +{train.delay} min

            </Popup>

          </Marker>

        )}

        {/* Next Station */}
        {nextStation && (

          <Marker
            position={nextStation.position}
            icon={stationIcon}
          >

            <Popup>

              <strong>
                Next Station
              </strong>

              <br />

              {nextStation.name}

              <br />

              Predicted ETA:
              {" "}
              {train.eta}

              <br />

              Predicted Delay:
              {" "}
              +{train.prediction} min

            </Popup>

          </Marker>

        )}

      </MapContainer>

    </div>
  );
}

export default TrainMap;