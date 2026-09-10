import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTenants } from "../hooks/useTenants";
import { useActivateTenant } from "../hooks/useActivateTenant";
import { useDeactivateTenant } from "../hooks/useDeactivateTenant";
import { useCreateTenant } from "../hooks/useCreateTenant";
import { useOrganizations } from "../hooks/usePortal";
import TenantActions from "./TenantActions";
import EditTenantModal from "./EditTenantModal";
import type { Tenant } from "../api/API";

type TenantTableProps = {
  search: string;
  status: string;
  plan: string;
};

type SortField =
  | "name"
  | "code"
  | "users"
  | "status"
  | "created";

type SortDirection = "asc" | "desc";

const TenantTable = ({
  search,
  status,
  plan,
}: TenantTableProps) => {
  const navigate = useNavigate();
  const {
    data: tenants,
    isLoading,
    isError,
  } = useTenants();

  const activateTenant = useActivateTenant();
  const deactivateTenant = useDeactivateTenant();
  const createTenant = useCreateTenant();
  const { data: organizations = [] } = useOrganizations();

  const [selectedTenant, setSelectedTenant] =
    useState<Tenant | null>(null);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  // Create Tenant form
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [admin, setAdmin] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [planValue, setPlanValue] = useState("Basic");
  const [organizationId, setOrganizationId] = useState("");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const [users, setUsers] = useState("0");
  const [seatLimit, setSeatLimit] = useState("10");
  const [tenantStatus, setTenantStatus] =
    useState<"Active" | "Inactive">("Active");
  const [codeError, setCodeError] = useState("");  
  const [formError, setFormError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sorting
  const [sortField, setSortField] =
    useState<SortField>("name");

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const handleActivate = (id: string) => {
    activateTenant.mutate(id);
  };

  const handleDeactivate = (id: string) => {
    deactivateTenant.mutate(id);
  };

  const handleView = (tenant: Tenant) => {
    navigate(`/tenants/${tenant.id}`);
  };

  const handleEdit = (tenant: Tenant) => {
    setSelectedTenant(tenant);
  };

  const handleCloseEdit = () => {
    setSelectedTenant(null);
  };

  const handleCloseCreate = () => {
  setShowCreateForm(false);
  setCodeError("");
  setFormError("");
};

  const handleCreateTenant = (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  const trimmedCode = code.trim().toUpperCase();

  const codeAlreadyExists = tenants?.some(
    (tenant) =>
      tenant.code.trim().toUpperCase() === trimmedCode
  );

  if (codeAlreadyExists) {
    setCodeError(
      "Tenant code already exists. Please use a unique code."
    );
    return;
  }

  if (!Number.isFinite(Number(users)) || Number(users) < 0 || Number(users) > Number(seatLimit)) {
    setFormError("Used seats must be a valid value between 0 and the seat limit.");
    return;
  }

  setCodeError("");
  setFormError("");

  createTenant.mutate(
    {
      name: name.trim(),
      code: trimmedCode,
      admin: admin.trim(),
      email: email.trim(),
      phone: phone.trim(),
      plan: planValue,
      organizationId: organizationId || undefined,
      country: country.trim(),
      timezone,
      users: Number(users),
      seatLimit: Number(seatLimit),
      status: tenantStatus,
    },
    {
      onSuccess: () => {
        setName("");
        setCode("");
        setCodeError("");
        setAdmin("");
        setEmail("");
        setPhone("");
        setPlanValue("Basic");
        setOrganizationId("");
        setCountry("");
        setTimezone("");
        setUsers("0");
        setSeatLimit("10");
        setTenantStatus("Active");

        setShowCreateForm(false);
        setCurrentPage(1);
      },
    }
  );
};

  // Filter tenants
  const filteredTenants = useMemo(() => {
    return (
      tenants?.filter((tenant) => {
        const searchText = search
          .trim()
          .toLowerCase();

        const matchesSearch =
          tenant.name
            .toLowerCase()
            .includes(searchText) ||
          tenant.code
            .toLowerCase()
            .includes(searchText);

        const matchesStatus =
          status === "" ||
          tenant.status.toLowerCase() ===
            status.toLowerCase();

        const matchesPlan =
          plan === "" ||
          tenant.plan.toLowerCase() ===
            plan.toLowerCase();

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPlan
        );
      }) ?? []
    );
  }, [tenants, search, status, plan]);

  // Sort tenants
  const sortedTenants = useMemo(() => {
    const sorted = [...filteredTenants];

    sorted.sort((a, b) => {
      let comparison = 0;

      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      }

      if (sortField === "code") {
        comparison = a.code.localeCompare(b.code);
      }

      if (sortField === "users") {
        comparison = a.users - b.users;
      }

      if (sortField === "status") {
        comparison =
          a.status.localeCompare(b.status);
      }

      if (sortField === "created") {
        comparison =
          new Date(a.created).getTime() -
          new Date(b.created).getTime();
      }

      return sortDirection === "asc"
        ? comparison
        : -comparison;
    });

    return sorted;
  }, [
    filteredTenants,
    sortField,
    sortDirection,
  ]);

  // Change sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((direction) =>
        direction === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortField(field);
      setSortDirection("asc");
    }

    setCurrentPage(1);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, plan]);

  // Pagination
  const totalPages = Math.ceil(
    sortedTenants.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const endIndex =
    startIndex + itemsPerPage;

  const currentTenants =
    sortedTenants.slice(
      startIndex,
      endIndex
    );

  // Keep page valid
  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }

    if (
      totalPages === 0 &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(
        (page) => page - 1
      );
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(
        (page) => page + 1
      );
    }
  };

  const sortIcon = (
    field: SortField
  ) => {
    if (sortField !== field) {
      return "↕";
    }

    return sortDirection === "asc"
      ? "↑"
      : "↓";
  };

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur-md">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Tenant Management
        </h2>

        <p className="py-10 text-center text-gray-500">
          Loading tenants...
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-100 bg-white/80 p-6 shadow-sm backdrop-blur-md">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Tenant Management
        </h2>

        <p className="py-10 text-center text-red-500">
          Failed to load tenants.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-sm backdrop-blur-md">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Tenant Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage all platform tenants
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setShowCreateForm(true)
            }
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            + Add Tenant
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left">

                <th className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleSort("name")
                    }
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
                  >
                    Tenant
                    <span>
                      {sortIcon("name")}
                    </span>
                  </button>
                </th>

                <th className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleSort("code")
                    }
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
                  >
                    Code
                    <span>
                      {sortIcon("code")}
                    </span>
                  </button>
                </th>

                <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                  Admin
                </th>

                <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                  Plan
                </th>

                <th className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleSort("users")
                    }
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
                  >
                    Users
                    <span>
                      {sortIcon("users")}
                    </span>
                  </button>
                </th>

                <th className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleSort("status")
                    }
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
                  >
                    Status
                    <span>
                      {sortIcon("status")}
                    </span>
                  </button>
                </th>

                <th className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      handleSort("created")
                    }
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
                  >
                    Created
                    <span>
                      {sortIcon("created")}
                    </span>
                  </button>
                </th>

                <th className="px-4 py-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>
              {currentTenants.map(
                (tenant) => (
                  <tr
                    key={tenant.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-800">
                      {tenant.name}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {tenant.code}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {tenant.admin}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {tenant.plan}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {tenant.users}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={
                          tenant.status ===
                          "Active"
                            ? "rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600"
                            : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                        }
                      >
                        {tenant.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-600">
                      {tenant.created}
                    </td>

                    <td className="px-4 py-4">
                      <TenantActions
                        status={
                          tenant.status
                        }
                        onView={() =>
                          handleView(
                            tenant
                          )
                        }
                        onEdit={() =>
                          handleEdit(
                            tenant
                          )
                        }
                        onActivate={() =>
                          handleActivate(
                            tenant.id
                          )
                        }
                        onDeactivate={() =>
                          handleDeactivate(
                            tenant.id
                          )
                        }
                      />
                    </td>
                  </tr>
                )
              )}

              {currentTenants.length ===
                0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No tenants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sortedTenants.length > 0 && (
          <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-700">
                {Math.min(
                  endIndex,
                  sortedTenants.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">
                {sortedTenants.length}
              </span>{" "}
              tenants
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={
                    currentPage === page
                      ? "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                      : "rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                  }
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={handleNext}
                disabled={
                  currentPage === totalPages
                }
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* =========================
          CREATE TENANT MODAL
      ========================== */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-4xl rounded-2xl border border-blue-100 bg-white p-6 shadow-2xl sm:p-8">

            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Add Tenant
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Create a new platform tenant
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseCreate}
                className="rounded-lg px-3 py-2 text-gray-500 transition hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Create Form */}
            <form
              onSubmit={handleCreateTenant}
              className="tenant-form grid gap-x-5 gap-y-5 md:grid-cols-2"
            >
              {formError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">{formError}</p>}
              {/* Tenant Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tenant Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter tenant name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Tenant Code */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tenant Code
                </label>

                <input
  type="text"
  value={code}
  onChange={(event) => {
    setCode(event.target.value.toUpperCase());

    if (codeError) {
      setCodeError("");
    }
  }}
  placeholder="Enter unique tenant code"
  className={`w-full rounded-xl border px-4 py-3 text-sm uppercase outline-none transition focus:ring-2 ${
    codeError
      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-blue-400 focus:ring-blue-100"
  }`}
  required
/>

{codeError && (
  <p className="mt-2 text-sm text-red-500">
    {codeError}
  </p>
)}
              </div>

              {/* Admin Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Admin Name
                </label>

                <input
                  type="text"
                  value={admin}
                  onChange={(event) =>
                    setAdmin(event.target.value)
                  }
                  placeholder="Enter admin name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Admin Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Admin Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="Enter phone number"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Subscription Plan */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Subscription Plan
                </label>

                <select
                  value={planValue}
                  onChange={(event) =>
                    setPlanValue(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Basic">
                    Basic
                  </option>

                  <option value="Standard">
                    Standard
                  </option>

                  <option value="Premium">
                    Premium
                  </option>
                </select>
              </div>

              {/* Country */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Organization
                </label>
                <select value={organizationId} onChange={(event) => setOrganizationId(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                  <option value="">Unassigned organization</option>
                  {organizations.map((organization) => <option key={organization.id} value={organization.id}>{organization.name}</option>)}
                </select>
              </div>

              {/* Country */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Country
                </label>

                <select
                  value={country}
                  onChange={(event) =>
                    setCountry(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">
                    Select country
                  </option>

                  <option value="India">
                    India
                  </option>

                  <option value="United States">
                    United States
                  </option>

                  <option value="United Kingdom">
                    United Kingdom
                  </option>

                  <option value="Canada">
                    Canada
                  </option>

                  <option value="Australia">
                    Australia
                  </option>

                  <option value="Singapore">
                    Singapore
                  </option>
                </select>
              </div>

              {/* Time Zone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Time Zone
                </label>

                <select
                  value={timezone}
                  onChange={(event) =>
                    setTimezone(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value="">
                    Select time zone
                  </option>

                  <option value="Asia/Kolkata">
                    India Standard Time (IST)
                  </option>

                  <option value="America/New_York">
                    Eastern Time (ET)
                  </option>

                  <option value="America/Chicago">
                    Central Time (CT)
                  </option>

                  <option value="America/Denver">
                    Mountain Time (MT)
                  </option>

                  <option value="America/Los_Angeles">
                    Pacific Time (PT)
                  </option>

                  <option value="Europe/London">
                    Greenwich Mean Time (GMT)
                  </option>

                  <option value="Asia/Singapore">
                    Singapore Time (SGT)
                  </option>

                  <option value="Australia/Sydney">
                    Australian Eastern Time (AET)
                  </option>
                </select>
              </div>

              {/* Users */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Seat Limit
                </label>

                <input
                  type="number"
                  min="1"
                  value={seatLimit}
                  onChange={(event) => setSeatLimit(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Users
                </label>

                <input
                  type="number"
                  min="0"
                  value={users}
                  onChange={(event) =>
                    setUsers(event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  value={tenantStatus}
                  onChange={(event) =>
                    setTenantStatus(
                      event.target.value as
                        | "Active"
                        | "Inactive"
                    )
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-3 md:col-span-2">
                <button
                  type="button"
                  onClick={handleCloseCreate}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    createTenant.isPending
                  }
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {createTenant.isPending
                    ? "Creating..."
                    : "Create Tenant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          EDIT TENANT MODAL
      ========================== */}
      {selectedTenant && (
        <EditTenantModal
          tenant={selectedTenant}
          onClose={handleCloseEdit}
        />
      )}
    </>
  );
};

export default TenantTable;
