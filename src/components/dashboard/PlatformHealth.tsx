const PlatformHealth = () => {
  const healthItems = [
    {
      name: "API Gateway",
      status: "Healthy",
      type: "status",
    },
    {
      name: "Database",
      status: "Connected",
      type: "status",
    },
    {
      name: "Server",
      status: "Running",
      type: "status",
    },
    {
      name: "Storage",
      status: "68%",
      type: "usage",
    },
    {
      name: "CPU",
      status: "42%",
      type: "usage",
    },
    {
      name: "Memory",
      status: "61%",
      type: "usage",
    },
  ];

  return (
    <section className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur-md">
      <h2 className="mb-5 text-xl font-semibold text-gray-800">
        Platform Health
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {healthItems.map((item) => (
          <div
            key={item.name}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                {item.name}
              </span>

              {item.type === "status" ? (
                <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-600">
                  {item.status}
                </span>
              ) : (
                <span className="text-sm font-semibold text-blue-600">
                  {item.status}
                </span>
              )}
            </div>

            {item.type === "usage" && (
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{
                    width: item.status,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlatformHealth;