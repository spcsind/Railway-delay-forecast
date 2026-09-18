import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import {
  useEffect,
  useState,
} from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ================================
// Train Marker
// ================================

const trainIcon = L.divIcon({
  className: "train-marker",
  html: "🚆",
  iconSize: [35, 35],
  iconAnchor: [17, 17],
});

// ================================
// Station Marker
// ================================

const stationIcon = L.divIcon({
  className: "station-marker",
  html: "●",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// ================================
// Train Map
// ================================

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

  // ================================
  // Find Current Station
  // ================================

  const currentIndex = stations.findIndex(
    (station) =>
      station.name === train.currentStation
  );

  // ================================
  // Find Next Station
  // ================================

  const nextIndex = stations.findIndex(
    (station) =>
      station.name === train.nextStation
  );

  // ================================
  // Calculate Train Position
  // ================================

  let trainPosition = null;

  if (
    currentIndex !== -1 &&
    nextIndex !== -1
  ) {
    const currentPosition =
      stations[currentIndex].position;

    const nextPosition =
      stations[nextIndex].position;

    // Temporary simulated progress
    // 0 = current station
    // 1 = next station
    const progress = 0.5;

    trainPosition = [
      currentPosition[0] +
        (nextPosition[0] -
          currentPosition[0]) *
          progress,

      currentPosition[1] +
        (nextPosition[1] -
          currentPosition[1]) *
          progress,
    ];
  }

  // ================================
  // Complete Route
  // ================================

  const routeCoordinates = stations.map(
    (station) => station.position
  );

  // ================================
  // Current Station
  // ================================

  const currentStation = stations.find(
    (station) =>
      station.name === train.currentStation
  );

  // ================================
  // Next Station
  // ================================

  const nextStation = stations.find(
    (station) =>
      station.name === train.nextStation
  );

  // ================================
  // UI
  // ================================

  return (
    <div className="map-wrapper">

      {/* ================================
          Map Status Overlay
      ================================= */}

      <div className="map-status-overlay">

        <div className="map-status-header">

          <div>
            <span>LIVE TRAIN</span>

            <strong>
              {train.number} {train.name}
            </strong>
          </div>

          <div className="map-live-indicator">

            <span></span>

            LIVE

          </div>

        </div>

        {/* Current → Next */}

        <div className="map-status-route">

          <div>

            <small>
              CURRENT
            </small>

            <strong>
              {train.currentStation}
            </strong>

          </div>

          <div className="map-route-arrow">
            →
          </div>

          <div>

            <small>
              NEXT
            </small>

            <strong>
              {train.nextStation}
            </strong>

          </div>

        </div>

        {/* Train Statistics */}

        <div className="map-status-stats">

          <div>

            <small>
              Speed
            </small>

            <strong>
              {train.speed} km/h
            </strong>

          </div>

          <div>

            <small>
              Current Delay
            </small>

            <strong>
              +{train.delay} min
            </strong>

          </div>

          <div>

            <small>
              Predicted Delay
            </small>

            <strong>
              +{train.prediction} min
            </strong>

          </div>

        </div>

      </div>

      {/* ================================
          Leaflet Map
      ================================= */}

      <MapContainer
        center={[31.1, 75.7]}
        zoom={8}
        scrollWheelZoom={true}
        className="train-map"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

       
        {/* ================================
    Complete Railway Route
================================ */}

<Polyline
  positions={routeCoordinates}
  pathOptions={{
    color: "#9ca3af",
    weight: 4,
    opacity: 0.6,
  }}
/>

{/* ================================
    Active Train Section
================================ */}

{currentIndex !== -1 && nextIndex !== -1 && (
  <Polyline
    positions={[
      stations[currentIndex].position,
      stations[nextIndex].position,
    ]}
    pathOptions={{
      color: "#2563eb",
      weight: 7,
      opacity: 0.9,
    }}
  />
)}
        {/* ================================
            Stations
        ================================= */}

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

        {/* ================================
            Current Train
        ================================= */}

        {currentStation && (

          <Marker
            position={
              trainPosition ||
              currentStation.position
            }
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

              Next Station:
              {" "}
              {train.nextStation}

              <br />

              Speed:
              {" "}
              {train.speed} km/h

              <br />

              Current Delay:
              {" "}
              +{train.delay} min

              <br />

              Predicted Delay:
              {" "}
              +{train.prediction} min

            </Popup>

          </Marker>

        )}

        {/* ================================
            Next Station
        ================================= */}

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