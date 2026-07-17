"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TemplateList } from "@/features/template/components/template-list";

export default function TemplatesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:px-6">
        <div className="mx-auto max-w-6xl space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Interview Templates</h1>
            <p className="mt-2 text-muted-foreground">
              Choose from our collection of interview templates to practice with.
            </p>
          </div>

          <TemplateList />
        </div>
      </main>

      <Footer />
    </div>
  );
}
