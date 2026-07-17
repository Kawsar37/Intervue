"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ResumeUpload } from "@/features/resume/components/resume-upload";
import { ResumeList } from "@/features/resume/components/resume-list";

export default function ResumesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold">My Resumes</h1>
            <p className="mt-2 text-muted-foreground">
              Upload your resume to get personalized interview questions and feedback.
            </p>
          </div>

          <ResumeUpload />
          
          <ResumeList />
        </div>
      </main>

      <Footer />
    </div>
  );
}
