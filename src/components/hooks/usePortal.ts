import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteRole, getAuditLogs, getFeatures, getMonitoringStatus, getNotifications,
  getOrganizations, getPermissions, getPlatformConfiguration, getRoles,
  getSubscriptionPlans, getUsers, markNotificationRead, requestPasswordReset,
  resetDemoWorkspace,
  saveFeature, saveOrganization, savePlatformConfiguration, saveRole,
  saveSubscriptionPlan, saveUser, setOrganizationStatus, setUserStatus,
  toggleTenantFeature,
} from "../api/API";

const usePortalMutation = <TVariables,>(mutationFn: (variables: TVariables) => Promise<unknown>, keys: string[][]) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => keys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey })),
  });
};

export const useOrganizations = () => useQuery({ queryKey: ["organizations"], queryFn: getOrganizations });
export const useUsers = () => useQuery({ queryKey: ["users"], queryFn: getUsers });
export const useRoles = () => useQuery({ queryKey: ["roles"], queryFn: getRoles });
export const usePermissions = () => useQuery({ queryKey: ["permissions"], queryFn: getPermissions, staleTime: Infinity });
export const useSubscriptionPlans = () => useQuery({ queryKey: ["subscription-plans"], queryFn: getSubscriptionPlans });
export const useFeatures = () => useQuery({ queryKey: ["features"], queryFn: getFeatures });
export const useAuditLogs = () => useQuery({ queryKey: ["audit-logs"], queryFn: getAuditLogs });
export const useNotifications = () => useQuery({ queryKey: ["notifications"], queryFn: getNotifications });
export const usePlatformConfiguration = () => useQuery({ queryKey: ["platform-configuration"], queryFn: getPlatformConfiguration });
export const useMonitoring = () => useQuery({ queryKey: ["monitoring"], queryFn: getMonitoringStatus });

const auditKeys = [["audit-logs"], ["notifications"], ["dashboard"]];
export const useSaveOrganization = () => usePortalMutation(saveOrganization, [["organizations"], ["tenants"], ...auditKeys]);
export const useOrganizationStatus = () => usePortalMutation(({ id, status }: { id: string; status: "Active" | "Inactive" }) => setOrganizationStatus(id, status), [["organizations"], ...auditKeys]);
export const useSaveUser = () => usePortalMutation(saveUser, [["users"], ...auditKeys]);
export const useUserStatus = () => usePortalMutation(({ id, status }: { id: string; status: "Active" | "Inactive" }) => setUserStatus(id, status), [["users"], ...auditKeys]);
export const usePasswordReset = () => usePortalMutation(requestPasswordReset, [["audit-logs"], ["notifications"]]);
export const useSaveRole = () => usePortalMutation(saveRole, [["roles"], ["users"], ...auditKeys]);
export const useDeleteRole = () => usePortalMutation(deleteRole, [["roles"], ...auditKeys]);
export const useSavePlan = () => usePortalMutation(saveSubscriptionPlan, [["subscription-plans"], ["tenants"], ...auditKeys]);
export const useSaveFeature = () => usePortalMutation(saveFeature, [["features"], ...auditKeys]);
export const useToggleTenantFeature = () => usePortalMutation(({ tenantId, featureId }: { tenantId: string; featureId: string }) => toggleTenantFeature(tenantId, featureId), [["tenants"], ["features"], ...auditKeys]);
export const useSavePlatformConfiguration = () => usePortalMutation(savePlatformConfiguration, [["platform-configuration"], ...auditKeys]);
export const useMarkNotificationRead = () => usePortalMutation(({ id, read }: { id: string; read?: boolean }) => markNotificationRead(id, read), [["notifications"]]);
export const useResetDemoWorkspace = () => usePortalMutation(resetDemoWorkspace, [["tenants"], ["organizations"], ["users"], ["roles"], ["subscription-plans"], ["features"], ["audit-logs"], ["notifications"], ["platform-configuration"], ["monitoring"], ["dashboard"]]);
