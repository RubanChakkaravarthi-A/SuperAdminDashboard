import KpiCards from "../dashboard/KpiCards";
import PlatformHealth from "../dashboard/PlatformHealth";
import Analytics from "../dashboard/Analytics";
import RecentActivities from "../dashboard/RecentActivities";
import AttentionCenter from "../dashboard/AttentionCenter";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <main className="page-shell mx-auto max-w-[1400px] px-6 py-10">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Platform overview</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Welcome back, Administrator</h1>
        <p className="mt-2 text-sm text-slate-500">Here is a snapshot of your platform activity and operational health.</p>
      </div>

      <div className="space-y-12">
        <KpiCards />

        <AttentionCenter />

        <PlatformHealth />

        <Analytics />

        <RecentActivities />

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div><h2 className="text-xl font-semibold text-slate-900">Quick Actions</h2><p className="mt-1 text-sm text-slate-500">Jump directly to common administrative tasks.</p></div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <QuickAction to="/tenants" label="Add or manage tenants" />
            <QuickAction to="/users" label="Add or manage users" />
            <QuickAction to="/organizations" label="Manage organizations" />
            <QuickAction to="/roles" label="Manage roles" />
          </div>
        </section>
      </div>
    </main>
  );
};

const QuickAction = ({ to, label }: { to: string; label: string }) => <Link to={to} className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">{label}<span className="ml-2 text-blue-600">→</span></Link>;

export default Dashboard;
