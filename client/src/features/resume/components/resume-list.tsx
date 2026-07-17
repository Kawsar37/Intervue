"use client";

import { useResumes, useDeleteResume } from "../api/use-resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2, Calendar, Loader2 } from "lucide-react";
import { useState } from "react";

export function ResumeList() {
  const { data: resumes, isLoading, error } = useResumes();
  const deleteMutation = useDeleteResume();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-destructive">
          Failed to load resumes. Please try again.
        </CardContent>
      </Card>
    );
  }

  if (!resumes || resumes.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <FileText className="mx-auto mb-4 h-12 w-12" />
          <p>No resumes uploaded yet.</p>
          <p className="text-sm">Upload your first resume to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {resumes.map((resume) => (
        <Card key={resume._id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {resume.fileName}
              </div>
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(resume._id)}
              disabled={deletingId === resume._id}
            >
              {deletingId === resume._id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 text-destructive" />
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-2">
              {resume.skills.slice(0, 5).map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
              {resume.skills.length > 5 && (
                <Badge variant="outline">+{resume.skills.length - 5} more</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Uploaded {new Date(resume.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
