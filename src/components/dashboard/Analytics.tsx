import { useTenants } from "../hooks/useTenants";

const Analytics = () => {
  const { data: tenants, isLoading, isError } = useTenants();

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur-md">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Tenant Growth
        </h2>

        <p className="py-10 text-center text-gray-500">
          Loading analytics...
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-100 bg-white/80 p-6 shadow-sm backdrop-blur-md">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Tenant Growth
        </h2>

        <p className="py-10 text-center text-red-500">
          Failed to load analytics.
        </p>
      </section>
    );
  }

  const totalTenants = tenants?.length ?? 0;

  const activeTenants =
    tenants?.filter(
      (tenant) => tenant.status === "Active"
    ).length ?? 0;

  const inactiveTenants =
    tenants?.filter(
      (tenant) => tenant.status === "Inactive"
    ).length ?? 0;

  const data = [
    {
      label: "Total",
      value: totalTenants,
    },
    {
      label: "Active",
      value: activeTenants,
    },
    {
      label: "Inactive",
      value: inactiveTenants,
    },
  ];

  const maxValue = Math.max(
    ...data.map((item) => item.value),
    1
  );

  return (
    <section className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur-md">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">
        Tenant Growth
      </h2>

      <div className="flex h-64 items-end gap-4 sm:gap-8">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex h-full flex-1 flex-col items-center justify-end"
          >
            <span className="mb-2 text-sm font-semibold text-blue-600">
              {item.value}
            </span>

            <div
              className="w-full max-w-20 rounded-t-xl bg-blue-500 transition-all duration-500"
              style={{
                height: `${Math.max(
                  (item.value / maxValue) * 80,
                  5
                )}%`,
              }}
            />

            <span className="mt-3 text-sm text-gray-500">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Analytics;