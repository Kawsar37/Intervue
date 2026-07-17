"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Play, FileText, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuickActions() {
  const actions = [
    {
      title: "Start Interview",
      description: "Begin a new practice interview",
      href: "/interviews",
      icon: Play,
    },
    {
      title: "Upload Resume",
      description: "Add or update your resume",
      href: "/resumes",
      icon: FileText,
    },
    {
      title: "Browse Templates",
      description: "Explore interview templates",
      href: "/templates",
      icon: Layout,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {actions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "flex h-auto flex-col items-center gap-2 p-6"
              )}
            >
              <action.icon className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
