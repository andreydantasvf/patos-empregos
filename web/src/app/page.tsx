import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { JobList } from "@/components/job-list";
import { TrustSection } from "@/components/trust-section";
import { WhatsAppBanner } from "@/components/whatsapp-banner";
import { mockJobs } from "@/lib/mock-data";

export default function HomePage() {
  const approvedJobs = mockJobs.filter((job) => job.status === "APROVADO");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <JobList jobs={approvedJobs} />
        <TrustSection />
        <WhatsAppBanner />
      </main>
      <Footer />
    </div>
  );
}
