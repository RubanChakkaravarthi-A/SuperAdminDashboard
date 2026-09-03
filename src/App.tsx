import { NavLink, Route, Routes } from "react-router-dom";
import { useNotifications } from "./components/hooks/usePortal";
import Dashboard from "./components/pages/Dashboard";
import TenantManagement from "./components/pages/TenantManagement";
import TenantDetails from "./components/pages/TenantDetails";
import Organizations from "./components/pages/Organizations";
import Users from "./components/pages/Users";
import Roles from "./components/pages/Roles";
import { Features, Subscriptions } from "./components/pages/PlatformControls";
import { AuditLogs, Configuration, Monitoring, Notifications, Security } from "./components/pages/Operations";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">

        {/* =========================
            SIDEBAR
        ========================== */}
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

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
          <nav className="flex-1 overflow-y-auto px-4 py-6">

            {/* Overview */}
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Overview
            </p>

            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`mr-3 h-2 w-2 rounded-full transition ${
                      isActive
                        ? "bg-white"
                        : "bg-slate-400 group-hover:bg-slate-600"
                    }`}
                  />

                  <span>Dashboard</span>
                </>
              )}
            </NavLink>

            {/* Management */}
            <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Management
            </p>

            <NavLink
              to="/tenants"
              className={({ isActive }) =>
                `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`mr-3 h-2 w-2 rounded-full transition ${
                      isActive
                        ? "bg-white"
                        : "bg-slate-400 group-hover:bg-slate-600"
                    }`}
                  />

                  <span>Tenant Management</span>
                </>
              )}
            </NavLink>

            <SidebarLink to="/organizations" label="Organization Management" />
            <SidebarLink to="/users" label="User Management" />
            <SidebarLink to="/roles" label="Roles & Permissions" />

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
          <div className="border-t border-slate-200 px-5 py-5">

            <p className="text-xs font-semibold text-slate-500">
              Platform Status
            </p>

            <div className="mt-2 flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-green-500" />

              <span className="text-xs font-medium text-slate-600">
                All systems operational
              </span>

            </div>

          </div>

        </aside>

        {/* =========================
            MAIN CONTENT
        ========================== */}
        <div className="ml-64 flex min-h-screen flex-1 flex-col">

          {/* =========================
              TOP HEADER
          ========================== */}
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">

            <div className="flex h-[76px] items-center justify-between px-8">

              {/* Header Logo + Title */}
              <div className="flex items-center gap-3">

                <NotificationBell />

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
                  <span className="text-base font-bold text-white">
                    S
                  </span>
                </div>

                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Super Admin Portal
                </h2>

              </div>

              {/* Administrator */}
              <div className="flex items-center gap-3">

                <div className="text-right">
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
                path="/"
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
    </div>
  );
}

const SidebarLink = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `group mt-1 flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${isActive ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
  >
    {({ isActive }) => <><span className={`mr-3 h-2 w-2 rounded-full ${isActive ? "bg-white" : "bg-slate-400"}`} /><span>{label}</span></>}
  </NavLink>
);

const NotificationBell = () => {
  const { data: notifications = [] } = useNotifications();
  const unread = notifications.filter((notification) => !notification.read).length;
  return <NavLink to="/notifications" aria-label="Notifications" className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100">🔔{unread > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">{unread}</span>}</NavLink>;
};

export default App;
