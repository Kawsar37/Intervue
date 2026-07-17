"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, TrendingUp, Calendar } from "lucide-react";

interface StatsCardsProps {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
}

export function StatsCards({
  totalInterviews,
  completedInterviews,
  averageScore,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Interviews",
      value: totalInterviews,
      icon: FileText,
      description: "All interview sessions",
    },
    {
      title: "Completed",
      value: completedInterviews,
      icon: CheckCircle,
      description: "Successfully finished",
    },
    {
      title: "Average Score",
      value: `${averageScore}%`,
      icon: TrendingUp,
      description: "Across all interviews",
    },
    {
      title: "This Month",
      value: completedInterviews,
      icon: Calendar,
      description: "Interviews this month",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
