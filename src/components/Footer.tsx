import { Zap, Globe, MessageCircle, Send } from "lucide-react";
import { APP_CONFIG } from "@/config/app.config";
import { Link } from "react-router-dom";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07]">
      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-primary/[0.07] blur-[100px] pointer-events-none" />

      <div className="section-container relative z-10 pt-16 md:pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-brand-accent opacity-90" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-brand-accent blur-md opacity-40" />
                <Zap className="relative text-white fill-white z-10" size={18} />
              </div>
              <span className="text-2xl font-display font-bold tracking-tight text-white">
                {APP_CONFIG.name}
              </span>
            </Link>

            <p className="text-gray-400 leading-relaxed text-sm max-w-xs">
              {APP_CONFIG.description}
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: Globe, href: "#", label: "Website" },
                { icon: Globe, href: "#", label: "Twitter" },
                { icon: Send, href: "#", label: "Telegram" },
                { icon: MessageCircle, href: "#", label: "Discord" },
                { icon: Globe, href: "#", label: "Github" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl glass-card border border-white/[0.08] flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Platform</h5>
            <ul className="space-y-3.5">
              {[
                { label: "About PIXEL", href: "#about" },
                { label: "Investment Plan", href: "#investment" },
                { label: "Referral Income", href: "#referral" },
                { label: "Networker Income", href: "#network" },
                { label: "Dashboard", href: "/dashboard" },
              ].map((l, i) => (
                <li key={i}>
                  <a
                    href={l.href}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-200 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">Resources</h5>
            <ul className="space-y-3.5">
              {[
                { label: "Terms & Conditions", href: "#terms" },
                { label: "Withdrawal Policy", href: "#withdrawal" },
                { label: "Whitepaper", href: "#" },
                { label: "Security", href: "#" },
                { label: "KYC Policy", href: "#" },
              ].map((l, i) => (
                <li key={i}>
                  <a
                    href={l.href}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-200 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-accent/40 group-hover:bg-brand-accent transition-colors" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 text-center sm:text-left">
            © {year} {APP_CONFIG.name} — The Digital Revolution. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-600">pixelonronin.io</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
