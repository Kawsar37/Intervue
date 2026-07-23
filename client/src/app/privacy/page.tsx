import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 md:px-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: July 23, 2026</p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly, including your name, email address, interview
              responses, and resume data. We also collect usage data such as pages visited and features used.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use your information to provide and improve our AI-powered interview preparation services,
              generate personalized feedback, and communicate with you about your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information against
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us through our contact page.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
