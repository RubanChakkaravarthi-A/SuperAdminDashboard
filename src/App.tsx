import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import TenantManagement from "./components/pages/TenantManagement";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">

        {/* =========================
            LEFT SIDEBAR
        ========================== */}
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

          {/* Sidebar Brand */}
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

                <p className="text-xs text-slate-500">
                  Admin Portal
                </p>
              </div>

            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 px-4 py-6">

            {/* Overview */}
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Overview
            </p>

            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <span className="mr-3 h-2 w-2 rounded-full bg-current" />

              <span>
                Dashboard
              </span>
            </NavLink>

            {/* Management */}
            <p className="mb-3 mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Management
            </p>

            <NavLink
              to="/tenants"
              className={({ isActive }) =>
                `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <span className="mr-3 h-2 w-2 rounded-full bg-current" />

              <span>
                Tenant Management
              </span>
            </NavLink>

          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-slate-200 px-5 py-5">

            <p className="text-xs font-semibold text-slate-500">
              Platform Status
            </p>

            <div className="mt-2 flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-green-500" />

              <span className="text-xs text-slate-600">
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
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">

            <div className="flex h-[76px] items-center justify-between px-8">

              {/* Header Left */}
              <div className="flex items-center gap-3">

                {/* S Logo */}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
                  <span className="text-lg font-bold text-white">
                    S
                  </span>
                </div>

                {/* Header Title */}
                <div className="leading-tight">

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Administration
                  </p>

                  <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
                    Super Admin Portal
                  </h2>

                </div>

              </div>

              {/* Header Right */}
              <div className="flex items-center gap-3">

                {/* Administrator Avatar */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
                  <span className="text-sm font-semibold text-white">
                    S
                  </span>
                </div>

                {/* Administrator Text */}
                <div className="hidden leading-tight sm:block">

                  <p className="text-sm font-semibold text-slate-800">
                    Administrator
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Super Admin
                  </p>

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

            </Routes>

          </main>

        </div>

      </div>
    </div>
  );
}

export default App;