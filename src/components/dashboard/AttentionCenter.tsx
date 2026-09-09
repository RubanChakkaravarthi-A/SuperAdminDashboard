import { Link } from "react-router-dom";
import { useTenants } from "../hooks/useTenants";

export default function AttentionCenter() {
  const { data: tenants = [] } = useTenants();
  const expiring = tenants.filter((tenant) => tenant.licenseStatus === "Expiring");
  const inactive = tenants.filter((tenant) => tenant.status === "Inactive");
  const nearLimit = tenants.filter((tenant) => tenant.seatLimit && tenant.users / tenant.seatLimit >= 0.8);
  const alerts = [
    { label: "License expiring soon", value: expiring.length, tone: "amber", detail: expiring.map((tenant) => tenant.name).join(", ") || "No renewal action needed" },
    { label: "Inactive tenants", value: inactive.length, tone: "slate", detail: inactive.map((tenant) => tenant.name).join(", ") || "All tenants are active" },
    { label: "Seat-limit alerts", value: nearLimit.length, tone: "red", detail: nearLimit.map((tenant) => tenant.name).join(", ") || "No tenant is near its seat limit" },
  ];
  const styles = { amber: "border-amber-200 bg-amber-50", slate: "border-slate-200 bg-slate-50", red: "border-red-200 bg-red-50" };
  return <section><div className="flex items-end justify-between"><div><h2 className="text-xl font-semibold text-slate-900">Needs attention</h2><p className="mt-1 text-sm text-slate-500">Operational signals that may need an administrator response.</p></div><Link to="/subscriptions" className="text-sm font-semibold text-blue-700 hover:text-blue-800">Review licenses →</Link></div><div className="mt-5 grid gap-4 md:grid-cols-3">{alerts.map((alert) => <Link key={alert.label} to="/tenants" className={`rounded-2xl border p-5 transition hover:shadow-sm ${styles[alert.tone as keyof typeof styles]}`}><p className="text-sm font-semibold text-slate-800">{alert.label}</p><p className="mt-2 text-3xl font-bold text-slate-900">{alert.value}</p><p className="mt-2 text-xs leading-5 text-slate-600">{alert.detail}</p></Link>)}</div></section>;
}
