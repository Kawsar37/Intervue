"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { InterviewTemplate, TemplateFilters } from "@/types";

export function useTemplates(filters?: TemplateFilters) {
  return useQuery<{
    data: InterviewTemplate[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>({
    queryKey: ["templates", filters],
    queryFn: () => {
      const params: Record<string, string> = {};
      if (filters?.category) params.category = filters.category;
      if (filters?.difficulty) params.difficulty = filters.difficulty;
      if (filters?.search) params.search = filters.search;
      if (filters?.page) params.page = String(filters.page);
      if (filters?.limit) params.limit = String(filters.limit);
      return api.get("/templates", { params });
    },
  });
}

export function useTemplate(id: string) {
  return useQuery<{ success: boolean; data: InterviewTemplate }>({
    queryKey: ["templates", id],
    queryFn: () => api.get(`/templates/${id}`),
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation<InterviewTemplate, Error, Partial<InterviewTemplate>>({
    mutationFn: (data) => api.post<InterviewTemplate>("/templates", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation<
    InterviewTemplate,
    Error,
    { id: string; data: Partial<InterviewTemplate> }
  >({
    mutationFn: ({ id, data }) =>
      api.put<InterviewTemplate>(`/templates/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete<void>(`/templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
    },
  });
}
