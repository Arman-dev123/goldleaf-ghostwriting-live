import React from "react";
import { Link } from "@/src/lib/next-compat";
import { Feather, Mail, Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { CMS_CONTENT } from "@/src/lib/sanity";

export function Footer() {
  const categories = [
    {
      title: "Services",
      links: [
        { label: "Book Ghostwriting", href: "/ghostwriting/book-writing" },
        { label: "eBook Ghostwriting", href: "/ghostwriting/ebook-writing" },
        { label: "Memoir & Biography", href: "/ghostwriting/memoir-writing" },
        { label: "Autobiography Writing", href: "/ghostwriting/autobiography" }
      ]
    },
    {
      title: "Self-Publishing",
      links: [
        { label: "Amazon KDP Setup", href: "/publication/amazon-kdp" },
        { label: "Self-Publishing Imprints", href: "/publication/self-publishing" },
        { label: "Book Marketing & PR", href: "/publication/book-marketing" },
        { label: "Pricing Packages", href: "/packages" }
      ]
    },
    {
      title: "Quality Review",
      links: [
        { label: "Manuscript Diagnostics", href: "/editing/manuscript-review" },
        { label: "Grammar Proofreading", href: "/editing/proofreading" },
        { label: "CMOS Copy Editing", href: "/editing/copy-editing" },
        { label: "Custom Cover Artwork", href: "/cover-design/custom-cover" }
      ]
    }
  ];

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-300 pt-20 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Main Grid structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand block */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Feather className="h-5 w-5" />
              </div>
              <div>
                <span className="font-sans font-extrabold text-base tracking-tight text-white">
                  GoldLeaf
                </span>
                <span className="block text-[8px] font-mono font-bold tracking-widest uppercase text-blue-500 -mt-1">
                  GHOSTWRITING
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {CMS_CONTENT.footer.tagline}
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors">
                <Mail className="h-4.5 w-4.5 text-blue-500" />
                <a href="mailto:goldleafghostwriting@gmail.com">goldleafghostwriting@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Nav Links columns */}
          {categories.map((cat, i) => (
            <div key={i} className="space-y-5">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-100">
                {cat.title}
              </h4>
              <ul className="space-y-3">
                {cat.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-400 hover:text-white hover:underline transition-all duration-150 inline-flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-2.5 w-2.5 text-slate-600 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Footer Bottom details bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-500 text-center md:text-left">
            {CMS_CONTENT.footer.copyright}
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link href="/privacy-policy" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <span className="text-slate-800">|</span>
            <Link href="/terms-of-service" className="hover:text-slate-300">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
