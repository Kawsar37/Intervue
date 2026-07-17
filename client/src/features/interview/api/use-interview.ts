"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Interview, InterviewResult } from "@/types";

export function useInterviews(status?: string) {
  return useQuery<Interview[]>({
    queryKey: ["interviews", status],
    queryFn: () => {
      const params: Record<string, string> = {};
      if (status) params.status = status;
      return api.get("/interviews", { params });
    },
  });
}

export function useInterview(id: string) {
  return useQuery<Interview>({
    queryKey: ["interviews", id],
    queryFn: () => api.get<Interview>(`/interviews/${id}`),
    enabled: !!id,
  });
}

export function useStartInterview() {
  const queryClient = useQueryClient();

  return useMutation<
    Interview,
    Error,
    {
      templateId: string;
      resumeId?: string;
      jobDescription?: string;
      questions: { question: string; category: string }[];
    }
  >({
    mutationFn: (data) => api.post<Interview>("/interviews", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
    },
  });
}

export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation<
    Interview,
    Error,
    {
      interviewId: string;
      questionIndex: number;
      answer: string;
      feedback: string;
      score: number;
    }
  >({
    mutationFn: ({ interviewId, ...data }) =>
      api.post<Interview>(`/interviews/${interviewId}/answer`, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["interviews", data._id] });
    },
  });
}

export function useCompleteInterview() {
  const queryClient = useQueryClient();

  return useMutation<Interview, Error, string>({
    mutationFn: (id) => api.post<Interview>(`/interviews/${id}/complete`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      queryClient.invalidateQueries({ queryKey: ["interviews", data._id] });
    },
  });
}

export function useInterviewResult(interviewId: string) {
  return useQuery<InterviewResult>({
    queryKey: ["interview-result", interviewId],
    queryFn: () =>
      api.get<InterviewResult>(`/interviews/${interviewId}/result`),
    enabled: !!interviewId,
  });
}
