import KpiCards from "../dashboard/KpiCards";
import PlatformHealth from "../dashboard/PlatformHealth";
import Analytics from "../dashboard/Analytics";
import RecentActivities from "../dashboard/RecentActivities";

const Dashboard = () => {
  return (
    <main className="mx-auto max-w-[1400px] px-6 py-10">
      <h1 className="mb-10 text-3xl font-bold text-blue-900">
        Super Admin Dashboard
      </h1>

      <div className="space-y-12">
        <KpiCards />

        <PlatformHealth />

        <Analytics />

        <RecentActivities />
      </div>
    </main>
  );
};

export default Dashboard;