"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <h1 className="text-5xl font-extrabold text-[#0F172A] mb-6">Terms of Service</h1>
            <p className="text-[#0F172A]/70 text-lg">Last updated: January 19, 2026</p>
          </div>

          <div className="glass p-12 rounded-[2.5rem] space-y-8 text-[#0F172A]">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing or using Internal CRM, you agree to be bound by these Terms of Service. 
                If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">2. Description of Service</h2>
              <p className="mb-4">
                Internal CRM is a customer relationship management platform designed for startups and 
                small businesses to manage customers, deals, tasks, and team collaboration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">3. Account Registration</h2>
              <p className="mb-4">
                To use certain features of the service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">4. Acceptable Use</h2>
              <p className="mb-4">
                You agree not to use the service to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any harmful or malicious content</li>
                <li>Attempt to gain unauthorized access to the system</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">5. Data Privacy</h2>
              <p className="mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which explains 
                how we collect, use, and share your information. By using our service, you agree 
                to the collection and use of information in accordance with our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">6. Termination</h2>
              <p className="mb-4">
                We may terminate or suspend your account and access to the service immediately, 
                without prior notice, for any reason whatsoever, including without limitation if 
                you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">7. Disclaimer of Warranties</h2>
              <p className="mb-4">
                The service is provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all 
                warranties, express or implied, including without limitation implied warranties 
                of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">8. Limitation of Liability</h2>
              <p className="mb-4">
                In no event shall Internal CRM be liable for any indirect, incidental, special, 
                consequential or punitive damages resulting from your use of or inability to use 
                the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">9. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these terms at any time. We will notify users of 
                any changes by posting the new Terms of Service on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-primary">10. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at{" "}
                <Link href="/contact" className="text-primary font-bold hover:underline">
                  support@internalcrm.com
                </Link>.
              </p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/" 
              className="inline-block px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}