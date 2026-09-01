import { useTenants } from "../hooks/useTenants";

const KpiCards = () => {
  const { data: tenants, isLoading, isError } = useTenants();

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-blue-100 bg-white/80 p-5 shadow-sm backdrop-blur-md"
          >
            <p className="text-sm font-medium text-gray-500">
              Loading...
            </p>

            <div className="mt-3 h-9 w-20 animate-pulse rounded-lg bg-gray-200" />
          </div>
        ))}
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-100 bg-white/80 p-6 shadow-sm backdrop-blur-md">
        <p className="text-center text-red-500">
          Failed to load dashboard data.
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

  const totalUsers =
    tenants?.reduce(
      (total, tenant) => total + tenant.users,
      0
    ) ?? 0;

  const activeLicenses = activeTenants;

  const cards = [
    {
      title: "Total Tenants",
      value: totalTenants,
    },
    {
      title: "Active Tenants",
      value: activeTenants,
    },
    {
      title: "Inactive Tenants",
      value: inactiveTenants,
    },
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
    },
    {
      title: "Active Licenses",
      value: activeLicenses,
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-blue-100 bg-white/80 p-5 shadow-sm backdrop-blur-md"
        >
          <p className="text-sm font-medium text-gray-500">
            {card.title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {card.value}
          </h2>
        </div>
      ))}
    </section>
  );
};

export default KpiCards;