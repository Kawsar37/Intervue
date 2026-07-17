"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Lightbulb, Heart } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description:
      "We strive to provide the best interview preparation experience, helping users achieve their career goals.",
  },
  {
    icon: Users,
    title: "User-Centric",
    description:
      "Every feature we build starts with understanding our users' needs and challenges.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We leverage cutting-edge AI technology to create personalized and effective learning experiences.",
  },
  {
    icon: Heart,
    title: "Accessibility",
    description:
      "We believe everyone deserves access to quality interview preparation, regardless of their background.",
  },
];

const team = [
  {
    name: "Intervue Team",
    role: "Building the future of interview preparation",
    description:
      "We're a passionate team dedicated to helping job seekers succeed through AI-powered practice.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              About Intervue
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We&apos;re on a mission to democratize interview preparation through
              artificial intelligence, helping millions of job seekers worldwide
              land their dream jobs.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold text-center">Our Mission</h2>
              <p className="mt-6 text-lg text-muted-foreground text-center">
                Job interviews can be stressful and unpredictable. We believe
                everyone deserves the chance to practice and improve their
                interview skills in a safe, supportive environment. Intervue
                combines advanced AI technology with proven interview techniques
                to provide personalized feedback and guidance.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Values
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title} className="border-0 bg-background shadow-sm">
                  <CardContent className="pt-6">
                    <value.icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
            <div className="mx-auto max-w-2xl">
              {team.map((member) => (
                <Card key={member.name}>
                  <CardContent className="pt-6 text-center">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-primary mt-1">{member.role}</p>
                    <p className="mt-4 text-muted-foreground">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold">Join Us</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Ready to start your interview preparation journey?
            </p>
            <a
              href="/register"
              className="mt-8 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Get Started Today
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
