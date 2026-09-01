import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../api/API";

export const useTenants = () => {
  return useQuery({
    queryKey: ["tenants"],
    queryFn: getTenants,
  });
};