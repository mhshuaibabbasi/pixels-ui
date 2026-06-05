import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const CTASection = () => {
  const features = [
    { icon: TrendingUp, label: "2× Capital in 15 Months" },
    { icon: Users, label: "$20 + 1% Referral Rewards" },
    { icon: Gamepad2, label: "Backed by Gaming Economy" },
  ];

  return (
    <section className="py-24 md:py-36 relative overflow-hidden">
      {/* Deep glow bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.05] to-brand-accent/[0.06] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full opacity-15 blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(0,212,255,0.8) 0%, rgba(139,92,246,0.5) 50%, transparent 70%)" }} />

      {/* Horizontal glow lines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent" />

      <div className="section-container relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="section-label text-primary mb-6 block justify-center">
            <span className="w-5 h-[2px] bg-primary rounded-full" /> Join the Revolution
          </span>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-5 leading-tight">
            <span className="text-white">JOIN THE </span>
            <span className="gradient-text">DIGITAL</span>
            <br />
            <span className="gradient-text">REVOLUTION</span>
          </h2>

          <p className="text-lg text-brand-accent font-semibold mb-6 tracking-wide">
            Powered by PIXEL · Built on Ronin
          </p>

          <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-3 max-w-2xl mx-auto">
            <span className="text-white font-bold">Be more than an investor. Be a builder. Be a Game Holder.</span>
          </p>
          <p className="text-base text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            The global gaming industry is a $200 billion+ opportunity growing every year. For the first time, PIXEL gives everyday investors a direct stake in that growth — start with as little as 500 USDT and watch it become 1,000 USDT in 15 months, then build a network that earns while you sleep.
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="flex items-center gap-2.5 glass-card px-4 py-2.5 border border-white/[0.1] text-sm font-medium text-gray-300"
              >
                <f.icon size={15} className="text-primary" />
                {f.label}
              </motion.div>
            ))}
          </div>

          <Link
            to="/dashboard"
            className="btn-gradient px-10 py-4 text-base inline-flex items-center gap-2 group"
          >
            Enter Platform
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
