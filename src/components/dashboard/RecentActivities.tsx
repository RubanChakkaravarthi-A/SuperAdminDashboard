import { useTenants } from "../hooks/useTenants";

const RecentActivities = () => {
  const { data: tenants, isLoading, isError } = useTenants();

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur-md">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Recent Activities
        </h2>

        <p className="py-10 text-center text-gray-500">
          Loading activities...
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-100 bg-white/80 p-6 shadow-sm backdrop-blur-md">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Recent Activities
        </h2>

        <p className="py-10 text-center text-red-500">
          Failed to load activities.
        </p>
      </section>
    );
  }

  const activities =
    tenants
      ?.slice()
      .sort(
        (a, b) =>
          new Date(b.created).getTime() -
          new Date(a.created).getTime()
      )
      .slice(0, 5)
      .map((tenant) => ({
        id: tenant.id,
        title: "Tenant created",
        description: `${tenant.name} was added to the platform`,
        date: tenant.created,
      })) ?? [];

  return (
    <section className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur-md">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">
        Recent Activities
      </h2>

      {activities.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          No recent activities.
        </p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {activity.description}
                  </p>
                </div>

                <span className="text-xs text-gray-400">
                  {activity.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentActivities;