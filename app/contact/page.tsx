import React from "react";
import { CMS_CONTENT } from "@/src/lib/sanity";
import ContactForm from "@/src/components/ContactForm";
import SectionHeading from "@/src/components/SectionHeading";
import { Mail, Phone, MapPin, Clock, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: CMS_CONTENT.seo.contact.title,
  description: CMS_CONTENT.seo.contact.description,
  keywords: CMS_CONTENT.seo.contact.keywords
};

export default function ContactPage() {
  // Read target package if provided in query URL (handled dynamically client-side in React)
  // Since we are compiling in a Next-compatible structure, let's parse the URL search query if on the browser.
  const isBrowser = typeof window !== "undefined";
  const searchParams = isBrowser ? new URLSearchParams(window.location.search) : null;
  const preselectedPackage = searchParams?.get("package") || undefined;

  return (
    <div className="space-y-24 pt-28 pb-20">
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <SectionHeading
          badge="SECURE INTAKE PORTAL"
          title="Schedule Your Free Publishing Diagnostic"
          subtitle="Ready to transform your ideas into pristine literature? Partner with our elite writing co-authors. Your project is held in absolute confidentiality."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
          {/* Left Side: Contact details & trust banners */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-sans font-bold text-slate-900">
                GoldLeaf Client Registry Office
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Connect directly with a Senior Publishing Coordinator. We sign NDAs before conducting structured diagnostics, outline sessions, or timeline mappings.
              </p>
            </div>

            {/* Coordinates list */}
            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="text-slate-500 text-sm italic">
                Contact details removed as requested.
              </div>
            </div>

            {/* Security Badges */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs font-semibold text-blue-700 bg-blue-50/50 px-4 py-3 rounded-xl border border-blue-100/50">
                <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
                <span>NDA executed immediately upon form receipt.</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-blue-700 bg-blue-50/50 px-4 py-3 rounded-xl border border-blue-100/50">
                <Sparkles className="h-5 w-5 text-blue-600 shrink-0" />
                <span>Full copy ownership and royalty rights retained by the author.</span>
              </div>
            </div>
          </div>

          {/* Right Side: Lead Capture Form */}
          <div className="lg:col-span-7">
            <ContactForm preselectedPackage={preselectedPackage} />
          </div>
        </div>
      </section>
    </div>
  );
}
