import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 md:px-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: July 23, 2026</p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using Intervue, you agree to be bound by these Terms of Service. If you do
              not agree, please do not use our service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. Use of Service</h2>
            <p className="text-muted-foreground">
              You may use Intervue for personal interview preparation. You are responsible for maintaining
              the confidentiality of your account and for all activities under your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. AI-Generated Content</h2>
            <p className="text-muted-foreground">
              Our AI provides interview feedback and evaluations as suggestions. These should be used as
              guidance and do not guarantee interview success.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about these Terms, please contact us through our contact page.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
