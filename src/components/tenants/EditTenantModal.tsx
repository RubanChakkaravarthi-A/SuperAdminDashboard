import { useEffect, useState } from "react";
import type { Tenant } from "../api/API";
import { useUpdateTenant } from "../hooks/useUpdateTenant";
import { useOrganizations } from "../hooks/usePortal";
import { useTenants } from "../hooks/useTenants";

type EditTenantModalProps = {
  tenant: Tenant;
  onClose: () => void;
};

const EditTenantModal = ({
  tenant,
  onClose,
}: EditTenantModalProps) => {
  const updateTenant = useUpdateTenant();
  const { data: organizations = [] } = useOrganizations();
  const { data: tenants = [] } = useTenants();
  const [validationError, setValidationError] = useState("");

  const [name, setName] = useState(tenant.name);
  const [code, setCode] = useState(tenant.code);

  const [admin, setAdmin] = useState(tenant.admin);
  const [email, setEmail] = useState(tenant.email);
  const [phone, setPhone] = useState(tenant.phone);

  const [plan, setPlan] = useState(tenant.plan);
  const [organizationId, setOrganizationId] = useState(tenant.organizationId ?? "");
  const [seatLimit, setSeatLimit] = useState(String(tenant.seatLimit ?? 10));
  const [licenseStatus, setLicenseStatus] = useState(tenant.licenseStatus ?? "Active");
  const [renewalDate, setRenewalDate] = useState(tenant.renewalDate ?? "");
  const [country, setCountry] = useState(tenant.country);
  const [timezone, setTimezone] = useState(
    tenant.timezone
  );

  const [users, setUsers] = useState(
    String(tenant.users)
  );

  const [status, setStatus] = useState<
    "Active" | "Inactive"
  >(tenant.status);

  useEffect(() => {
    setName(tenant.name);
    setCode(tenant.code);

    setAdmin(tenant.admin);
    setEmail(tenant.email);
    setPhone(tenant.phone);

    setPlan(tenant.plan);
    setOrganizationId(tenant.organizationId ?? "");
    setSeatLimit(String(tenant.seatLimit ?? 10));
    setLicenseStatus(tenant.licenseStatus ?? "Active");
    setRenewalDate(tenant.renewalDate ?? "");
    setCountry(tenant.country);
    setTimezone(tenant.timezone);

    setUsers(String(tenant.users));
    setStatus(tenant.status);
  }, [tenant]);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const trimmedCode = code.trim().toUpperCase();
    if (tenants.some((item) => item.id !== tenant.id && item.code.trim().toUpperCase() === trimmedCode)) {
      setValidationError("Tenant code already exists. Use a unique code.");
      return;
    }
    if (!Number.isFinite(Number(users)) || Number(users) < 0 || Number(users) > Number(seatLimit)) {
      setValidationError("Used seats must be a valid value between 0 and the seat limit.");
      return;
    }
    setValidationError("");

    updateTenant.mutate(
      {
        id: tenant.id,
        tenant: {
          name,
          code: trimmedCode,
          admin,
          email,
          phone,
          plan,
          organizationId: organizationId || undefined,
          seatLimit: Number(seatLimit),
          licenseStatus: licenseStatus as "Active" | "Expiring" | "Expired",
          renewalDate,
          country,
          timezone,
          users: Number(users),
          status,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-4xl rounded-2xl border border-blue-100 bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Edit Tenant
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update tenant information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="tenant-form grid gap-x-5 gap-y-5 md:grid-cols-2"
        >
          {validationError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2">{validationError}</p>}
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
              onChange={(event) =>
                setCode(
                  event.target.value.toUpperCase()
                )
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm uppercase outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              required
            />
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

          {/* Phone */}
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

          {/* Plan */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Subscription Plan
            </label>

            <select
              value={plan}
              onChange={(event) =>
                setPlan(event.target.value)
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
            <label className="mb-2 block text-sm font-medium text-gray-700">Organization</label>
            <select value={organizationId} onChange={(event) => setOrganizationId(event.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
              <option value="">Unassigned organization</option>
              {organizations.map((organization) => <option key={organization.id} value={organization.id}>{organization.name}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Seat Limit</label>
            <input type="number" min="1" value={seatLimit} onChange={(event) => setSeatLimit(event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" required />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">License Status</label>
            <select value={licenseStatus} onChange={(event) => setLicenseStatus(event.target.value as "Active" | "Expiring" | "Expired")} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"><option>Active</option><option>Expiring</option><option>Expired</option></select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Renewal Date</label>
            <input type="date" value={renewalDate} onChange={(event) => setRenewalDate(event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
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
              value={status}
              onChange={(event) =>
                setStatus(
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
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateTenant.isPending}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateTenant.isPending
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTenantModal;
