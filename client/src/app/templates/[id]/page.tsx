"use client";

import { useParams, useRouter } from "next/navigation";
import { useTemplate } from "@/features/template/api/use-template";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, BookOpen, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: template, isLoading, error } = useTemplate(params.id as string);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Template not found.</p>
            <Button variant="link" onClick={() => router.push("/templates")}>
              Back to Templates
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const templateData = template.data;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        <div className="mx-auto max-w-3xl space-y-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/templates")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Button>

          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold">{templateData.title}</h1>
              <Badge
                variant="secondary"
                className={cn(difficultyColors[templateData.difficulty])}
              >
                {templateData.difficulty}
              </Badge>
            </div>
            <p className="mt-4 text-muted-foreground">{templateData.description}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge variant="outline">{templateData.category}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{templateData.estimatedDuration} minutes</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{templateData.questionCount} questions</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Premium</p>
                  <span>{templateData.isPremium ? "Yes" : "No"}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {(templateData.tags ?? []).map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button size="lg" className="flex-1">
              Start Interview
            </Button>
            <Button size="lg" variant="outline">
              Add to Favorites
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
