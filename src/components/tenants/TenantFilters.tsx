type TenantFiltersProps = {
  search: string;
  status: string;
  plan: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPlanChange: (value: string) => void;
};

const TenantFilters = ({
  search,
  status,
  plan,
  onSearchChange,
  onStatusChange,
  onPlanChange,
}: TenantFiltersProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-white/80 p-5 shadow-sm backdrop-blur-md md:flex-row">
      <input
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by tenant name or code"
        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <select
        value={plan}
        onChange={(event) => onPlanChange(event.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">All Plans</option>
        <option value="Basic">Basic</option>
        <option value="Standard">Standard</option>
        <option value="Premium">Premium</option>
      </select>
    </div>
  );
};

export default TenantFilters;