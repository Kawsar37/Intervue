"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StartInterviewForm } from "@/features/interview/components/start-interview-form";

export default function InterviewsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Start Interview</h1>
            <p className="mt-2 text-muted-foreground">
              Configure your interview session and start practicing.
            </p>
          </div>

          <StartInterviewForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
