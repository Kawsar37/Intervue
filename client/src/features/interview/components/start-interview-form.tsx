"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTemplates } from "@/features/template/api/use-template";
import { useResumes } from "@/features/resume/api/use-resume";
import { useStartInterview } from "../api/use-interview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Play } from "lucide-react";
import { toast } from "sonner";

export function StartInterviewForm() {
  const router = useRouter();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");

  const { data: templatesData, isLoading: templatesLoading } = useTemplates({
    limit: 50,
  });
  const { data: resumesData, isLoading: resumesLoading } = useResumes();
  const startInterviewMutation = useStartInterview();

  const templates = templatesData?.data || [];
  const resumes = resumesData?.data || [];
  const selectedTemplate = templates.find((t) => t._id === selectedTemplateId);

  const handleTemplateChange = (value: string | null) => {
    setSelectedTemplateId(value || "");
  };

  const handleResumeChange = (value: string | null) => {
    setSelectedResumeId(value === "none" ? "" : value || "");
  };

  const handleStart = async () => {
    if (!selectedTemplateId) return;

    try {
      const result = await startInterviewMutation.mutateAsync({
        templateId: selectedTemplateId,
        resumeId: selectedResumeId || undefined,
        jobDescription: jobDescription || undefined,
      });

      router.push(`/interviews/${result.data._id}/session`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start interview. Please try again.");
    }
  };

  if (templatesLoading || resumesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Interview Template</Label>
            <Select
              value={selectedTemplateId}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template._id} value={template._id}>
                    {template.title} ({template.difficulty})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplate && (
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p>
                <strong>Category:</strong> {selectedTemplate.category}
              </p>
              <p>
                <strong>Duration:</strong> {selectedTemplate.estimatedDuration}{" "}
                minutes
              </p>
              <p>
                <strong>Questions:</strong> {selectedTemplate.questionCount}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Resume (optional)</Label>
            <Select
              value={selectedResumeId}
              onValueChange={handleResumeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a resume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No resume</SelectItem>
                {resumes?.map((resume) => (
                  <SelectItem key={resume._id} value={resume._id}>
                    {resume.fileName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Job Description (optional)</Label>
            <Textarea
              placeholder="Paste a job description for more personalized questions..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="w-full"
        onClick={handleStart}
        disabled={!selectedTemplateId || startInterviewMutation.isPending}
      >
        {startInterviewMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Questions with AI...
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Start Interview
          </>
        )}
      </Button>
    </div>
  );
}
