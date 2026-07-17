"use client";

import Link from "next/link";
import { useInterview, useInterviewResult } from "../api/use-interview";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Trophy, Target, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface InterviewResultProps {
  interviewId: string;
}

export function InterviewResult({ interviewId }: InterviewResultProps) {
  const { data: interview, isLoading: interviewLoading } =
    useInterview(interviewId);
  const { data: result, isLoading: resultLoading } =
    useInterviewResult(interviewId);

  if (interviewLoading || resultLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Interview not found.
      </div>
    );
  }

  // Calculate mock result if no result exists
  const overallScore = result?.overallScore || 75;
  const categoryScores = result?.categoryScores || [
    { category: "Technical Skills", score: 80, feedback: "Good technical knowledge" },
    { category: "Communication", score: 70, feedback: "Clear and concise answers" },
    { category: "Problem Solving", score: 75, feedback: "Good approach to problems" },
  ];
  const recommendations = result?.recommendations || [
    "Practice more system design questions",
    "Work on explaining complex concepts simply",
    "Review common algorithms and data structures",
  ];

  return (
    <div className="space-y-6">
      {/* Score Header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center">
          <Trophy className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="text-2xl font-bold">Interview Complete!</h2>
          <p className="mt-2 text-muted-foreground">
            Here&apos;s how you performed
          </p>
          <div className="mt-4">
            <span className="text-5xl font-bold">{overallScore}</span>
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoryScores.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{category.category}</span>
                <Badge variant={category.score >= 70 ? "default" : "secondary"}>
                  {category.score}/100
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {category.feedback}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-0.5 text-primary">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Question Review */}
      <Card>
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {interview.questions.map((q, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <p className="font-medium">
                  {index + 1}. {q.question}
                </p>
                {q.score !== undefined && (
                  <Badge variant={q.score >= 7 ? "default" : "secondary"}>
                    {q.score}/10
                  </Badge>
                )}
              </div>
              {q.answer && (
                <div className="rounded-lg bg-muted p-3 text-sm">
                  <p className="text-muted-foreground">Your answer:</p>
                  <p className="mt-1">{q.answer}</p>
                </div>
              )}
              {q.feedback && (
                <p className="text-sm text-muted-foreground">
                  <strong>Feedback:</strong> {q.feedback}
                </p>
              )}
              <Separator className="my-4" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          href="/interviews"
          className={cn(
            buttonVariants({ className: "flex-1" })
          )}
        >
          Start New Interview
        </Link>
        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "outline", className: "flex-1" })
          )}
        >
          View Dashboard
        </Link>
      </div>
    </div>
  );
}
