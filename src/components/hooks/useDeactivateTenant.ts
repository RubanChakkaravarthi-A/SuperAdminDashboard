import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateTenant } from "../api/API";

export const useDeactivateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactivateTenant(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["tenants"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tenant", id],
      });
    },
  });
};