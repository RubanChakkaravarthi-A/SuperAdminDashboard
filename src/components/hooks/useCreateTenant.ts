import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTenant } from "../api/API";

export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenants"],
      });
    },
  });
};