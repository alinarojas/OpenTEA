"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Menu, X } from "lucide-react";
import LanguageToggle from "./LanguageToggle";

const labels = {
  en: { apps: "Apps", resources: "Resources", about: "About" },
  es: { apps: "Apps", resources: "Recursos", about: "Acerca" }
};

export default function Navbar({ lang: initialLang = "es" }: { lang?: string }) {
  // Initialize state with the prop from the server
  const [currentLang, setCurrentLang] = useState(initialLang);
  const [isOpen, setIsOpen] = useState(false);

  // Listen for cookie changes
  useEffect(() => {
    // Sync state with the cookie immediately on mount
    const cookieLang = Cookies.get("lang") || "es";
    if (cookieLang !== currentLang) {
      setCurrentLang(cookieLang);
    }

  }, [currentLang]);

  const content = labels[currentLang as keyof typeof labels] || labels.es;

  const toggle = () => setIsOpen((v) => !v);
  const close = () => setIsOpen(false);

  const navLinks = [
    { href: "/apps", label: content.apps },
    { href: "/resources", label: content.resources },
    { href: "/about", label: content.about },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-brandGray bg-white/90 backdrop-blur-md">
      <nav className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* --- LOGO --- */}
        <Link href="/" className="flex items-center gap-2" onClick={close}>
          <img src="/logo.png" alt="OpenTEA logo" className="w-14 h-14" />
          <span className="text-xl font-bold text-brandGrayDark hover:text-brandBlue transition">OpenTEA</span>
        </Link>

        {/* --- DESKTOP MENU --- */}
        <div className="hidden lg:flex gap-6 items-center text-brandGrayDark">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-brandBlue transition"
            >
              {item.label}
            </Link>
          ))}

          <LanguageToggle />
        </div>

        {/* --- MOBILE HAMBURGER BUTTON --- */}
        <button
          className="lg:hidden p-2 text-brandGrayDark hover:text-brandBlue transition"
          onClick={toggle}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* --- MOBILE MENU LINKS --- */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        {isOpen && (
          <div className="flex flex-col gap-4 px-6 py-4 text-brandGrayDark">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-1 hover:text-brandBlue"
                onClick={close}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* --- MOBILE LANGUAGE TOGGLE --- */}
      {isOpen && (
        <div className="lg:hidden px-6 py-3 border-t border-brandGrayLight bg-white">
          <LanguageToggle />
        </div>
      )}
    </header>
  );
}
