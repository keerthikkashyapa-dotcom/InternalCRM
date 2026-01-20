"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <FeatureGrid />

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#0F172A] mb-6">About Hem & Harmony</h2>
            <p className="text-[#0F172A]/70 text-lg max-w-2xl mx-auto">
              Where Fashion Meets Connection - revolutionizing how boutique fashion businesses manage customers, sales, and creative collaborations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-[2rem] text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Customer Relationships</h3>
              <p className="text-[#0F172A]/60">
                Build lasting connections with your fashion clientele through personalized service and style consultations.
              </p>
            </div>
            
            <div className="glass p-8 rounded-[2rem] text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Sales Pipeline</h3>
              <p className="text-[#0F172A]/60">
                Track seasonal collections, manage inventory, and convert leads into loyal fashion customers.
              </p>
            </div>
            
            <div className="glass p-8 rounded-[2rem] text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Creative Collaboration</h3>
              <p className="text-[#0F172A]/60">
                Coordinate with designers, stylists, and suppliers to bring your fashion vision to life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="pt-32 pb-20 px-6 mt-[-80px]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#0F172A] mb-6">Need Help?</h2>
            <p className="text-[#0F172A]/70 text-lg">
              We're here to help Hem & Harmony thrive in the competitive fashion industry.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass p-8 rounded-[2rem]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">Fashion Consultation</h3>
                  <p className="text-[#0F172A]/60 mb-4">
                    Get expert advice on optimizing your boutique operations and customer experience.
                  </p>
                  <a href="mailto:fashion@hemharmony.com" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                    fashion@hemharmony.com
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="glass p-8 rounded-[2rem]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">Style Guides</h3>
                  <p className="text-[#0F172A]/60 mb-4">
                    Access seasonal trend reports, customer segmentation guides, and merchandising best practices.
                  </p>
                  <a href="#" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                    View Style Resources
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass p-8 rounded-[2rem] mt-8 text-center">
            <h3 className="text-2xl font-bold text-[#0F172A] mb-4">Seasonal Launch Guide</h3>
            <p className="text-[#0F172A]/60 mb-6 max-w-2xl mx-auto">
              Prepare for your next collection launch with our comprehensive fashion business setup checklist.
            </p>
            <a href="#" className="inline-block px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-colors">
              Launch Collection
            </a>
          </div>
        </div>
      </section>

      {/* Additional Stats/CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto glass p-12 rounded-[2.5rem] text-center border-primary/20 bg-primary/5">
          <h2 className="text-3xl font-extrabold text-[#0F172A] mb-6">
            Ready to elevate your fashion business?
          </h2>
          <p className="text-[#0F172A]/70 mb-8">
            Join Hem & Harmony in transforming boutique operations with smart technology and personalized customer experiences.
          </p>
          <Link href="/signup">
            <button className="px-8 py-4 bg-[#0F172A] text-white font-bold rounded-2xl hover:bg-[#0F172A]/90 transition-colors">
              Get Started for Free
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
