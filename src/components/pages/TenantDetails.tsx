import { Link, useParams } from "react-router-dom";
import { useTenant } from "../hooks/useTenant";
import { useAuditLogs, useFeatures, useOrganizations, useSubscriptionPlans, useToggleTenantFeature, useUsers } from "../hooks/usePortal";

const TenantDetails = () => {
  const { tenantId = "" } = useParams();
  const { data: tenant, isLoading, isError } = useTenant(tenantId);
  const { data: organizations = [] } = useOrganizations();
  const { data: users = [] } = useUsers();
  const { data: features = [] } = useFeatures();
  const { data: plans = [] } = useSubscriptionPlans();
  const { data: auditLogs = [] } = useAuditLogs();
  const toggleFeature = useToggleTenantFeature();

  if (isLoading) return <PageMessage message="Loading tenant details..." />;
  if (isError || !tenant) return <PageMessage message="Tenant not found." error />;

  const organization = organizations.find((item) => item.id === tenant.organizationId);
  const tenantUsers = users.filter((user) => user.tenantId === tenant.id || user.tenantIds.includes(tenant.id));
  const plan = plans.find((item) => item.name === tenant.plan);
  const activities = auditLogs.filter((log) => log.targetName === tenant.name).slice(0, 8);
  const enabledIds = tenant.enabledFeatureIds ?? plan?.featureIds ?? [];

  return (
    <main className="page-shell mx-auto max-w-[1400px] px-6 py-10">
      <Link to="/tenants" className="text-sm font-medium text-blue-600 hover:text-blue-700">← Back to tenants</Link>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div><h1 className="text-3xl font-bold text-blue-900">{tenant.name}</h1><p className="mt-1 text-slate-500">{tenant.code} · {tenant.status}</p></div>
        <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">{tenant.licenseStatus ?? "Active"} license</span>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-800">Tenant summary</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <Detail label="Organization" value={organization?.name ?? "Not assigned"} /><Detail label="Administrator" value={`${tenant.admin} · ${tenant.email}`} />
            <Detail label="Country / timezone" value={`${tenant.country} · ${tenant.timezone}`} /><Detail label="Plan" value={tenant.plan} />
            <Detail label="Seats" value={`${tenant.users} used of ${tenant.seatLimit ?? plan?.seatLimit ?? 0}`} /><Detail label="Renewal date" value={tenant.renewalDate ?? "Not set"} />
          </dl>
        </section>
        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">Assigned users</h2>
          <p className="mt-2 text-3xl font-bold text-blue-600">{tenantUsers.length}</p>
          <p className="mt-1 text-sm text-slate-500">Users with tenant data access</p>
        </section>
        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-800">Features</h2>
          <div className="mt-4 space-y-3">
            {features.map((feature) => {
              const enabled = enabledIds.includes(feature.id);
              const eligible = feature.eligiblePlans.includes(tenant.plan);
              return <div key={feature.id} className="flex flex-col gap-3 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-medium text-slate-800">{feature.name}</p><p className="text-sm text-slate-500">{feature.description}</p></div><button type="button" disabled={!eligible || toggleFeature.isPending} onClick={() => toggleFeature.mutate({ tenantId: tenant.id, featureId: feature.id })} className={`rounded-lg px-3 py-2 text-sm font-medium ${enabled ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-700"} disabled:cursor-not-allowed disabled:opacity-50`}>{enabled ? "Enabled" : eligible ? "Enable" : "Plan required"}</button></div>;
            })}
          </div>
        </section>
        <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">Recent activity</h2>
          <div className="mt-4 space-y-3">{activities.length ? activities.map((log) => <div key={log.id} className="border-b border-slate-100 pb-3 last:border-0"><p className="text-sm font-medium text-slate-700">{log.action}</p><p className="text-xs text-slate-500">{new Date(log.created).toLocaleString()}</p></div>) : <p className="text-sm text-slate-500">No activity yet.</p>}</div>
        </section>
      </div>
    </main>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 text-sm font-medium text-slate-700">{value}</dd></div>;
const PageMessage = ({ message, error = false }: { message: string; error?: boolean }) => <main className="mx-auto max-w-[1400px] px-6 py-10"><p className={error ? "text-red-600" : "text-slate-500"}>{message}</p></main>;

export default TenantDetails;
