export type Tenant = {
  id: string;
  name: string;
  code: string;

  admin: string;
  email: string;
  phone: string;

  plan: string;
  country: string;
  timezone: string;

  users: number;
  status: "Active" | "Inactive";
  created: string;
};

// No dummy tenants.
// Tenant will appear only after the user creates one.
const initialTenants: Tenant[] = [];

const STORAGE_KEY = "mock-tenants";

const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getStoredTenants = (): Tenant[] => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(initialTenants)
  );

  return initialTenants;
};

const saveTenants = (tenants: Tenant[]) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tenants)
  );
};

// Get all tenants
export const getTenants = async (): Promise<Tenant[]> => {
  await delay();

  return getStoredTenants();
};

// Get single tenant
export const getTenant = async (
  id: string
): Promise<Tenant> => {
  await delay();

  const tenants = getStoredTenants();

  const tenant = tenants.find(
    (item) => item.id === id
  );

  if (!tenant) {
    throw new Error("Tenant not found");
  }

  return tenant;
};

// Create tenant
export const createTenant = async (
  tenant: Partial<Tenant>
): Promise<Tenant> => {
  await delay();

  const tenants = getStoredTenants();

  const newTenant: Tenant = {
    id: Date.now().toString(),

    name: tenant.name ?? "",
    code: tenant.code ?? `TEN${Date.now()}`,

    admin: tenant.admin ?? "",
    email: tenant.email ?? "",
    phone: tenant.phone ?? "",

    plan: tenant.plan ?? "Basic",
    country: tenant.country ?? "",
    timezone: tenant.timezone ?? "",

    users: tenant.users ?? 0,

    status: tenant.status ?? "Active",

    created:
      tenant.created ??
      new Date().toISOString().split("T")[0],
  };

  const updatedTenants = [
    ...tenants,
    newTenant,
  ];

  saveTenants(updatedTenants);

  return newTenant;
};

// Update tenant
export const updateTenant = async (
  id: string,
  tenant: Partial<Tenant>
): Promise<Tenant> => {
  await delay();

  const tenants = getStoredTenants();

  const tenantExists = tenants.some(
    (item) => item.id === id
  );

  if (!tenantExists) {
    throw new Error("Tenant not found");
  }

  const updatedTenants = tenants.map(
    (item) =>
      item.id === id
        ? {
            ...item,
            ...tenant,
          }
        : item
  );

  saveTenants(updatedTenants);

  const updatedTenant =
    updatedTenants.find(
      (item) => item.id === id
    );

  if (!updatedTenant) {
    throw new Error("Tenant not found");
  }

  return updatedTenant;
};

// Activate tenant
export const activateTenant = async (
  id: string
): Promise<Tenant | undefined> => {
  await delay();

  const tenants = getStoredTenants();

  const updatedTenants = tenants.map(
    (tenant) =>
      tenant.id === id
        ? {
            ...tenant,
            status: "Active" as const,
          }
        : tenant
  );

  saveTenants(updatedTenants);

  return updatedTenants.find(
    (tenant) => tenant.id === id
  );
};

// Deactivate tenant
export const deactivateTenant = async (
  id: string
): Promise<Tenant | undefined> => {
  await delay();

  const tenants = getStoredTenants();

  const updatedTenants = tenants.map(
    (tenant) =>
      tenant.id === id
        ? {
            ...tenant,
            status: "Inactive" as const,
          }
        : tenant
  );

  saveTenants(updatedTenants);

  return updatedTenants.find(
    (tenant) => tenant.id === id
  );
};

// Get tenant stats
export const getTenantStats = async (
  id: string
) => {
  await delay();

  const tenant = await getTenant(id);

  return {
    id: tenant.id,
    users: tenant.users,
    status: tenant.status,
    plan: tenant.plan,
  };
};