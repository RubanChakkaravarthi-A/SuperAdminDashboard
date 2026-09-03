import { useMonitoring } from "../hooks/usePortal";

const PlatformHealth = () => {
  const { data } = useMonitoring();
  const healthItems = data ? [
    ...data.services.map((service) => ({ name: service.name, status: service.status, type: "status" })),
    ...data.usage.map((usage) => ({ name: usage.name, status: `${usage.value}%`, type: "usage" })),
  ] : [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-800">
          Platform Health
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Current status of platform services
        </p>
      </div>

      {/* Health Items */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

        {healthItems.map((item) => (
          <div
            key={item.name}
            className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-slate-200 hover:bg-white"
          >

            {/* Name + Status */}
            <div className="flex items-center justify-between gap-3">

              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {item.name}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Platform service
                </p>
              </div>

              {item.type === "status" ? (
                <div className="flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-sm font-medium text-green-600">
                    {item.status}
                  </span>

                </div>
              ) : (
                <span className="text-sm font-semibold text-slate-700">
                  {item.status}
                </span>
              )}

            </div>

            {/* Usage Bar */}
            {item.type === "usage" && (
              <div className="mt-4">

                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">

                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{
                      width: item.status,
                    }}
                  />

                </div>

              </div>
            )}

          </div>
        ))}

      </div>

    </section>
  );
};

export default PlatformHealth;
