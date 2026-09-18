import { useState } from "react";
import "./App.css";
import TrainMap from "./components/TrainMap";

const trains = [
  {
    number: "12345",
    name: "Sample Express",
    currentStation: "Ludhiana",
    currentCode: "LDH",
    nextStation: "Jalandhar",
    nextCode: "JUC",
    speed: 72,
    delay: 8,
    eta: "11:02 AM",
    prediction: 11,
    route: [
      {
        name: "Jalandhar",
        code: "JUC",
        scheduled: "10:51 AM",
        predicted: "11:02 AM",
        delay: 11,
      },
      {
        name: "Beas",
        code: "BEAS",
        scheduled: "11:32 AM",
        predicted: "11:45 AM",
        delay: 13,
      },
      {
        name: "Amritsar",
        code: "ASR",
        scheduled: "12:20 PM",
        predicted: "12:34 PM",
        delay: 14,
      },
    ],
  },

  {
    number: "12459",
    name: "New Delhi Express",
    currentStation: "Ambala",
    currentCode: "UMB",
    nextStation: "Ludhiana",
    nextCode: "LDH",
    speed: 81,
    delay: 5,
    eta: "10:48 AM",
    prediction: 7,
    route: [
      {
        name: "Ludhiana",
        code: "LDH",
        scheduled: "10:41 AM",
        predicted: "10:48 AM",
        delay: 7,
      },
      {
        name: "Jalandhar",
        code: "JUC",
        scheduled: "11:25 AM",
        predicted: "11:33 AM",
        delay: 8,
      },
      {
        name: "Amritsar",
        code: "ASR",
        scheduled: "12:15 PM",
        predicted: "12:24 PM",
        delay: 9,
      },
    ],
  },

  {
    number: "14649",
    name: "Intercity Express",
    currentStation: "Ludhiana",
    currentCode: "LDH",
    nextStation: "Phagwara",
    nextCode: "PGW",
    speed: 65,
    delay: 12,
    eta: "10:35 AM",
    prediction: 15,
    route: [
      {
        name: "Phagwara",
        code: "PGW",
        scheduled: "10:20 AM",
        predicted: "10:35 AM",
        delay: 15,
      },
      {
        name: "Jalandhar",
        code: "JUC",
        scheduled: "10:55 AM",
        predicted: "11:12 AM",
        delay: 17,
      },
      {
        name: "Amritsar",
        code: "ASR",
        scheduled: "12:00 PM",
        predicted: "12:20 PM",
        delay: 20,
      },
    ],
  },

  {
    number: "12925",
    name: "Paschim Express",
    currentStation: "Ambala",
    currentCode: "UMB",
    nextStation: "Ludhiana",
    nextCode: "LDH",
    speed: 76,
    delay: 3,
    eta: "09:58 AM",
    prediction: 4,
    route: [
      {
        name: "Ludhiana",
        code: "LDH",
        scheduled: "09:54 AM",
        predicted: "09:58 AM",
        delay: 4,
      },
      {
        name: "Jalandhar",
        code: "JUC",
        scheduled: "10:35 AM",
        predicted: "10:40 AM",
        delay: 5,
      },
      {
        name: "Beas",
        code: "BEAS",
        scheduled: "11:05 AM",
        predicted: "11:11 AM",
        delay: 6,
      },
    ],
  },
];

function App() {
  const [selectedTrainNumber, setSelectedTrainNumber] = useState("12345");

  const selectedTrain = trains.find(
    (train) => train.number === selectedTrainNumber
  );

  const delayChange =
    selectedTrain.prediction - selectedTrain.delay;

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div>
          <h1>Railway ETA Intelligence</h1>
          <p>
            Dynamic Train ETA & Delay Intelligence System
          </p>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      <main className="dashboard">

        {/* Train Selector */}
        <section className="selector-card">

          <div>
            <span className="label">TRAIN SELECTION</span>
            <h2>Select Train</h2>
          </div>

          <select
            value={selectedTrainNumber}
            onChange={(event) =>
              setSelectedTrainNumber(event.target.value)
            }
          >
            {trains.map((train) => (
              <option
                key={train.number}
                value={train.number}
              >
                {train.number} - {train.name}
              </option>
            ))}
          </select>

        </section>

        {/* Train Information */}
<section className="train-card">

  <div className="train-header">

    <div>
      <span className="label">TRAIN</span>

      <h2>
        {selectedTrain.number} {selectedTrain.name}
      </h2>
    </div>

    <span className="running-badge">
      RUNNING
    </span>

  </div>

  {/* Route Progress */}
  <div className="route-progress">

    {/* Current Station */}
    <div className="route-stop current">

      <div className="stop-marker">
        🚆
      </div>

      <div className="stop-info">
        <span className="station-code">
          {selectedTrain.currentCode}
        </span>

        <strong>
          {selectedTrain.currentStation}
        </strong>

        <small>
          Current Location
        </small>
      </div>

    </div>

    <div className="route-connector"></div>

    {/* Next Station */}
    <div className="route-stop next">

      <div className="stop-marker">
        ●
      </div>

      <div className="stop-info">
        <span className="station-code">
          {selectedTrain.nextCode}
        </span>

        <strong>
          {selectedTrain.nextStation}
        </strong>

        <small>
          Next Station
        </small>
      </div>

    </div>

  </div>

</section>
        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card">
            <span>Current Delay</span>

            <strong>
              +{selectedTrain.delay} min
            </strong>

            <small>
              Current train status
            </small>
          </div>

          <div className="stat-card">
            <span>Predicted Delay</span>

            <strong>
              +{selectedTrain.prediction} min
            </strong>

            <small>
              ML predicted
            </small>
          </div>

          <div className="stat-card">
            <span>Predicted ETA</span>

            <strong>
              {selectedTrain.eta}
            </strong>

            <small>
              {selectedTrain.nextStation}
            </small>
          </div>

          <div className="stat-card">
            <span>Speed</span>

            <strong>
              {selectedTrain.speed} km/h
            </strong>

            <small>
              Current speed
            </small>
          </div>

        </section>

        {/* Delay Intelligence */}
        <section className="intelligence-card">

          <div className="section-title">

            <div>
              <span className="label">
                AI / ML
              </span>

              <h2>
                Delay Intelligence
              </h2>
            </div>

            <span className="prediction-badge">
              Prediction Active
            </span>

          </div>

          <div className="prediction-content">

            <div className="prediction-item">

              <span>
                Current Delay
              </span>

              <strong>
                {selectedTrain.delay} min
              </strong>

            </div>

            <div className="arrow">
              →
            </div>

            <div className="prediction-item">

              <span>
                Predicted at {selectedTrain.nextStation}
              </span>

              <strong>
                {selectedTrain.prediction} min
              </strong>

            </div>

            <div className="arrow">
              →
            </div>

            <div className="prediction-item">

              <span>
                Expected Change
              </span>

              <strong>
                {delayChange >= 0 ? "+" : ""}
                {delayChange} min
              </strong>

            </div>

          </div>

          <div className="analysis-message">

            <strong>
              Delay propagation detected
            </strong>

            <p>
              The model predicts that the current{" "}
              {selectedTrain.delay}-minute delay may
              change to approximately{" "}
              {selectedTrain.prediction} minutes at{" "}
              {selectedTrain.nextStation}.
            </p>

          </div>

        </section>
        {/* Delay Propagation */}
<section className="propagation-card">

  <div className="section-title">
    <div>
      <span className="label">PREDICTION</span>
      <h2>Delay Propagation</h2>
    </div>

    <span className="prediction-badge">
      Future Delay Forecast
    </span>
  </div>

  <p className="propagation-description">
    Predicted delay across the remaining route.
  </p>

  <div className="propagation-chart">

    {/* Current Delay */}
    <div className="propagation-point">

      <div className="propagation-value">
        {selectedTrain.delay} min
      </div>

      <div
        className="propagation-bar"
        style={{
          height: `${Math.max(selectedTrain.delay * 8, 30)}px`,
        }}
      ></div>

      <strong>
        {selectedTrain.currentStation}
      </strong>

      <small>
        Current
      </small>

    </div>

    {/* Future Stations */}
    {selectedTrain.route.map((station) => (

      <div
        className="propagation-point"
        key={station.code}
      >

        <div className="propagation-value">
          {station.delay} min
        </div>

        <div
          className="propagation-bar"
          style={{
            height: `${Math.max(station.delay * 8, 30)}px`,
          }}
        ></div>

        <strong>
          {station.name}
        </strong>

        <small>
          {station.code}
        </small>

      </div>

    ))}

  </div>

</section>
{/* Interactive Map */}
<section className="map-card">

  <div className="section-title">

    <div>
      <span className="label">
        LIVE ROUTE
      </span>

      <h2>
        Train Route Map
      </h2>
    </div>

    <span className="prediction-badge">
      Interactive
    </span>

  </div>

  <TrainMap train={selectedTrain} />

</section>
        {/* Upcoming Stations */}
        <section className="stations-card">

          <div className="section-title">

            <div>
              <span className="label">
                ROUTE
              </span>

              <h2>
                Upcoming Stations
              </h2>
            </div>

          </div>

          <div className="station-table">

            <div className="table-header">
              <span>Station</span>
              <span>Scheduled</span>
              <span>Predicted</span>
              <span>Delay</span>
            </div>

            {selectedTrain.route.map((station) => (

              <div
                className="table-row"
                key={station.code}
              >

                <span>
                  <strong>
                    {station.name}
                  </strong>

                  <small>
                    {station.code}
                  </small>
                </span>

                <span>
                  {station.scheduled}
                </span>

                <span>
                  {station.predicted}
                </span>

                <span className="delay">
                  +{station.delay} min
                </span>

              </div>

            ))}

          </div>

        </section>

      </main>

      <footer>
        Last updated: Just now • Data currently simulated
      </footer>

    </div>
  );
}

export default App;