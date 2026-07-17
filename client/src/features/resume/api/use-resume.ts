"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Resume } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function useResumes() {
  return useQuery<Resume[]>({
    queryKey: ["resumes"],
    queryFn: () => api.get<Resume[]>("/resumes"),
  });
}

export function useResume(id: string) {
  return useQuery<Resume>({
    queryKey: ["resumes", id],
    queryFn: () => api.get<Resume>(`/resumes/${id}`),
    enabled: !!id,
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();

  return useMutation<Resume, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch(`${API_URL}/resumes`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: "Upload failed",
        }));
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete<void>(`/resumes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}
