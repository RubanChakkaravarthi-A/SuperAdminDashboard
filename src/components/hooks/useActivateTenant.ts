import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateTenant } from "../api/API";

export const useActivateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateTenant(id),

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