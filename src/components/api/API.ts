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

// Small, realistic seed set so the dashboard is meaningful on its first visit.
const initialTenants: Tenant[] = [
  {
    id: "tenant-acme", name: "Acme Technologies", code: "ACME001",
    admin: "Priya Sharma", email: "priya@acme.example", phone: "+91 98765 43210",
    plan: "Premium", country: "India", timezone: "Asia/Kolkata", users: 48, organizationId: "org-acme",
    status: "Active", created: "2026-08-12", licenseStatus: "Active", seatLimit: 75,
    renewalDate: "2027-08-12", enabledFeatureIds: ["feature-dashboard", "feature-audit", "feature-monitoring"],
  },
  {
    id: "tenant-northstar", name: "Northstar Labs", code: "NSL002",
    admin: "Arjun Mehta", email: "arjun@northstar.example", phone: "+1 415 555 0182",
    plan: "Standard", country: "United States", timezone: "America/Los_Angeles", users: 21, organizationId: "org-northstar",
    status: "Active", created: "2026-08-26", licenseStatus: "Active", seatLimit: 50,
    renewalDate: "2027-08-26", enabledFeatureIds: ["feature-dashboard", "feature-audit"],
  },
  {
    id: "tenant-brightpath", name: "BrightPath Services", code: "BPS003",
    admin: "Nila Thomas", email: "nila@brightpath.example", phone: "+971 50 555 0174",
    plan: "Basic", country: "United Arab Emirates", timezone: "Asia/Dubai", users: 9, organizationId: "org-brightpath",
    status: "Inactive", created: "2026-09-02", licenseStatus: "Expiring", seatLimit: 10,
    renewalDate: "2026-09-30", enabledFeatureIds: ["feature-dashboard"],
  },
];

const STORAGE_KEY = "mock-tenants";

const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getStoredTenants = (): Tenant[] => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      const tenants = JSON.parse(stored) as Tenant[];
      // Earlier demo versions saved an empty list. Seed only that empty state;
      // existing tenant records are never replaced.
      if (tenants.length === 0) {
        saveTenants(initialTenants);
        return initialTenants;
      }
      return tenants;
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
  dataScope?: DataScope;
  created: string;
};

export type DataAccessMode = "All" | "Selected" | "None";

export type DataScope = {
  mode: DataAccessMode;
  organizationIds: string[];
  tenantIds: string[];
  regions: string[];
  teams: string[];
  expiresAt?: string;
  owner?: string;
  reason?: string;
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
const SESSION_KEY = `${APP_KEY}-demo-session`;
const entityId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const dateToday = () => new Date().toISOString().slice(0, 10);

export type PortalSession = { email: string; name: string; roleId: string; expiresAt: string };

export const signInDemo = async (email: string, password: string): Promise<PortalSession> => {
  await delay(300);
  if (email.trim().toLowerCase() !== "admin@superadmin.com" || password !== "Admin@123") throw new Error("Enter the sample workspace credentials to continue.");
  const session: PortalSession = { email: "admin@superadmin.com", name: "Administrator", roleId: "role-super-admin", expiresAt: new Date(Date.now() + 30 * 60_000).toISOString() };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const getActiveDemoSession = (): PortalSession | null => {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "null") as PortalSession | null;
    if (!session || new Date(session.expiresAt).getTime() <= Date.now()) { sessionStorage.removeItem(SESSION_KEY); return null; }
    return session;
  } catch { sessionStorage.removeItem(SESSION_KEY); return null; }
};

export const signOutDemo = () => sessionStorage.removeItem(SESSION_KEY);

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
  ...["organizations", "tenants", "users", "roles", "licenses", "features"].flatMap((module) =>
    ["view", "create", "edit", "delete", "export", "approve"].map((action) => [module, action] as const)),
  ...["configuration", "security"].flatMap((module) => ["view", "edit", "approve"].map((action) => [module, action] as const)),
  ...["audit", "monitoring", "notifications"].flatMap((module) => ["view", "export"].map((action) => [module, action] as const)),
].map(([module, action]) => ({
  key: `${module}.${action}`,
  module,
  action,
  description: `${action[0].toUpperCase()}${action.slice(1)} ${module}`,
}));

const systemRoles: Role[] = [
  { id: "role-super-admin", name: "Super Admin", description: "Full platform access", permissionKeys: allPermissions.map((item) => item.key), isSystem: true, created: dateToday() },
  { id: "role-admin", name: "Admin", description: "Manages organizations, tenants and users", permissionKeys: allPermissions.filter((item) => !item.module.includes("security") && !item.module.includes("configuration")).map((item) => item.key), isSystem: true, created: dateToday() },
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

const defaultOrganizations: Organization[] = [
  { id: "org-acme", name: "Acme Group", code: "ACME", contactName: "Priya Sharma", contactEmail: "priya@acme.example", country: "India", status: "Active", created: "2026-08-12" },
  { id: "org-northstar", name: "Northstar Holdings", code: "NST", contactName: "Arjun Mehta", contactEmail: "arjun@northstar.example", country: "United States", status: "Active", created: "2026-08-26" },
  { id: "org-brightpath", name: "BrightPath Group", code: "BPG", contactName: "Nila Thomas", contactEmail: "nila@brightpath.example", country: "United Arab Emirates", status: "Inactive", created: "2026-09-02" },
];

const defaultUsers: PortalUser[] = [
  { id: "user-admin", name: "Super Administrator", email: "admin@superadmin.com", type: "Platform", status: "Active", roleIds: ["role-super-admin"], organizationIds: ["org-acme", "org-northstar", "org-brightpath"], tenantIds: ["tenant-acme", "tenant-northstar", "tenant-brightpath"], created: "2026-08-01" },
  { id: "user-priya", name: "Priya Sharma", email: "priya@acme.example", type: "Tenant", status: "Active", organizationId: "org-acme", tenantId: "tenant-acme", roleIds: ["role-admin"], organizationIds: ["org-acme"], tenantIds: ["tenant-acme"], created: "2026-08-12" },
  { id: "user-arjun", name: "Arjun Mehta", email: "arjun@northstar.example", type: "Tenant", status: "Active", organizationId: "org-northstar", tenantId: "tenant-northstar", roleIds: ["role-viewer"], organizationIds: ["org-northstar"], tenantIds: ["tenant-northstar"], created: "2026-08-26" },
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

const defaultAuditLogs: AuditLog[] = [
  { id: "audit-tenant-acme", action: "Tenant created", targetType: "Tenant", targetName: "Acme Technologies", summary: "Acme Technologies was added to the platform", actor: "Administrator", created: "2026-09-08T09:30:00.000Z" },
  { id: "audit-license-northstar", action: "License renewed", targetType: "Subscription", targetName: "Northstar Labs", summary: "Northstar Labs renewed its Standard subscription", actor: "Administrator", created: "2026-09-07T14:15:00.000Z" },
  { id: "audit-feature-brightpath", action: "Feature updated", targetType: "Feature", targetName: "BrightPath Services", summary: "Advanced dashboard access was updated", actor: "Administrator", created: "2026-09-06T11:00:00.000Z" },
];

const defaultNotifications: Notification[] = [
  { id: "notification-license", title: "License renewal due", message: "BrightPath Services has a license renewal due this month.", read: false, created: "2026-09-08T10:00:00.000Z" },
  { id: "notification-tenant", title: "Tenant created", message: "Acme Technologies was added to the platform.", read: false, created: "2026-09-08T09:30:00.000Z" },
  { id: "notification-monitoring", title: "Platform health", message: "All monitored platform services are operating normally.", read: true, created: "2026-09-07T14:00:00.000Z" },
];

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
  return readEntity("organizations", defaultOrganizations);
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
  return readEntity("users", defaultUsers);
};

export const saveUser = async (input: Partial<PortalUser>): Promise<PortalUser> => {
  await delay();
  const items = readEntity<PortalUser[]>("users", defaultUsers);
  const email = input.email?.trim().toLowerCase() ?? "";
  if (!email) throw new Error("Email is required");
  if (items.some((item) => item.id !== input.id && item.email.toLowerCase() === email)) throw new Error("A user already exists with this email");
  const suppliedScope = input.dataScope;
  const dataScope: DataScope = suppliedScope ?? {
    mode: (input.organizationIds?.length || input.tenantIds?.length) ? "Selected" : "None",
    organizationIds: input.organizationIds ?? [], tenantIds: input.tenantIds ?? [], regions: [], teams: [],
  };
  const entity: PortalUser = {
    id: input.id ?? entityId(), name: input.name?.trim() ?? "", email, type: input.type ?? "Platform",
    status: input.status ?? "Active", organizationId: input.organizationId, tenantId: input.tenantId,
    roleIds: input.roleIds ?? ["role-viewer"], organizationIds: dataScope.organizationIds, tenantIds: dataScope.tenantIds, dataScope, created: input.created ?? dateToday(),
  };
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
  const affectedUsers = (await getUsers()).filter((user) => user.roleIds.includes(roleId));
  if (affectedUsers.length) throw new Error(`Role is assigned to ${affectedUsers.length} user(s). Reassign them before deleting this role.`);
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
  return readEntity("audit-logs", defaultAuditLogs);
};

export const getNotifications = async (): Promise<Notification[]> => {
  await delay();
  return readEntity("notifications", defaultNotifications);
};

export const resetDemoWorkspace = async () => {
  await delay(250);
  saveTenants(initialTenants);
  writeEntity("organizations", defaultOrganizations);
  writeEntity("users", defaultUsers);
  writeEntity("roles", systemRoles);
  writeEntity("subscription-plans", defaultPlans);
  writeEntity("features", defaultFeatures);
  writeEntity("audit-logs", defaultAuditLogs);
  writeEntity("notifications", defaultNotifications);
  writeEntity("platform-configuration", defaultConfiguration);
  writeEntity("monitoring", defaultMonitoring);
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
