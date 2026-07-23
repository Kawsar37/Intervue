"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  Star,
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface InterviewSessionProps {
  interviewId: string;
}

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export function InterviewSession({ interviewId }: InterviewSessionProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [evaluations, setEvaluations] = useState<
    Record<number, { score: number; feedback: string }>
  >({});

  // Voice mode state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const accumulatedTextRef = useRef<Record<number, string>>({});

  const { data: interviewResponse, isLoading } = useInterview(interviewId);
  const submitAnswerMutation = useSubmitAnswer();
  const completeInterviewMutation = useCompleteInterview();

  const isVoiceMode = interviewResponse?.data?.mode === "voice";

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Speak question using TTS
  const speakQuestion = useCallback((text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Start listening for voice input
  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // Handle network errors with retry
    let retryCount = 0;
    const maxRetries = 2;

    const originalOnError = recognition.onerror;

    recognition.onstart = () => {
      setIsListening(true);
      // Show accumulated text if any, otherwise empty
      setTranscript(accumulatedTextRef.current[currentIndex] || "");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        // Accumulate final text
        const prev = accumulatedTextRef.current[currentIndex] || "";
        const newAccumulated = prev ? prev + " " + finalTranscript : finalTranscript;
        accumulatedTextRef.current[currentIndex] = newAccumulated;
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [currentIndex]: newAccumulated,
        }));
        // Show accumulated text (clears interim overlay)
        setTranscript(newAccumulated);
      } else if (interimTranscript) {
        // Show accumulated + interim as preview
        const accumulated = accumulatedTextRef.current[currentIndex] || "";
        setTranscript(accumulated ? accumulated + " " + interimTranscript : interimTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);

      if (event.error === "not-allowed") {
        toast.error("Microphone access denied. Please allow microphone access.");
      } else if (event.error === "network") {
        if (retryCount < maxRetries) {
          retryCount++;
          toast.warning(`Network error. Retrying... (${retryCount}/${maxRetries})`);
          setTimeout(() => {
            try {
              recognition.start();
              setIsListening(true);
            } catch (e) {
              console.error("Retry failed:", e);
            }
          }, 1000);
        } else {
          toast.error("Speech recognition unavailable. Please type your answer instead.");
        }
      } else if (event.error !== "aborted") {
        toast.error("Speech recognition error. Please try again or type your answer.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [currentIndex]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  // Auto-speak question when index changes in voice mode
  useEffect(() => {
    if (isVoiceMode && interviewResponse?.data) {
      stopSpeaking();
      stopListening();
      const timer = setTimeout(() => {
        // Show accumulated text for this question if any
        setTranscript(accumulatedTextRef.current[currentIndex] || "");
        speakQuestion(interviewResponse.data.questions[currentIndex].question);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isVoiceMode, interviewResponse?.data?.questions.length]);

  if (isLoading || !interviewResponse?.data) {
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

    stopListening();
    stopSpeaking();

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
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit answer. Please try again.",
      );
    }
  };

  const handleComplete = async () => {
    try {
      await completeInterviewMutation.mutateAsync(interviewId);
      router.push(`/interviews/${interviewId}/result`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to complete interview. Please try again.",
      );
    }
  };

  const answeredCount = Object.keys(answers).filter((key) =>
    answers[Number(key)]?.trim(),
  ).length;

  const evaluatedCount = Object.keys(evaluations).length;
  const currentEvaluation = evaluations[currentIndex];
  const currentAnswer = answers[currentIndex] || "";
  const hasAnswer = currentAnswer.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{answeredCount} answered / {evaluatedCount} evaluated</span>
          {isVoiceMode && (
            <Badge variant="secondary" className="mt-1">
              <Mic className="mr-1 h-3 w-3" /> Voice Mode
            </Badge>
          )}
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
            <div className="flex items-center gap-2">
              {isVoiceMode && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => speakQuestion(currentQuestion.question)}
                  disabled={isSpeaking}
                  title="Read question aloud"
                >
                  <Volume2 className={cn("h-4 w-4", isSpeaking && "animate-pulse")} />
                </Button>
              )}
              <Badge variant="outline">{currentQuestion.category}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isVoiceMode ? (
            /* Voice Mode UI */
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-8">
                <Button
                  size="lg"
                  variant={isListening ? "destructive" : "default"}
                  onClick={isListening ? stopListening : startListening}
                  disabled={!!currentEvaluation}
                  className={cn(
                    "h-20 w-20 rounded-full",
                    isListening && "animate-pulse"
                  )}
                >
                  {isListening ? (
                    <MicOff className="h-8 w-8" />
                  ) : (
                    <Mic className="h-8 w-8" />
                  )}
                </Button>
                <p className="text-sm text-muted-foreground">
                  {isListening
                    ? "Listening... Click to stop"
                    : currentEvaluation
                      ? "Answer submitted"
                      : "Click to start speaking your answer"}
                </p>
                {transcript && (
                  <div className="w-full rounded-lg bg-muted p-4">
                    <p className="text-sm">{transcript}</p>
                  </div>
                )}
              </div>

              {/* Text input fallback for voice mode */}
              <div className="space-y-2">
                <Label>Or type your answer</Label>
                <Textarea
                  placeholder="Type your answer here..."
                  value={currentAnswer}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  rows={4}
                  disabled={!!currentEvaluation}
                />
              </div>
            </div>
          ) : (
            /* Text Mode UI */
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
          )}

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
