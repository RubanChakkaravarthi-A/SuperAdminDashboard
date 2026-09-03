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
  organizationId?: string;
  licenseStatus?: "Active" | "Expiring" | "Expired";
  seatLimit?: number;
  renewalDate?: string;
  enabledFeatureIds?: string[];
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

    organizationId: tenant.organizationId,
    licenseStatus: tenant.licenseStatus ?? "Active",
    seatLimit: tenant.seatLimit ?? 10,
    renewalDate: tenant.renewalDate ?? `${new Date().getFullYear() + 1}-01-01`,
    enabledFeatureIds: tenant.enabledFeatureIds ?? [],
  };

  const updatedTenants = [
    ...tenants,
    newTenant,
  ];

  saveTenants(updatedTenants);

  recordActivity("Tenant created", "Tenant", newTenant.name, `${newTenant.name} was added to the platform`);

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

  recordActivity("Tenant updated", "Tenant", updatedTenant.name, `${updatedTenant.name} was updated`);

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

// The following mock entities share the same API boundary as tenants so they can
// later be replaced with HTTP calls without changing page components or hooks.
export type Organization = {
  id: string;
  name: string;
  code: string;
  contactName: string;
  contactEmail: string;
  country: string;
  status: "Active" | "Inactive";
  created: string;
};

export type Permission = {
  key: string;
  module: string;
  action: string;
  description: string;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissionKeys: string[];
  isSystem: boolean;
  created: string;
};

export type PortalUser = {
  id: string;
  name: string;
  email: string;
  type: "Platform" | "Tenant";
  status: "Active" | "Inactive";
  organizationId?: string;
  tenantId?: string;
  roleIds: string[];
  organizationIds: string[];
  tenantIds: string[];
  created: string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  priceLabel: string;
  seatLimit: number;
  featureIds: string[];
  active: boolean;
};

export type TenantFeature = {
  id: string;
  key: string;
  name: string;
  description: string;
  eligiblePlans: string[];
  active: boolean;
};

export type AuditLog = {
  id: string;
  action: string;
  targetType: string;
  targetName: string;
  summary: string;
  actor: string;
  created: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created: string;
};

export type PlatformConfiguration = {
  platformName: string;
  logoText: string;
  defaultTimezone: string;
  dateFormat: string;
  defaultPlan: string;
  tenantCodePrefix: string;
  sessionTimeoutMinutes: number;
  passwordResetMessage: string;
};

export type MonitoringStatus = {
  services: { name: string; status: "Healthy" | "Degraded" | "Down"; detail: string }[];
  usage: { name: string; value: number }[];
  incidents: { id: string; title: string; status: "Open" | "Resolved"; created: string }[];
};

const APP_KEY = "super-admin";
const keyFor = (name: string) => `${APP_KEY}-${name}`;
const entityId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const dateToday = () => new Date().toISOString().slice(0, 10);

const readEntity = <T,>(name: string, fallback: T): T => {
  const stored = localStorage.getItem(keyFor(name));
  if (!stored) {
    localStorage.setItem(keyFor(name), JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(stored) as T;
  } catch {
    localStorage.setItem(keyFor(name), JSON.stringify(fallback));
    return fallback;
  }
};

const writeEntity = <T,>(name: string, value: T) =>
  localStorage.setItem(keyFor(name), JSON.stringify(value));

const allPermissions: Permission[] = [
  ["organizations", "view"], ["organizations", "manage"],
  ["tenants", "view"], ["tenants", "manage"],
  ["users", "view"], ["users", "manage"],
  ["roles", "view"], ["roles", "manage"],
  ["licenses", "manage"], ["features", "manage"],
  ["configuration", "manage"], ["security", "manage"],
  ["audit", "view"], ["monitoring", "view"],
].map(([module, action]) => ({
  key: `${module}.${action}`,
  module,
  action,
  description: `${action === "view" ? "View" : "Manage"} ${module}`,
}));

const systemRoles: Role[] = [
  { id: "role-super-admin", name: "Super Admin", description: "Full platform access", permissionKeys: allPermissions.map((item) => item.key), isSystem: true, created: dateToday() },
  { id: "role-admin", name: "Admin", description: "Manages organizations, tenants and users", permissionKeys: allPermissions.filter((item) => !["configuration.manage", "security.manage"].includes(item.key)).map((item) => item.key), isSystem: true, created: dateToday() },
  { id: "role-viewer", name: "Viewer", description: "Read-only portal access", permissionKeys: allPermissions.filter((item) => item.action === "view").map((item) => item.key), isSystem: true, created: dateToday() },
];

const defaultPlans: SubscriptionPlan[] = [
  { id: "plan-basic", name: "Basic", priceLabel: "$29 / month", seatLimit: 10, featureIds: ["feature-dashboard"], active: true },
  { id: "plan-standard", name: "Standard", priceLabel: "$79 / month", seatLimit: 50, featureIds: ["feature-dashboard", "feature-audit"], active: true },
  { id: "plan-premium", name: "Premium", priceLabel: "$199 / month", seatLimit: 250, featureIds: ["feature-dashboard", "feature-audit", "feature-monitoring"], active: true },
];

const defaultFeatures: TenantFeature[] = [
  { id: "feature-dashboard", key: "advanced_dashboard", name: "Advanced dashboard", description: "Expanded platform analytics", eligiblePlans: ["Basic", "Standard", "Premium"], active: true },
  { id: "feature-audit", key: "audit_export", name: "Audit exports", description: "Download audit activity", eligiblePlans: ["Standard", "Premium"], active: true },
  { id: "feature-monitoring", key: "monitoring_alerts", name: "Monitoring alerts", description: "Service and usage alerts", eligiblePlans: ["Premium"], active: true },
];

const defaultConfiguration: PlatformConfiguration = {
  platformName: "Super Admin Portal",
  logoText: "S",
  defaultTimezone: "Asia/Kolkata",
  dateFormat: "YYYY-MM-DD",
  defaultPlan: "Basic",
  tenantCodePrefix: "TEN",
  sessionTimeoutMinutes: 30,
  passwordResetMessage: "A password reset request was recorded. Connect an email provider to deliver it.",
};

const defaultMonitoring: MonitoringStatus = {
  services: [
    { name: "API Gateway", status: "Healthy", detail: "All requests are operating normally" },
    { name: "Database", status: "Healthy", detail: "Connection pool is healthy" },
    { name: "Background jobs", status: "Healthy", detail: "No delayed jobs" },
  ],
  usage: [{ name: "Storage", value: 68 }, { name: "CPU", value: 42 }, { name: "Memory", value: 61 }],
  incidents: [{ id: "incident-1", title: "Scheduled maintenance completed", status: "Resolved", created: dateToday() }],
};

const recordActivity = (action: string, targetType: string, targetName: string, summary: string) => {
  const created = new Date().toISOString();
  const logs = readEntity<AuditLog[]>("audit-logs", []);
  const notifications = readEntity<Notification[]>("notifications", []);
  writeEntity("audit-logs", [{ id: entityId(), action, targetType, targetName, summary, actor: "Administrator", created }, ...logs]);
  writeEntity("notifications", [{ id: entityId(), title: action, message: summary, read: false, created }, ...notifications]);
};

export const getPermissions = async () => {
  await delay();
  return allPermissions;
};

export const getOrganizations = async (): Promise<Organization[]> => {
  await delay();
  return readEntity("organizations", []);
};

export const saveOrganization = async (input: Partial<Organization>): Promise<Organization> => {
  await delay();
  const entity: Organization = {
    id: input.id ?? entityId(), name: input.name?.trim() ?? "", code: input.code?.trim().toUpperCase() ?? "",
    contactName: input.contactName?.trim() ?? "", contactEmail: input.contactEmail?.trim() ?? "", country: input.country ?? "",
    status: input.status ?? "Active", created: input.created ?? dateToday(),
  };
  const items = readEntity<Organization[]>("organizations", []);
  writeEntity("organizations", items.some((item) => item.id === entity.id) ? items.map((item) => item.id === entity.id ? entity : item) : [entity, ...items]);
  recordActivity(input.id ? "Organization updated" : "Organization created", "Organization", entity.name, `${entity.name} was ${input.id ? "updated" : "created"}`);
  return entity;
};

export const setOrganizationStatus = async (organizationId: string, status: Organization["status"]) => {
  const organization = (await getOrganizations()).find((item) => item.id === organizationId);
  if (!organization) throw new Error("Organization not found");
  return saveOrganization({ ...organization, status });
};

export const getUsers = async (): Promise<PortalUser[]> => {
  await delay();
  return readEntity("users", []);
};

export const saveUser = async (input: Partial<PortalUser>): Promise<PortalUser> => {
  await delay();
  const entity: PortalUser = {
    id: input.id ?? entityId(), name: input.name?.trim() ?? "", email: input.email?.trim() ?? "", type: input.type ?? "Platform",
    status: input.status ?? "Active", organizationId: input.organizationId, tenantId: input.tenantId,
    roleIds: input.roleIds ?? ["role-viewer"], organizationIds: input.organizationIds ?? [], tenantIds: input.tenantIds ?? [], created: input.created ?? dateToday(),
  };
  const items = readEntity<PortalUser[]>("users", []);
  writeEntity("users", items.some((item) => item.id === entity.id) ? items.map((item) => item.id === entity.id ? entity : item) : [entity, ...items]);
  recordActivity(input.id ? "User updated" : "User created", "User", entity.name, `${entity.name} was ${input.id ? "updated" : "created"}`);
  return entity;
};

export const setUserStatus = async (userId: string, status: PortalUser["status"]) => {
  const user = (await getUsers()).find((item) => item.id === userId);
  if (!user) throw new Error("User not found");
  return saveUser({ ...user, status });
};

export const requestPasswordReset = async (userId: string) => {
  const user = (await getUsers()).find((item) => item.id === userId);
  if (!user) throw new Error("User not found");
  await delay();
  recordActivity("Password reset requested", "User", user.name, `Password reset was requested for ${user.email}`);
  return defaultConfiguration.passwordResetMessage;
};

export const getRoles = async (): Promise<Role[]> => {
  await delay();
  return readEntity("roles", systemRoles);
};

export const saveRole = async (input: Partial<Role>): Promise<Role> => {
  const roles = await getRoles();
  const current = input.id ? roles.find((role) => role.id === input.id) : undefined;
  if (current?.isSystem) throw new Error("System roles are protected");
  const entity: Role = { id: input.id ?? entityId(), name: input.name?.trim() ?? "", description: input.description?.trim() ?? "", permissionKeys: input.permissionKeys ?? [], isSystem: false, created: input.created ?? dateToday() };
  writeEntity("roles", current ? roles.map((role) => role.id === entity.id ? entity : role) : [entity, ...roles]);
  recordActivity(current ? "Role updated" : "Role created", "Role", entity.name, `${entity.name} was ${current ? "updated" : "created"}`);
  return entity;
};

export const deleteRole = async (roleId: string) => {
  const roles = await getRoles();
  const role = roles.find((item) => item.id === roleId);
  if (!role) throw new Error("Role not found");
  if (role.isSystem) throw new Error("System roles are protected");
  writeEntity("roles", roles.filter((item) => item.id !== roleId));
  recordActivity("Role deleted", "Role", role.name, `${role.name} was deleted`);
};

export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  await delay();
  return readEntity("subscription-plans", defaultPlans);
};

export const saveSubscriptionPlan = async (input: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
  await delay();
  const entity: SubscriptionPlan = { id: input.id ?? entityId(), name: input.name?.trim() ?? "", priceLabel: input.priceLabel?.trim() ?? "", seatLimit: input.seatLimit ?? 1, featureIds: input.featureIds ?? [], active: input.active ?? true };
  const items = readEntity("subscription-plans", defaultPlans);
  writeEntity("subscription-plans", items.some((item) => item.id === entity.id) ? items.map((item) => item.id === entity.id ? entity : item) : [entity, ...items]);
  recordActivity(input.id ? "Subscription plan updated" : "Subscription plan created", "Subscription plan", entity.name, `${entity.name} was ${input.id ? "updated" : "created"}`);
  return entity;
};

export const getFeatures = async (): Promise<TenantFeature[]> => {
  await delay();
  return readEntity("features", defaultFeatures);
};

export const saveFeature = async (input: Partial<TenantFeature>): Promise<TenantFeature> => {
  await delay();
  const entity: TenantFeature = { id: input.id ?? entityId(), key: input.key?.trim().toLowerCase().replaceAll(" ", "_") ?? "", name: input.name?.trim() ?? "", description: input.description?.trim() ?? "", eligiblePlans: input.eligiblePlans ?? [], active: input.active ?? true };
  const items = readEntity("features", defaultFeatures);
  writeEntity("features", items.some((item) => item.id === entity.id) ? items.map((item) => item.id === entity.id ? entity : item) : [entity, ...items]);
  recordActivity(input.id ? "Feature updated" : "Feature created", "Feature", entity.name, `${entity.name} was ${input.id ? "updated" : "created"}`);
  return entity;
};

export const toggleTenantFeature = async (tenantId: string, featureId: string) => {
  const tenant = await getTenant(tenantId);
  const featureIds = tenant.enabledFeatureIds ?? [];
  return updateTenant(tenantId, { enabledFeatureIds: featureIds.includes(featureId) ? featureIds.filter((item) => item !== featureId) : [...featureIds, featureId] });
};

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  await delay();
  return readEntity("audit-logs", []);
};

export const getNotifications = async (): Promise<Notification[]> => {
  await delay();
  return readEntity("notifications", []);
};

export const markNotificationRead = async (notificationId: string, read = true) => {
  const notifications = await getNotifications();
  writeEntity("notifications", notifications.map((item) => item.id === notificationId ? { ...item, read } : item));
};

export const getPlatformConfiguration = async (): Promise<PlatformConfiguration> => {
  await delay();
  return readEntity("platform-configuration", defaultConfiguration);
};

export const savePlatformConfiguration = async (configuration: PlatformConfiguration) => {
  await delay();
  writeEntity("platform-configuration", configuration);
  recordActivity("Platform configuration updated", "Configuration", configuration.platformName, "Platform defaults were updated");
  return configuration;
};

export const getMonitoringStatus = async (): Promise<MonitoringStatus> => {
  await delay();
  return readEntity("monitoring", defaultMonitoring);
};
