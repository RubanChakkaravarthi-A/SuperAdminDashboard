import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTenant } from "../api/API";
import type { Tenant } from "../api/API";

export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      tenant,
    }: {
      id: string;
      tenant: Partial<Tenant>;
    }) => updateTenant(id, tenant),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tenants"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tenant", variables.id],
      });
    },
  });
};