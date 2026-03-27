import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "@/api/catalog.api";

export const useTreatmentCatalogs = () => {
  return useQuery({
    queryKey: ["treatmentCatalogs"],
    queryFn: () => catalogApi.getTreatmentCatalogs(),
    staleTime: 1000 * 60 * 5,
  });
};
