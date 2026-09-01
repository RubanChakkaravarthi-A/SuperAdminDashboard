import { useQuery } from "@tanstack/react-query";
import { getTenant } from "../api/API";

export const useTenant = (id: string) => {
  return useQuery({
    queryKey: ["tenant", id],
    queryFn: () => getTenant(id),
    enabled: !!id,
  });
};