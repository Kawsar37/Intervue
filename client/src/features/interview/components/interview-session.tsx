"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useInterview,
  useSubmitAnswer,
  useCompleteInterview,
} from "../api/use-interview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, ChevronLeft, ChevronRight, Check, Star } from "lucide-react";
import { toast } from "sonner";

interface InterviewSessionProps {
  interviewId: string;
}

export function InterviewSession({ interviewId }: InterviewSessionProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [evaluations, setEvaluations] = useState<
    Record<number, { score: number; feedback: string }>
  >({});

  const { data: interviewResponse, isLoading } = useInterview(interviewId);
  const submitAnswerMutation = useSubmitAnswer();
  const completeInterviewMutation = useCompleteInterview();

  if (isLoading || !interviewResponse) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const interview = interviewResponse.data;
  const questions = interview.questions;
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: value }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitAnswer = async () => {
    const answer = answers[currentIndex];
    if (!answer?.trim()) return;

    try {
      const result = await submitAnswerMutation.mutateAsync({
        interviewId,
        questionIndex: currentIndex,
        answer,
      });

      setEvaluations((prev) => ({
        ...prev,
        [currentIndex]: result.data.evaluation,
      }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit answer. Please try again.");
    }
  };

  const handleComplete = async () => {
    try {
      await completeInterviewMutation.mutateAsync(interviewId);
      router.push(`/interviews/${interviewId}/result`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to complete interview. Please try again.");
    }
  };

  const answeredCount = Object.keys(answers).filter(
    (key) => answers[Number(key)]?.trim()
  ).length;

  const evaluatedCount = Object.keys(evaluations).length;
  const currentEvaluation = evaluations[currentIndex];
  const currentAnswer = answers[currentIndex] || "";
  const hasAnswer = currentAnswer.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-center justify-between text-sm text-muted-foreground">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>
            {answeredCount} answered / {evaluatedCount} evaluated
          </span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-lg">
              {currentQuestion.question}
            </CardTitle>
            <Badge variant="outline">{currentQuestion.category}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your Answer</Label>
            <Textarea
              placeholder="Type your answer here..."
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              rows={6}
              disabled={!!currentEvaluation}
            />
          </div>

          {!currentEvaluation && hasAnswer && (
            <Button
              onClick={handleSubmitAnswer}
              disabled={submitAnswerMutation.isPending}
            >
              {submitAnswerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Evaluating with AI...
                </>
              ) : (
                "Submit Answer for Evaluation"
              )}
            </Button>
          )}

          {/* AI Evaluation Result */}
          {currentEvaluation && (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">AI Evaluation</span>
                <Badge
                  variant={
                    currentEvaluation.score >= 7
                      ? "default"
                      : currentEvaluation.score >= 5
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {currentEvaluation.score}/10
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentEvaluation.feedback}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentIndex < questions.length - 1 && (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          {currentIndex === questions.length - 1 && (
            <Button
              onClick={handleComplete}
              disabled={
                evaluatedCount === 0 || completeInterviewMutation.isPending
              }
            >
              {completeInterviewMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Final Report...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Complete Interview
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
