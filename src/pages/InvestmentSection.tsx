import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Lock, Gift, Wallet } from "lucide-react";

export const InvestmentSection = () => {
  // PDF Monthly Payout Illustration: monthly = principal / 15, total = principal x 2, net profit = principal.
  const rows = [
    { principal: "500", monthly: "66.67", total: "1,000", profit: "+ 500" },
    { principal: "1,000", monthly: "133.33", total: "2,000", profit: "+ 1,000" },
    { principal: "2,500", monthly: "333.33", total: "5,000", profit: "+ 2,500" },
    { principal: "5,000", monthly: "666.67", total: "10,000", profit: "+ 5,000" },
    { principal: "10,000", monthly: "1,333.33", total: "20,000", profit: "+ 10,000" },
    { principal: "25,000", monthly: "3,333.33", total: "50,000", profit: "+ 25,000" },
    { principal: "50,000", monthly: "6,666.67", total: "100,000", profit: "+ 50,000", featured: true },
    { principal: "100,000", monthly: "13,333.33", total: "200,000", profit: "+ 100,000", featured: true },
  ];

  const formula = [
    { icon: TrendingUp, text: "Monthly Payout = Principal ÷ 15 (equal instalments over the full term)." },
    { icon: Gift, text: "Total Return = Principal × 2 — your capital is fully doubled." },
    { icon: Wallet, text: "Minimum investment 500 USDT · no maximum cap." },
    { icon: CheckCircle2, text: "Payout currency: USDT only (BEP20 or TRC20 networks)." },
    { icon: Lock, text: "Payouts every 30 days from the exact date of your first deposit." },
  ];

  return (
    <section id="investment" className="py-20 md:py-32 relative">
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
          <span className="section-label text-primary mb-4 block justify-center">
            <span className="w-5 h-[2px] bg-primary rounded-full" /> The 15-Month Doubling Plan
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5">
            Your Capital. Doubled. In 15 Months.
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            Every dollar you invest doubles by the end of your term. Monthly payouts are distributed directly to your
            wallet — equal instalments of Principal ÷ 15, paid every 30 days. All amounts in USDT (BEP20 / TRC20).
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Payout table */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-7"
          >
            <div className="glass-card border border-white/[0.08] overflow-hidden">
              <div className="grid grid-cols-4 gap-2 px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.03]">
                {["Investment", "Monthly Payout", "Total (15 mo)", "Net Profit"].map((h) => (
                  <p key={h} className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em]">{h}</p>
                ))}
              </div>
              {rows.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className={`grid grid-cols-4 gap-2 px-5 py-3.5 items-center border-b border-white/[0.04] last:border-0 ${
                    r.featured ? "bg-gradient-to-r from-primary/[0.08] to-brand-accent/[0.05]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <p className="text-sm font-semibold text-gray-200">{r.principal}</p>
                  <p className={`text-sm font-bold ${r.featured ? "text-primary" : "text-white"}`}>{r.monthly}</p>
                  <p className="text-sm font-semibold text-gray-300">{r.total}</p>
                  <p className="text-sm font-bold text-emerald-400">{r.profit}</p>
                </motion.div>
              ))}
            </div>

            {/* Summary badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { label: "Min. Entry", value: "500 USDT" },
                { label: "Total Return", value: "2×" },
                { label: "Duration", value: "15 Months" },
                { label: "Payouts", value: "Every 30d" },
              ].map((b, i) => (
                <div key={i} className="glass-card p-3.5 text-center border border-white/[0.07]">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.14em] mb-1">{b.label}</p>
                  <p className="text-base font-bold text-white font-display">{b.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Formula */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-5"
          >
            <div className="glass-card p-7 border border-brand-accent/[0.2] shadow-[0_0_40px_rgba(139,92,246,0.08)]">
              <h4 className="portal-section-header text-lg">
                <span className="w-1 h-5 bg-gradient-to-b from-brand-accent to-primary rounded-full" />
                Formula at a Glance
              </h4>
              <ul className="space-y-5">
                {formula.map((term, i) => (
                  <li key={i} className="flex items-start gap-4 group">
                    <div className="w-8 h-8 rounded-lg bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                      <term.icon size={15} className="text-brand-accent" />
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm">{term.text}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-white/[0.08]">
                <a href="#terms" className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-white transition-colors group">
                  <span>Read Full Terms & Conditions</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
