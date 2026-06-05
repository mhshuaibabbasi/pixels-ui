import { motion } from "framer-motion";
import { Zap, BarChart3, ArrowUpRight } from "lucide-react";

export const NetworkerSection = () => {
  // Flat 5% monthly Networker Income on total network business volume (PDF illustration).
  const tiers = [
    { volume: "100,000", reward: "5,000", pct: 12 },
    { volume: "300,000", reward: "15,000", pct: 28 },
    { volume: "500,000", reward: "25,000", pct: 44 },
    { volume: "1,000,000", reward: "50,000", pct: 70 },
    { volume: "5,000,000", reward: "250,000", pct: 100, featured: true },
  ];

  const steps = [
    "Network business volume is the total active investment across your entire downline team.",
    "Calculated on a rolling 3-month cycle. Business volume resets after each 3-month period.",
    "Networker Income is paid monthly in addition to referral bonuses, personal returns, and income share.",
    "Building a deep, active network is the most powerful path to maximising your income on PIXEL.",
  ];

  return (
    <section id="network" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 border-y border-white/[0.05] bg-black/20 pointer-events-none" />

      <div className="section-container relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <span className="section-label text-brand-accent mb-4 block justify-center">
            <span className="w-5 h-[2px] bg-brand-accent rounded-full" /> Networker Income
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5">
            Unlock Leadership-Level Earnings
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            The Networker Income tier rewards builders who grow large, active teams. A flat 5% monthly Networker
            Income applies to all qualifying network business volumes — paid on top of your personal returns.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left: tier cards + special update */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-7 space-y-4"
          >
            {/* Visual tier bars */}
            <div className="glass-card border border-white/[0.08] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.08] flex items-center gap-3">
                <BarChart3 size={18} className="text-brand-accent" />
                <h4 className="text-base font-bold text-white">Network Volume → Monthly Income</h4>
              </div>
              <div className="p-6 space-y-4">
                {tiers.map((tier, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">
                        {tier.volume} <span className="text-gray-600 text-xs">USDT</span>
                      </span>
                      <span className={`text-base font-bold font-display ${tier.featured ? "text-brand-accent" : "text-white"}`}>
                        {tier.reward} <span className="text-xs font-normal text-gray-500">/ month</span>
                        {tier.featured && <ArrowUpRight size={14} className="inline ml-1 text-brand-accent" />}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tier.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 + 0.3, duration: 0.7, ease: "easeOut" }}
                        className={`h-full rounded-full ${tier.featured ? "bg-gradient-to-r from-brand-accent to-primary" : "bg-gradient-to-r from-brand-accent/50 to-brand-accent/80"}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Special Update Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-brand-accent/25">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/[0.08] to-primary/[0.06]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex items-start gap-4 p-6">
                <div className="w-10 h-10 rounded-xl bg-brand-accent/15 border border-brand-accent/25 flex items-center justify-center shrink-0">
                  <Zap size={18} className="text-brand-accent" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-accent uppercase tracking-[0.18em] mb-1">Special Update</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    A flat <span className="text-brand-accent font-bold">5% monthly Networker Income</span> is now applicable for all qualifying network volumes. This simplified structure ensures every active networker benefits equally from their team's growth.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: how it works */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-5"
          >
            <div className="glass-card p-7 border border-white/[0.08]">
              <h4 className="portal-section-header text-base">
                <span className="w-1 h-5 bg-gradient-to-b from-brand-accent to-primary rounded-full" />
                How Network Business is Calculated
              </h4>
              <ol className="space-y-6">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-accent/30 to-primary/30 border border-brand-accent/30 flex items-center justify-center text-xs font-bold text-primary">
                        {i + 1}
                      </div>
                      {i < steps.length - 1 && <div className="w-px flex-1 bg-white/[0.06]" />}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
