"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useUploadResume } from "../api/use-resume";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ResumeUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const uploadMutation = useUploadResume();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): boolean => {
    if (file.type !== "application/pdf") {
      setErrorMessage("Only PDF files are allowed");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File size must be less than 5MB");
      return false;
    }
    return true;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      setErrorMessage("");

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          setSelectedFile(file);
        }
      }
    },
    []
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setErrorMessage("");
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (validateFile(file)) {
          setSelectedFile(file);
        }
      }
    },
    []
  );

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus("uploading");
    setErrorMessage("");

    try {
      await uploadMutation.mutateAsync(selectedFile);
      setUploadStatus("success");
      setTimeout(() => {
        router.refresh();
        setSelectedFile(null);
        setUploadStatus("idle");
      }, 1500);
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStatus("idle");
    setErrorMessage("");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            selectedFile && "border-primary/50 bg-primary/5"
          )}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className={cn(
              "absolute inset-0 cursor-pointer opacity-0",
              selectedFile && "pointer-events-none"
            )}
            disabled={uploadStatus === "uploading"}
          />

          {uploadStatus === "success" ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="text-sm font-medium">Resume uploaded successfully!</p>
              <p className="text-xs text-muted-foreground">Analyzing your resume...</p>
            </div>
          ) : selectedFile ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <FileText className="h-10 w-10 text-primary" />
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={handleUpload}
                  disabled={uploadStatus === "uploading"}
                >
                  {uploadStatus === "uploading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetUpload}
                  disabled={uploadStatus === "uploading"}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">
                Drag and drop your resume here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                PDF files up to 5MB
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
