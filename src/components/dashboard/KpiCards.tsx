import { useTenants } from "../hooks/useTenants";
import { useUsers } from "../hooks/usePortal";
import { Link } from "react-router-dom";

const KpiCards = () => {
  const { data: tenants, isLoading, isError } = useTenants();
  const { data: users = [] } = useUsers();

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

  const tenantUserTotal = tenants?.reduce((total, tenant) => total + tenant.users, 0) ?? 0;
  const totalUsers = tenantUserTotal || users.length;

  const activeLicenses = tenants?.filter((tenant) => tenant.status === "Active" && (tenant.licenseStatus ?? "Active") === "Active").length ?? 0;

  const cards = [
    {
      title: "Total Tenants",
      value: totalTenants,
      to: "/tenants",
    },
    {
      title: "Active Tenants",
      value: activeTenants,
      to: "/tenants",
    },
    {
      title: "Inactive Tenants",
      value: inactiveTenants,
      to: "/tenants",
    },
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      to: "/users",
    },
    {
      title: "Active Licenses",
      value: activeLicenses,
      to: "/subscriptions",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Link
          to={card.to}
          key={card.title}
          className="rounded-2xl border border-blue-100 bg-white/80 p-5 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          <p className="text-sm font-medium text-gray-500">
            {card.title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {card.value}
          </h2>
        </Link>
      ))}
    </section>
  );
};

export default KpiCards;
