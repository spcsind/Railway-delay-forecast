import React, { useState } from "react";
import "./App.css";
import TrainMap from "./components/TrainMap";
import useTrainWebSocket from "./hooks/useTrainWebSocket";
import Train3D from "./components/Train3D";

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
  const [selectedTrainNumber, setSelectedTrainNumber] =
    useState("12345");

  const selectedTrain = trains.find(
    (train) => train.number === selectedTrainNumber
  );

  // Backend WebSocket supported trains
  const liveSupportedTrains = ["12345", "12459"];

  const isLiveSupported = liveSupportedTrains.includes(
    selectedTrainNumber
  );

  const { liveData, connected } = useTrainWebSocket(
    isLiveSupported ? selectedTrainNumber : null
  );

  // Use live backend data when available.
  // Otherwise use the existing static data.
  const displayTrain = {
    ...selectedTrain,

    delay:
      liveData?.current_delay_minutes ??
      selectedTrain.delay,

    prediction:
      liveData?.predicted_delay_minutes ??
      selectedTrain.prediction,

    eta: liveData?.predicted_eta
      ? new Date(
          liveData.predicted_eta
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : selectedTrain.eta,
  };

  const delayChange =
    displayTrain.prediction - displayTrain.delay;

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

          {connected
            ? "Live Updates Connected"
            : "System Online"}
        </div>
      </header>

      <main className="dashboard">

        {/* Train Selector */}
        <section className="selector-card">

          <div>
            <span className="label">
              TRAIN SELECTION
            </span>

            <h2>Select Train</h2>
          </div>

          <select
            value={selectedTrainNumber}
            onChange={(event) =>
              setSelectedTrainNumber(
                event.target.value
              )
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
              <span className="label">
                TRAIN
              </span>

              <h2>
                {selectedTrain.number}{" "}
                {selectedTrain.name}
              </h2>
            </div>

            <span className="running-badge">
              RUNNING
            </span>

          </div>

          {/* Route Progress */}
          <div className="route-progress">

            {selectedTrain.route.map(
              (station, index) => {

                const isCurrent =
                  station.name ===
                  selectedTrain.currentStation;

                const isNext =
                  station.name ===
                  selectedTrain.nextStation;

                return (
                  <React.Fragment
                    key={station.code}
                  >

                    <div
                      className={`route-stop ${
                        isCurrent
                          ? "current"
                          : isNext
                          ? "next"
                          : ""
                      }`}
                    >

                      <div className="stop-marker">
                        {isCurrent
                          ? "🚆"
                          : isNext
                          ? "●"
                          : "○"}
                      </div>

                      <div className="stop-info">

                        <span className="station-code">
                          {station.code}
                        </span>

                        <strong>
                          {station.name}
                        </strong>

                        <span className="station-delay">
                          +
                          {station.delay} min
                        </span>

                      </div>

                    </div>

                    {index <
                      selectedTrain.route.length -
                        1 && (
                      <div
                        className={`route-connector ${
                          index === 0
                            ? "active"
                            : ""
                        }`}
                      ></div>
                    )}

                  </React.Fragment>
                );
              }
            )}

          </div>

        </section>

        {/* Statistics */}
        <section className="stats-grid">

          {/* Current Delay */}
          <div className="stat-card">

            <span>
              Current Delay
            </span>

            <strong>
              +{displayTrain.delay.toFixed(1)} min
            </strong>

            <small>
              Current operational delay
            </small>

          </div>

          {/* Predicted Delay */}
          <div className="stat-card">

            <span>
              Predicted Delay
            </span>

            <strong>
              +{displayTrain.prediction.toFixed(1)} min
            </strong>

            <small>
              At {selectedTrain.nextStation}
            </small>

          </div>

          {/* Predicted ETA */}
          <div className="stat-card">

            <span>
              Predicted ETA
            </span>

            <strong>
              {displayTrain.eta}
            </strong>

            <small>
              {selectedTrain.nextStation}
            </small>

          </div>

          {/* Speed */}
          <div className="stat-card">

            <span>
              Speed
            </span>

            <strong>
              {selectedTrain.speed} km/h
            </strong>

            <small>
              Current running speed
            </small>

          </div>

          {/* Delay Change */}
          <div className="stat-card">

            <span>
              Delay Change
            </span>

            <strong>
              {delayChange >= 0 ? "+" : ""}
              {delayChange.toFixed(1)} min
            </strong>

            <small>
              {delayChange > 0
                ? "Delay increasing"
                : delayChange < 0
                ? "Delay recovering"
                : "Delay stable"}
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

            {/* Current Delay */}
            <div className="prediction-item">

              <span>
                Current Delay
              </span>

              <strong>
                {displayTrain.delay.toFixed(1)} min
              </strong>

            </div>

            <div className="arrow">
              →
            </div>

            {/* Predicted Delay */}
            <div className="prediction-item">

              <span>
                Predicted at{" "}
                {selectedTrain.nextStation}
              </span>

              <strong>
                {displayTrain.prediction.toFixed(1)} min
              </strong>

            </div>

            <div className="arrow">
              →
            </div>

            {/* Delay Change */}
            <div className="prediction-item">

              <span>
                Expected Change
              </span>

              <strong>
                {delayChange >= 0 ? "+" : ""}
                {delayChange.toFixed(1)} min
              </strong>

            </div>

          </div>

          <div className="analysis-message">

            <strong>
              Delay propagation detected
            </strong>

            <p>
              The model predicts that the current{" "}
              {displayTrain.delay.toFixed(1)}
              -minute delay may change to
              approximately{" "}
              {displayTrain.prediction.toFixed(1)}
              {" "}minutes at{" "}
              {selectedTrain.nextStation}.
            </p>

          </div>

        </section>

        {/* System Overview */}
        <section className="overview-card">

          <div className="section-title">

            <div>

              <span className="label">
                SYSTEM OVERVIEW
              </span>

              <h2>
                Train Monitoring Summary
              </h2>

            </div>

            <span className="prediction-badge">
              Live Dashboard
            </span>

          </div>

          <div className="overview-grid">

            <div className="overview-item">

              <span className="overview-icon">
                🚆
              </span>

              <div>

                <strong>
                  {trains.length}
                </strong>

                <small>
                  Trains Monitored
                </small>

              </div>

            </div>

            <div className="overview-item">

              <span className="overview-icon">
                📍
              </span>

              <div>

                <strong>
                  {selectedTrain.currentStation}
                </strong>

                <small>
                  Current Location
                </small>

              </div>

            </div>

            <div className="overview-item">

              <span className="overview-icon">
                🎯
              </span>

              <div>

                <strong>
                  {selectedTrain.nextStation}
                </strong>

                <small>
                  Next Station
                </small>

              </div>

            </div>

            <div className="overview-item">

              <span className="overview-icon">
                📊
              </span>

              <div>

                <strong>
                  {selectedTrain.route.length}
                </strong>

                <small>
                  Upcoming Stations
                </small>

              </div>

            </div>

          </div>

        </section>

        {/* Delay Propagation */}
        <section className="propagation-card">

          <div className="section-title">

            <div>

              <span className="label">
                PREDICTION
              </span>

              <h2>
                Delay Propagation
              </h2>

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
                {displayTrain.delay.toFixed(1)} min
              </div>

              <div
                className="propagation-bar"
                style={{
                  height: `${Math.max(
                    displayTrain.delay * 8,
                    30
                  )}px`,
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
            {selectedTrain.route.map(
              (station, index) => {

                const previousDelay =
                  index === 0
                    ? displayTrain.delay
                    : selectedTrain.route[
                        index - 1
                      ].delay;

                const stationDelay =
                  index === 0
                    ? displayTrain.prediction
                    : station.delay;

                const stationDelayChange =
                  stationDelay - previousDelay;

                return (

                  <div
                    className="propagation-point"
                    key={station.code}
                  >

                    <div className="propagation-value">
                      {stationDelay.toFixed(1)} min
                    </div>

                    <div
                      className="propagation-bar"
                      style={{
                        height: `${Math.max(
                          stationDelay * 8,
                          30
                        )}px`,
                      }}
                    ></div>

                    <strong>
                      {station.name}
                    </strong>

                    <small>
                      {station.code}
                    </small>

                    <span className="propagation-change">

                      {stationDelayChange > 0
                        ? `+${stationDelayChange.toFixed(
                            1
                          )} min`
                        : stationDelayChange < 0
                        ? `${stationDelayChange.toFixed(
                            1
                          )} min`
                        : "Stable"}

                    </span>

                  </div>

                );
              }
            )}

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

        {/* 3D Visualization */}
        <section className="map-card">

          <h2>
            3D Railway Visualization
          </h2>

          <p>
            Interactive 3D view of the train and railway track.
          </p>

          <Train3D />

        </section>

        {/* Upcoming Stations */}
        <section className="map-card">

          <div className="section-header">

            <div>

              <h2>
                Upcoming Stations
              </h2>

              <p>
                Predicted arrival and delay across
                the remaining route.
              </p>

            </div>

            <span className="prediction-badge">
              ML Prediction
            </span>

          </div>

          <div className="table-wrapper">

            <table className="stations-table">

              <thead>

                <tr>

                  <th>
                    Station
                  </th>

                  <th>
                    Scheduled Arrival
                  </th>

                  <th>
                    Predicted Arrival
                  </th>

                  <th>
                    Predicted Delay
                  </th>

                  <th>
                    Delay Change
                  </th>

                </tr>

              </thead>

              <tbody>

                {selectedTrain.route.map(
                  (station, index) => {

                    const previousDelay =
                      index === 0
                        ? displayTrain.delay
                        : selectedTrain.route[
                            index - 1
                          ].delay;

                    const stationDelay =
                      index === 0
                        ? displayTrain.prediction
                        : station.delay;

                    const delayChange =
                      stationDelay -
                      previousDelay;

                    return (

                      <tr key={station.code}>

                        <td>

                          <strong>
                            {station.name}
                          </strong>

                          <span className="table-code">
                            {station.code}
                          </span>

                        </td>

                        <td>
                          {station.scheduled}
                        </td>

                        <td>
                          {index === 0
                            ? displayTrain.eta
                            : station.predicted}
                        </td>

                        <td>

                          <span className="delay-value">
                            +
                            {stationDelay.toFixed(1)}
                            {" "}min
                          </span>

                        </td>

                        <td>

                          <span
                            className={
                              delayChange > 0
                                ? "delay-increase"
                                : delayChange < 0
                                ? "delay-recovery"
                                : "delay-stable"
                            }
                          >

                            {delayChange > 0
                              ? `+${delayChange.toFixed(
                                  1
                                )} min`
                              : delayChange < 0
                              ? `${delayChange.toFixed(
                                  1
                                )} min`
                              : "Stable"}

                          </span>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

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