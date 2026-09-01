import { useState } from "react";
import TenantFilters from "../tenants/TenantFilters";
import TenantTable from "../tenants/TenantTable";

const TenantManagement = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-10">
      <h1 className="mb-10 text-3xl font-bold text-blue-900">
        Tenant Management
      </h1>

      <div className="space-y-8">
        <TenantFilters
          search={search}
          status={status}
          plan={plan}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onPlanChange={setPlan}
        />

        <TenantTable
          search={search}
          status={status}
          plan={plan}
        />
      </div>
    </main>
  );
};

export default TenantManagement;