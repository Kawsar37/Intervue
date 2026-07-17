"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  FileText,
  BarChart3,
  Target,
  ChevronRight,
  Star,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Interviews",
    description: "Get realistic interview questions generated based on your resume and target role.",
  },
  {
    icon: FileText,
    title: "Resume Analysis",
    description: "Upload your resume and let our AI extract your skills and experience.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description: "Track your progress over time with detailed analytics and insights.",
  },
  {
    icon: Target,
    title: "Personalized Feedback",
    description: "Receive constructive feedback on each answer to improve your skills.",
  },
];

const steps = [
  {
    step: 1,
    title: "Upload Your Resume",
    description: "Start by uploading your resume or CV. Our AI will analyze your skills and experience.",
  },
  {
    step: 2,
    title: "Choose a Template",
    description: "Select from our library of interview templates or create a custom one.",
  },
  {
    step: 3,
    title: "Practice Interview",
    description: "Answer AI-generated questions in a realistic interview simulation.",
  },
  {
    step: 4,
    title: "Get Feedback",
    description: "Receive detailed feedback and scores to improve your interview skills.",
  },
];

export default function HomePage() {
  const { data: statsResponse } = useQuery<{ success: boolean; data: { totalUsers: number; totalInterviews: number; totalResumes: number } }>({
    queryKey: ["platform-stats"],
    queryFn: () => api.get("/stats"),
  });

  const { data: testimonialsResponse } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["testimonials"],
    queryFn: () => api.get("/testimonials"),
  });

  const { data: faqsResponse } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["faqs"],
    queryFn: () => api.get("/faqs"),
  });

  const stats = statsResponse?.data;
  const testimonials = testimonialsResponse?.data || [];
  const faqs = faqsResponse?.data || [];

  const platformStats = stats
    ? [
        { value: `${stats.totalUsers}+`, label: "Active Users" },
        { value: `${stats.totalInterviews}+`, label: "Interviews Completed" },
        { value: `${stats.totalResumes}+`, label: "Resumes Analyzed" },
        { value: "4.9/5", label: "User Rating" },
      ]
    : [
        { value: "0", label: "Active Users" },
        { value: "0", label: "Interviews Completed" },
        { value: "0", label: "Resumes Analyzed" },
        { value: "4.9/5", label: "User Rating" },
      ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:px-6 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Ace Your Next Interview with{" "}
              <span className="text-primary">AI Practice</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Practice interviews with AI-powered feedback. Upload your resume, get personalized
              questions, and improve your skills before the real interview.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Get Started Free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/templates"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
              >
                Browse Templates
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Everything You Need</h2>
              <p className="mt-4 text-muted-foreground">
                Our platform provides all the tools you need to prepare for your next interview.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="border-0 bg-background shadow-sm">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="mt-4 text-muted-foreground">
                Get started in just a few simple steps.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-4">
              {steps.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Trusted by Thousands</h2>
              <p className="mt-4 text-muted-foreground">
                Join our growing community of job seekers.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {platformStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl font-bold">{stat.value}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">What Our Users Say</h2>
              <p className="mt-4 text-muted-foreground">
                Hear from people who landed their dream jobs with Intervue.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial: any) => (
                <Card key={testimonial._id} className="border-0 bg-background shadow-sm">
                  <CardContent className="pt-6">
                    <div className="mb-3 flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="mb-4 text-sm text-muted-foreground">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              <p className="mt-4 text-muted-foreground">
                Everything you need to know about Intervue.
              </p>
            </div>
            <div className="mx-auto mt-12 max-w-3xl space-y-4">
              {faqs.map((faq: any) => (
                <FaqItem key={faq._id} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-2xl rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
              <h2 className="text-3xl font-bold">Ready to Start Practicing?</h2>
              <p className="mt-4 text-primary-foreground/80">
                Join thousands of job seekers who have improved their interview skills with Intervue.
              </p>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg", variant: "secondary" }),
                  "mt-8 inline-flex"
                )}
              >
                Start Free Trial
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border bg-background">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left font-medium"
      >
        {question}
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-sm text-muted-foreground">
          {answer}
        </div>
      )}
    </div>
  );
}
