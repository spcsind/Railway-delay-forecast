

function StatusCards({ trainData }) {
  const { currentStatus, prediction } = trainData;

  const cards = [
    {
      title: "Current Speed",
      value: `${currentStatus.speed} km/h`,
      description: "Live train speed",
    },
    {
      title: "Current Delay",
      value: `+${currentStatus.delayMinutes} min`,
      description: "Current delay",
    },
    {
      title: "Predicted ETA",
      value: new Date(prediction.eta).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      description: `at ${prediction.nextStation}`,
    },
    {
      title: "Confidence",
      value: `${Math.round(prediction.confidence * 100)}%`,
      description: "Prediction confidence",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-gray-500">
            {card.title}
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {card.value}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {card.description}
          </p>
        </div>
      ))}
    </section>
  );
}

export default StatusCards;