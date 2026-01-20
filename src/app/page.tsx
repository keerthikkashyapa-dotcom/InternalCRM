"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FeatureGrid />

      {/* Additional Stats/CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto glass p-12 rounded-[2.5rem] text-center border-primary/20 bg-primary/5">
          <h2 className="text-3xl font-extrabold text-[#0F172A] mb-6">
            Ready to streamline your business?
          </h2>
          <p className="text-[#0F172A]/70 mb-8">
            Join other small businesses who have ditched spreadsheets for a more powerful internal workflow.
          </p>
          <button className="px-8 py-4 bg-[#0F172A] text-white font-bold rounded-2xl hover:bg-[#0F172A]/90 transition-colors">
            Get Started for Free
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
