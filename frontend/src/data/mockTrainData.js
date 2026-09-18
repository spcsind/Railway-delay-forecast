const mockTrainData = {
  trainId: "12345",
  trainNumber: "12345",
  trainName: "Sample Express",

  journey: {
    origin: "New Delhi",
    destination: "Amritsar"
  },

  currentStatus: {
    location: {
      lat: 30.901,
      lng: 75.857
    },
    speed: 72,
    currentStation: "Ludhiana",
    nextStation: "Jalandhar",
    delayMinutes: 8,
    status: "RUNNING",
    lastUpdated: "2026-09-07T10:30:00+05:30"
  },

  prediction: {
    nextStation: "Jalandhar",
    eta: "2026-09-07T11:02:00+05:30",
    predictedDelayMinutes: 11,
    confidence: 0.91
  },

  upcomingStations: [
  {
    stationCode: "JUC",
    stationName: "Jalandhar",
    location: {
      lat: 31.326,
      lng: 75.576
    },
    scheduledArrival: "10:51",
    predictedArrival: "11:02",
    predictedDelayMinutes: 11,
    confidence: 0.91
  },

  {
    stationCode: "BEAS",
    stationName: "Beas",
    location: {
      lat: 31.518,
      lng: 75.292
    },
    scheduledArrival: "11:25",
    predictedArrival: "11:37",
    predictedDelayMinutes: 12,
    confidence: 0.87
  },

  {
    stationCode: "ASR",
    stationName: "Amritsar",
    location: {
      lat: 31.634,
      lng: 74.872
    },
    scheduledArrival: "12:20",
    predictedArrival: "12:34",
    predictedDelayMinutes: 14,
    confidence: 0.82
  }
]
};

export default mockTrainData;