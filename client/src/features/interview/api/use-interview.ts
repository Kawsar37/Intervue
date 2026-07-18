"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Interview, InterviewResult } from "@/types";

export function useInterviews(status?: string) {
  return useQuery<{ success: boolean; data: Interview[] }>({
    queryKey: ["interviews", status],
    queryFn: () => {
      const params: Record<string, string> = {};
      if (status) params.status = status;
      return api.get("/interviews", { params });
    },
  });
}

export function useInterview(id: string) {
  return useQuery<{ success: boolean; data: Interview }>({
    queryKey: ["interviews", id],
    queryFn: () => api.get(`/interviews/${id}`),
    enabled: !!id,
  });
}

export function useStartInterview() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; data: Interview },
    Error,
    {
      templateId: string;
      resumeId?: string;
      jobDescription?: string;
      mode?: "text" | "voice";
    }
  >({
    mutationFn: (data) => api.post("/interviews", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
  });
}

export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; data: { interview: Interview; evaluation: { score: number; feedback: string } } },
    Error,
    {
      interviewId: string;
      questionIndex: number;
      answer: string;
    }
  >({
    mutationFn: ({ interviewId, ...data }) =>
      api.post(`/interviews/${interviewId}/answer`, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["interviews", data.data.interview._id] });
    },
  });
}

export function useCompleteInterview() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; data: Interview }, Error, string>({
    mutationFn: (id) => api.post(`/interviews/${id}/complete`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["interviews", data.data._id] });
    },
  });
}

export function useInterviewResult(interviewId: string) {
  return useQuery<{ success: boolean; data: InterviewResult }>({
    queryKey: ["interview-result", interviewId],
    queryFn: () => api.get(`/interviews/${interviewId}/result`),
    enabled: !!interviewId,
  });
}
