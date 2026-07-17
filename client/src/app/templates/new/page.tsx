"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTemplate } from "@/features/template/api/use-template";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function AddTemplatePage() {
  const router = useRouter();
  const createTemplate = useCreateTemplate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category || !difficulty || !estimatedDuration || !questionCount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createTemplate.mutateAsync({
        title,
        description,
        category,
        difficulty: difficulty as "beginner" | "intermediate" | "advanced",
        estimatedDuration: Number(estimatedDuration),
        questionCount: Number(questionCount),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        isPremium: false,
      });

      toast.success("Template created successfully!");
      router.push("/templates");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create template");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <Link href="/templates" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Link>

          <div>
            <h1 className="text-3xl font-bold">Add Interview Template</h1>
            <p className="mt-2 text-muted-foreground">
              Create a new interview template for others to practice with.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this template covers..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Input
                      placeholder="e.g. Frontend, Backend, Data Science"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty *</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Estimated Duration (minutes) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="5"
                      max="120"
                      placeholder="e.g. 30"
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="questionCount">Question Count *</Label>
                    <Input
                      id="questionCount"
                      type="number"
                      min="1"
                      max="50"
                      placeholder="e.g. 10"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g. React, JavaScript, System Design"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={createTemplate.isPending}>
                  {createTemplate.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Template"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
