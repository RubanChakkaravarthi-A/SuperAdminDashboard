import { useQuery } from "@tanstack/react-query";
import { getTenantStats } from "../api/API";

export const useTenantStats = (id: string) => {
  return useQuery({
    queryKey: ["tenantStats", id],
    queryFn: () => getTenantStats(id),
    enabled: !!id,
  });
};