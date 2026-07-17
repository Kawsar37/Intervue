"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Interview } from "@/types";
import { StatsCards } from "./stats-cards";
import { PerformanceChart } from "./performance-chart";
import { RecentInterviews } from "./recent-interviews";
import { QuickActions } from "./quick-actions";
import { Loader2 } from "lucide-react";

export function DashboardContent() {
  const { data: interviews, isLoading } = useQuery<Interview[]>({
    queryKey: ["interviews"],
    queryFn: () => api.get("/interviews"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const allInterviews = interviews || [];
  const completedInterviews = allInterviews.filter(
    (i) => i.status === "completed"
  );

  // Calculate average score from completed interviews
  const avgScore =
    completedInterviews.length > 0
      ? Math.round(
          completedInterviews.reduce((acc, i) => {
            const scores = i.questions
              .filter((q) => q.score !== undefined)
              .map((q) => q.score as number);
            const avg =
              scores.length > 0
                ? scores.reduce((a, b) => a + b, 0) / scores.length
                : 0;
            return acc + avg * 10;
          }, 0) / completedInterviews.length
        )
      : 0;

  // Generate performance chart data
  const chartData = completedInterviews.slice(-7).map((interview, index) => ({
    date: new Date(interview.completedAt || interview.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    score: Math.round(
      interview.questions
        .filter((q) => q.score !== undefined)
        .reduce((acc, q) => acc + ((q.score as number) * 10 || 0), 0) /
        Math.max(
          interview.questions.filter((q) => q.score !== undefined).length,
          1
        )
    ),
  }));

  return (
    <div className="space-y-6">
      <StatsCards
        totalInterviews={allInterviews.length}
        completedInterviews={completedInterviews.length}
        averageScore={avgScore}
      />

      <QuickActions />

      <div className="grid gap-6 lg:grid-cols-2">
        <PerformanceChart data={chartData} />
        <RecentInterviews interviews={allInterviews} />
      </div>
    </div>
  );
}
