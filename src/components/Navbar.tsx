import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, usePathname } from "@/src/lib/next-compat";
import { Menu, X, ChevronDown, Feather, BookOpen, Sparkles } from "lucide-react";
import { CMS_CONTENT } from "@/src/lib/sanity";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
const isHomeUnscrolled = pathname === "/" && !isScrolled;
  // Monitor scroll height to trigger background coloring
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset dropdown and mobile drawer on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const serviceCategories = [
    {
      label: "Ghostwriting",
      slug: "ghostwriting",
      links: [
        { label: "Book Writing", href: "/ghostwriting/book-writing" },
        { label: "eBook Writing", href: "/ghostwriting/ebook-writing" },
        { label: "Memoir Writing", href: "/ghostwriting/memoir-writing" },
        { label: "Autobiography", href: "/ghostwriting/autobiography" }
      ]
    },
    {
      label: "Publication",
      slug: "publication",
      links: [
        { label: "Amazon KDP", href: "/publication/amazon-kdp" },
        { label: "Self-publishing", href: "/publication/self-publishing" },
        { label: "Book Marketing", href: "/publication/book-marketing" }
      ]
    },
    {
      label: "Cover Design",
      slug: "cover-design",
      links: [
        { label: "Custom Cover", href: "/cover-design/custom-cover" },
        { label: "Illustrations", href: "/cover-design/illustrations" }
      ]
    },
    {
      label: "Editing",
      slug: "editing",
      links: [
        { label: "Proofreading", href: "/editing/proofreading" },
        { label: "Copy Editing", href: "/editing/copy-editing" },
        { label: "Manuscript Review", href: "/editing/manuscript-review" }
      ]
    }
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-lg shadow-slate-100/30 py-4 border-b border-slate-200"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-[#0a192f] flex items-center justify-center text-white shadow-md shadow-[#0a192f]/20 group-hover:scale-105 transition-transform duration-200">
            <Feather className="h-5 w-5 stroke-[2]" />
          </div>
          <div>
            <span className={`font-sans font-extrabold text-base tracking-tight ${isScrolled ? "text-[#0a192f]" : "text-white"} transition-colors duration-200`}>
              GoldLeaf
            </span>
            <span className="block text-[8px] font-mono font-bold tracking-widest uppercase text-blue-400 -mt-1">
              GHOSTWRITING
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
      <Link
  href="/"
  className={`text-sm font-semibold transition-colors ${
    isHomeUnscrolled ? "text-white hover:text-blue-200" : "text-[#1e40af] hover:text-[#0a192f]"
  }`}
>
  Home

          </Link>
<Link
  href="/about"
  className={`text-sm font-semibold transition-colors ${
    isHomeUnscrolled ? "text-white hover:text-blue-200" : "text-[#1e40af] hover:text-[#0a192f]"
  }`}
>
  About

          </Link>

          {/* Writing Services Megamenu Trigger */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("services")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              href="/writing-services"
              className={`text-sm font-semibold flex items-center gap-1.5 hover:text-[#1e40af] transition-colors pb-2 ${
                pathname.startsWith("/writing-services") ||
pathname.startsWith("/ghostwriting") ||
pathname.startsWith("/publication") ||
pathname.startsWith("/cover-design") ||
pathname.startsWith("/editing")
  ? "text-[#1e40af]"
  : "text-[#1e40af]"
              }`}
            >
              <span>Writing Services</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-300" />
            </Link>

            {/* Megamenu Box */}
            <AnimatePresence>
              {activeDropdown === "services" && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-1 w-[800px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-8 grid grid-cols-4 gap-6"
                >
                  {serviceCategories.map((cat) => (
                    <div key={cat.slug} className="space-y-4">
                      {/* Sub-header */}
                      <Link
                        href={`/${cat.slug}`}
                        className="text-xs font-mono font-bold uppercase tracking-widest text-[#1e40af] hover:text-[#0a192f] flex items-center gap-1"
                      >
                        <span>{cat.label}</span>
                        <ChevronDown className="h-3 w-3 -rotate-90" />
                      </Link>
                      
                      {/* Sub-links */}
                      <ul className="space-y-2">
                        {cat.links.map((link) => (
                          <li key={link.href}>
                            <Link
                               href={link.href}
                              className={`text-xs block py-1.5 hover:text-[#1e40af] transition-colors rounded-lg font-sans font-medium ${
                                pathname === link.href ? "text-[#1e40af]" : "text-slate-500"
                              }`}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Packages */}
          <Link
            href="/packages"
            className={`text-sm font-semibold hover:text-[#1e40af] transition-colors ${
              pathname === "/packages"
  ? "text-[#1e40af]"
  : "text-[#1e40af]"
            }`}
          >
            Packages
          </Link>

          {/* Contact Us */}
          <Link
            href="/contact"
            className={`text-sm font-semibold hover:text-[#1e40af] transition-colors ${
              pathname === "/contact" ? "text-[#1e40af]" : isScrolled ? "text-slate-700" : "text-slate-200"
            }`}
          >
            Contact Us
          </Link>
        </nav>

        {/* Right Action CTA Button */}
        <div className="hidden lg:block">
          <Link
            href="/contact"
            className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center gap-1.5 ${
              isScrolled
                ? "bg-[#1e40af] hover:bg-[#0a192f] text-white shadow-blue-200"
                : "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Get Free Consultation</span>
          </Link>
        </div>

        {/* Mobile Hamburger menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-lg focus:outline-none transition-colors ${
              isScrolled ? "text-slate-800 hover:bg-slate-50" : "text-white hover:bg-white/10"
            }`}
            style={{ minWidth: "44px", minHeight: "44px" }}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer layout */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 top-16 z-30 bg-white w-full overflow-y-auto px-6 py-8 flex flex-col justify-between"
          >
            <nav className="space-y-6">
              <Link
                href="/"
                className={`block text-lg font-bold ${pathname === "/" ? "text-blue-600" : "text-slate-800"}`}
              >
                Home
              </Link>

              <Link
                href="/about"
                className={`block text-lg font-bold ${pathname === "/about"
  ? "text-[#1e40af]"
  : "text-[#1e40af]"}`}
              >
                About Us
              </Link>

              {/* Mobile Services list */}
              <div className="space-y-4">
                <Link
                  href="/writing-services"
                  className={`block text-lg font-bold border-b pb-2 ${pathname === "/writing-services" ? "text-blue-600" : "text-slate-800"}`}
                >
                  Writing Services
                </Link>

                <div className="grid grid-cols-2 gap-4 pl-4">
                  {serviceCategories.map((cat) => (
                    <div key={cat.slug} className="space-y-2">
                      <Link
                        href={`/${cat.slug}`}
                        className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider"
                      >
                        {cat.label}
                      </Link>
                      <ul className="space-y-1">
                        {cat.links.map((link) => (
                          <li key={link.href}>
                            <Link
                              href={link.href}
                              className={`text-xs block py-1 font-medium ${
                                pathname === link.href ? "text-blue-600" : "text-slate-500"
                              }`}
                            >
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/packages"
                className={`block text-lg font-bold ${pathname === "/packages" ? "text-blue-600" : "text-slate-800"}`}
              >
                Packages
              </Link>

              <Link
                href="/contact"
                className={`block text-lg font-bold ${pathname === "/contact" ? "text-blue-600" : "text-slate-800"}`}
              >
                Contact Us
              </Link>
            </nav>

            <div className="pb-24 pt-6 border-t border-slate-100">
              <Link
                href="/contact"
                className="w-full text-center py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-widest shadow-md inline-block"
              >
                Get Free Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
