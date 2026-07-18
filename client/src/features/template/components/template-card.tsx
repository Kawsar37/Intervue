"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Clock, BookOpen, ChevronRight } from "lucide-react";
import { InterviewTemplate } from "@/types";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: InterviewTemplate;
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="group transition-shadow hover:shadow-md p-4">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{template.title}</CardTitle>
          <Badge
            variant="secondary"
            className={cn(difficultyColors[template.difficulty])}
          >
            {template.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {template.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{template.category}</Badge>
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{template.estimatedDuration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{template.questionCount} questions</span>
            </div>
          </div>
        </div>
      </CardContent>
      <Link
        href={`/templates/${template._id}`}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "flex w-full items-center justify-center gap-2 mt-auto",
        )}
      >
        View Details
        <ChevronRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}
