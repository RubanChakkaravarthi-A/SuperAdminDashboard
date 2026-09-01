import { useEffect, useState } from "react";
import type { Tenant } from "../api/API";
import { useUpdateTenant } from "../hooks/useUpdateTenant";

type EditTenantModalProps = {
  tenant: Tenant;
  onClose: () => void;
};

const EditTenantModal = ({
  tenant,
  onClose,
}: EditTenantModalProps) => {
  const updateTenant = useUpdateTenant();

  const [name, setName] = useState(tenant.name);
  const [code, setCode] = useState(tenant.code);

  const [admin, setAdmin] = useState(tenant.admin);
  const [email, setEmail] = useState(tenant.email);
  const [phone, setPhone] = useState(tenant.phone);

  const [plan, setPlan] = useState(tenant.plan);
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
    setCountry(tenant.country);
    setTimezone(tenant.timezone);

    setUsers(String(tenant.users));
    setStatus(tenant.status);
  }, [tenant]);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    updateTenant.mutate(
      {
        id: tenant.id,
        tenant: {
          name,
          code,
          admin,
          email,
          phone,
          plan,
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
      <div className="my-8 w-full max-w-2xl rounded-2xl border border-blue-100 bg-white p-6 shadow-2xl">
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
          className="space-y-5"
        >
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
          <div className="flex justify-end gap-3 pt-3">
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