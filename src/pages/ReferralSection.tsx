import { motion } from "framer-motion";
import { Users, Repeat, Infinity, Wallet, Gift, Percent } from "lucide-react";

export const ReferralSection = () => {
  // PDF Referral Income Illustration: flat $20 joining bonus + flat 1% monthly income share on referee income.
  const rows = [
    { invest: "500", monthly: "33.33", share: "0.33", earnings: "~$24.95 + $20" },
    { invest: "1,000", monthly: "66.67", share: "0.67", earnings: "~$30.05 + $20" },
    { invest: "5,000", monthly: "333.33", share: "3.33", earnings: "~$69.95 + $20" },
    { invest: "10,000", monthly: "666.67", share: "6.67", earnings: "~$120.05 + $20" },
    { invest: "50,000", monthly: "3,333.33", share: "33.33", earnings: "~$519.95 + $20", featured: true },
  ];

  const pills = [
    { icon: Wallet, text: "Paid in USDT to your wallet" },
    { icon: Repeat, text: "1% share for the full 15-month plan" },
    { icon: Infinity, text: "No cap on referrals" },
    { icon: Users, text: "$20 bonus on first qualifying deposit" },
  ];

  return (
    <section id="referral" className="py-20 md:py-32 relative">
      <div className="section-container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <span className="section-label text-orange-400 mb-4 block justify-center">
            <span className="w-5 h-[2px] bg-orange-400 rounded-full" /> Referral Programme
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5">
            Grow Your Network. Grow Your Income.
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            No complex tiers, no confusing matrices — just two simple income streams: a flat joining bonus and an
            ongoing monthly income share for every person you bring into the PIXEL ecosystem.
          </p>
        </motion.div>

        {/* Two reward streams */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="glass-card p-7 text-center border border-orange-400/20"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
              <Gift size={22} className="text-orange-400" />
            </div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-1">Flat Joining Bonus</p>
            <p className="text-4xl font-bold font-display text-orange-400 mb-2">$20</p>
            <p className="text-sm text-gray-400">USDT per referral — paid instantly when your referee makes their first deposit.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-7 text-center border border-emerald-400/20"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Percent size={22} className="text-emerald-400" />
            </div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-1">Ongoing Income Share</p>
            <p className="text-4xl font-bold font-display text-emerald-400 mb-2">1%</p>
            <p className="text-sm text-gray-400">of your referee's total income — earned every month for the full duration of their active plan.</p>
          </motion.div>
        </div>

        {/* Illustration table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}
          className="glass-card overflow-hidden border border-white/[0.08] mb-10"
        >
          <div className="px-6 py-4 border-b border-white/[0.08] flex items-center gap-3">
            <span className="w-1 h-5 rounded-full bg-orange-400" />
            <h4 className="text-base font-bold text-white">Referral Income Illustration</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="dark-table w-full">
              <thead>
                <tr>
                  <th>Referee Invests (USDT)</th>
                  <th className="text-right">$20 Bonus</th>
                  <th className="text-right">Referee Monthly</th>
                  <th className="text-right">Your 1% Share</th>
                  <th className="text-right">Your 15-Month Earnings</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className={row.featured ? "bg-white/[0.03]" : ""}>
                    <td className="text-gray-300">{row.invest}</td>
                    <td className="text-right font-semibold text-orange-400">$20</td>
                    <td className="text-right text-gray-400">{row.monthly}</td>
                    <td className="text-right text-gray-400">{row.share}</td>
                    <td className="text-right font-bold text-emerald-400">{row.earnings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Info pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {pills.map((pill, i) => (
            <div key={i} className="flex items-center gap-2.5 glass-card px-4 py-2.5 border border-white/[0.08] text-sm text-gray-400">
              <pill.icon size={14} className="text-primary shrink-0" />
              {pill.text}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};
