import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNotifications, useResetDemoWorkspace } from "./components/hooks/usePortal";
import { getActiveDemoSession, signOutDemo } from "./components/api/API";
import { ConfirmDialog, DemoWorkspaceBanner } from "./components/ui/Feedback";
import Dashboard from "./components/pages/Dashboard";
import TenantManagement from "./components/pages/TenantManagement";
import TenantDetails from "./components/pages/TenantDetails";
import Organizations from "./components/pages/Organizations";
import Users from "./components/pages/Users";
import Roles from "./components/pages/Roles";
import { Features, Subscriptions } from "./components/pages/PlatformControls";
import { AuditLogs, Configuration, Monitoring, Notifications, Security } from "./components/pages/Operations";
import Login from "./components/pages/Login";
import { DataPermissions, PermissionManagement } from "./components/pages/AccessControls";

function App() {
  const [authenticated, setAuthenticated] = useState(() => Boolean(getActiveDemoSession()));
  return (
    <Routes>
      <Route path="/" element={authenticated ? <Navigate to="/dashboard" replace /> : <Login onAuthenticated={() => setAuthenticated(true)} />} />
      <Route path="/*" element={authenticated ? <PortalLayout onLogout={() => setAuthenticated(false)} /> : <Navigate to="/" replace />} />
    </Routes>
  );
}

function PortalLayout({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const [isNavigationOpen, setNavigationOpen] = useState(false);
  const [resetConfirmationOpen, setResetConfirmationOpen] = useState(false);
  const reset = useResetDemoWorkspace();
  const logout = () => { signOutDemo(); onLogout(); navigate("/", { replace: true }); };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <DemoWorkspaceBanner onReset={() => setResetConfirmationOpen(true)} isResetting={reset.isPending} />
      <div className="flex min-h-screen">

        {isNavigationOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-slate-950/20 lg:hidden" onClick={() => setNavigationOpen(false)} type="button" />}

        {/* =========================
            SIDEBAR
        ========================== */}
        <aside className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200 bg-white shadow-[8px_0_30px_rgba(15,23,42,0.03)] transition-transform duration-200 ${isNavigationOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

          {/* Brand */}
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
                <span className="text-lg font-bold text-white">
                  S
                </span>
              </div>

              <div>
                <h1 className="text-base font-bold tracking-tight text-slate-900">
                  Super Admin
                </h1>

                <p className="mt-0.5 text-xs text-slate-500">
                  Admin Portal
                </p>
              </div>

            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6" onClick={() => setNavigationOpen(false)}>

            {/* Overview */}
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Overview
            </p>

            <SidebarLink to="/dashboard" label="Dashboard" />

            {/* Management */}
            <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Tenant & Organization
            </p>

            <SidebarLink to="/tenants" label="Tenant Management" />
            <SidebarLink to="/organizations" label="Organization Management" />

            <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Identity & Access</p>
            <SidebarLink to="/users" label="User Management" />
            <SidebarLink to="/roles" label="Role Management" />
            <SidebarLink to="/permissions" label="Permission Management" />
            <SidebarLink to="/data-permissions" label="Data Permissions" />

            <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Platform
            </p>
            <SidebarLink to="/subscriptions" label="Subscription & License" />
            <SidebarLink to="/features" label="Feature Management" />
            <SidebarLink to="/configuration" label="Configuration" />

            <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Operations
            </p>
            <SidebarLink to="/security" label="Security" />
            <SidebarLink to="/audit-logs" label="Audit Logs" />
            <SidebarLink to="/notifications" label="Notifications" />
            <SidebarLink to="/monitoring" label="Monitoring" />

          </nav>

          {/* Platform Status */}
          <div className="border-t border-slate-200 p-4">
            <div className="rounded-xl bg-slate-50 p-3"><p className="text-sm font-semibold text-slate-700">Help & Support</p><p className="mt-1 text-xs leading-5 text-slate-500">Need help with platform administration?</p></div>
            <button className="mt-3 flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900" onClick={logout} type="button">Logout</button>
          </div>

        </aside>

        {/* =========================
            MAIN CONTENT
        ========================== */}
        <div className="ml-0 flex min-h-screen flex-1 flex-col lg:ml-72">

          {/* =========================
              TOP HEADER
          ========================== */}
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

            <div className="flex h-[76px] items-center justify-between px-4 sm:px-8">

              {/* Header Logo + Title */}
              <div className="flex items-center gap-3"><button aria-label="Open navigation" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setNavigationOpen(true)} type="button"><span aria-hidden="true" className="text-lg">☰</span></button><div><p className="text-sm font-semibold text-slate-900">Super Admin Portal</p><p className="mt-0.5 hidden text-xs text-slate-500 sm:block">Platform management workspace</p></div></div>

              {/* Administrator */}
              <div className="flex items-center gap-3">

                <NotificationBell />
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-800">
                    Administrator
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Super Admin
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
                  <span className="text-sm font-semibold text-white">
                    S
                  </span>
                </div>

              </div>

            </div>

          </header>

          {/* =========================
              PAGE CONTENT
          ========================== */}
          <main className="flex-1">

            <Routes>

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/tenants"
                element={<TenantManagement />}
              />

              <Route path="/tenants/:tenantId" element={<TenantDetails />} />
              <Route path="/organizations" element={<Organizations />} />
              <Route path="/users" element={<Users />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/permissions" element={<PermissionManagement />} />
              <Route path="/data-permissions" element={<DataPermissions />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/features" element={<Features />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/security" element={<Security />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/monitoring" element={<Monitoring />} />

            </Routes>

          </main>

        </div>

      </div>
      {resetConfirmationOpen && <ConfirmDialog title="Reset the sample workspace?" description="This replaces locally changed demo tenants, users, roles, permissions-related assignments, and platform settings with the original sample data." confirmLabel="Reset demo data" onClose={() => setResetConfirmationOpen(false)} onConfirm={() => reset.mutate(undefined, { onSuccess: () => setResetConfirmationOpen(false) })} />}
    </div>
  );
}

const SidebarLink = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `group mt-1 flex items-center rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${isActive ? "border-blue-100 bg-blue-50 text-blue-700" : "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
  >
    {({ isActive }) => <><span className={`mr-3 h-2 w-2 rounded-full ${isActive ? "bg-blue-600" : "bg-slate-300 group-hover:bg-slate-500"}`} /><span>{label}</span></>}
  </NavLink>
);

const NotificationBell = () => {
  const { data: notifications = [] } = useNotifications();
  const unread = notifications.filter((notification) => !notification.read).length;
  return <NavLink to="/notifications" aria-label="Notifications" className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100">✉️{unread > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">{unread}</span>}</NavLink>;
};

export default App;
