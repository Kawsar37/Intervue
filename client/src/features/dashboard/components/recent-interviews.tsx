"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Clock, ChevronRight } from "lucide-react";
import { Interview } from "@/types";
import { cn } from "@/lib/utils";

interface RecentInterviewsProps {
  interviews: Interview[];
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

export function RecentInterviews({ interviews }: RecentInterviewsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Interviews</CardTitle>
        <Link
          href="/interviews"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-1"
          )}
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {!interviews || interviews.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No interviews yet. Start your first interview!
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.slice(0, 5).map((interview) => (
              <div
                key={interview._id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">
                    {(interview.templateId as unknown as { title?: string })?.title || "Interview"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={statusColors[interview.status]}
                >
                  {interview.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
