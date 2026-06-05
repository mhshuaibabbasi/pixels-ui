import { motion } from "framer-motion";
import { ArrowRight, Coins, Network, CalendarClock, DollarSign, Zap, TrendingUp } from "lucide-react";

export const Hero = () => {
  const stats = [
    { icon: Coins, title: "Token", value: "PIXEL", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", glow: "shadow-[0_0_20px_rgba(0,212,255,0.2)]" },
    { icon: Network, title: "Network", value: "Ronin", color: "text-brand-accent", bg: "bg-brand-accent/10", border: "border-brand-accent/20", glow: "shadow-[0_0_20px_rgba(139,92,246,0.2)]" },
    { icon: CalendarClock, title: "Plan Duration", value: "15 Months", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "shadow-[0_0_20px_rgba(59,130,246,0.2)]" },
    { icon: DollarSign, title: "Currency", value: "USDT", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]" },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">

      {/* ── Mesh grid background ── */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.8) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,212,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Background orbs ── */}
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.6) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.7) 0%, transparent 70%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-[0.07] blur-[80px]"
        style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.8) 0%, transparent 70%)" }} />

      <div className="section-container relative z-10 w-full">
        <div className="max-w-5xl mx-auto text-center">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 glass-card px-4 py-2 mb-8 border border-primary/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-bold tracking-[0.18em] text-gray-300 uppercase">Live on Ronin Network · The Digital Revolution</span>
          </motion.div>

          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-display font-bold leading-[1.05] tracking-tight mb-6">
              <span className="text-white">Next-Gen</span>{" "}
              <span className="gradient-text">Web3 Gaming</span>
              <br />
              <span className="text-white">&amp; Investment</span>{" "}
              <span className="text-white/40">Ecosystem</span>
            </h1>
          </motion.div>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-base md:text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Powered by the{" "}
            <span className="text-white font-semibold">Ronin Network</span>
            {" · "}Built for the future of{" "}
            <span className="text-primary font-semibold">Play-to-Own</span>.
            Your capital{" "}
            <span className="text-white font-semibold">doubles in 15 months</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 md:mb-20"
          >
            <a
              href="#investment"
              className="btn-gradient w-full sm:w-auto justify-center px-8 py-4 text-sm md:text-base flex items-center gap-2"
            >
              Start Investing <ArrowRight size={17} />
            </a>
            <a
              href="#about"
              className="btn-outline w-full sm:w-auto justify-center px-8 py-4 text-sm md:text-base"
            >
              Explore the Platform
            </a>
          </motion.div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.55 + i * 0.1 }}
                className={`glass-card p-5 md:p-6 border ${stat.border} ${stat.glow} group hover:-translate-y-2 hover:border-opacity-50 transition-all duration-300 cursor-default`}
              >
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-1">{stat.title}</p>
                <p className={`text-lg md:text-xl font-bold font-display ${stat.color}`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Floating bottom trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500"
          >
            {[
              { icon: TrendingUp, text: "2× your capital in 15 months" },
              { icon: Zap, text: "Built on Ronin blockchain" },
              { icon: Coins, text: "USDT payouts every 30 days" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <item.icon size={13} className="text-gray-600" />
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
