"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { InterviewTemplate } from "@/types";

export function useFavorites() {
  return useQuery<{ success: boolean; data: InterviewTemplate[] }>({
    queryKey: ["favorites"],
    queryFn: () => api.get("/favorites"),
  });
}

export function useCheckFavorite(templateId: string) {
  return useQuery<{ success: boolean; data: { favorited: boolean } }>({
    queryKey: ["favorites", templateId],
    queryFn: () => api.get(`/favorites/check/${templateId}`),
    enabled: !!templateId,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; data: { favorited: boolean } },
    Error,
    string
  >({
    mutationFn: (templateId) => api.post(`/favorites/${templateId}`),
    onSuccess: (_data, templateId) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      queryClient.invalidateQueries({ queryKey: ["favorites", templateId] });
    },
  });
}
