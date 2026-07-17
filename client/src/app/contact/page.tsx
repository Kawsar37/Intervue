"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Send, Loader2, CheckCircle } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    try {
      await api.post("/contact", data);
      toast.success("Message sent successfully!");
      setIsSubmitted(true);
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Have questions or feedback? We&apos;d love to hear from you. Send us
              a message and we&apos;ll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="py-8 text-center">
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                      <h3 className="mt-4 text-lg font-semibold">
                        Message Sent!
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Thank you for contacting us. We&apos;ll get back to you
                        soon.
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            {...register("name")}
                          />
                          {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            {...register("email")}
                          />
                          {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="How can we help?"
                          {...register("subject")}
                        />
                        {errors.subject && (
                          <p className="text-sm text-destructive">{errors.subject.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us more about your inquiry..."
                          rows={5}
                          {...register("message")}
                        />
                        {errors.message && (
                          <p className="text-sm text-destructive">{errors.message.message}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Other Ways to Reach Us
            </h2>
            <div className="mx-auto max-w-2xl grid gap-6 sm:grid-cols-2">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Mail className="mx-auto h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold">Email</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    support@intervue.com
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <MessageSquare className="mx-auto h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Available Mon-Fri, 9am-6pm EST
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
