"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { api } from "@/lib/api";

// Generic GET hook
export function useFetch<T>(
  key: string[],
  endpoint: string,
  options?: UseQueryOptions<T>
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => api.get<T>(endpoint),
    ...options,
  });
}

// Generic POST hook
export function usePost<TData, TVariables = unknown>(
  endpoint: string,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: string[][];
  }
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: (variables) => api.post<TData>(endpoint, variables),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      options?.invalidateQueries?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: options?.onError,
  });
}

// Generic PUT hook
export function useUpdate<TData, TVariables = unknown>(
  endpoint: string,
  options?: {
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
    invalidateQueries?: string[][];
  }
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, TVariables>({
    mutationFn: (variables) => api.put<TData>(endpoint, variables),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      options?.invalidateQueries?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: options?.onError,
  });
}

// Generic DELETE hook
export function useDelete<TData = void>(
  endpoint: string,
  options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    invalidateQueries?: string[][];
  }
) {
  const queryClient = useQueryClient();

  return useMutation<TData, Error, string>({
    mutationFn: (id) => api.delete<TData>(`${endpoint}/${id}`),
    onSuccess: () => {
      options?.onSuccess?.();
      options?.invalidateQueries?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
    onError: options?.onError,
  });
}
