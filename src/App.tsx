import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import TenantManagement from "./components/pages/TenantManagement";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-blue-100 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between">
          <h1 className="text-xl font-bold text-blue-900">
            Super Admin Portal
          </h1>

          <nav className="flex gap-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-blue-50"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/tenants"
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-blue-50"
                }`
              }
            >
              Tenant Management
            </NavLink>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tenants" element={<TenantManagement />} />
      </Routes>
    </div>
  );
}

export default App;