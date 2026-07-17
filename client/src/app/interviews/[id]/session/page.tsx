"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { InterviewSession } from "@/features/interview/components/interview-session";

export default function InterviewSessionPage() {
  const params = useParams();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        <div className="mx-auto max-w-3xl">
          <InterviewSession interviewId={params.id as string} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
