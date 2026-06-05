import { motion } from "framer-motion";
import { ShieldCheck, Clock, KeyRound, Wallet, CheckCircle2 } from "lucide-react";

export const WithdrawalSection = () => {
  // PDF withdrawal examples: flat 5% charge on every withdrawal.
  const examples = [
    { amount: "500", charge: "25.00", net: "475.00" },
    { amount: "1,000", charge: "50.00", net: "950.00" },
    { amount: "5,000", charge: "250.00", net: "4,750.00" },
    { amount: "10,000", charge: "500.00", net: "9,500.00" },
    { amount: "50,000", charge: "2,500.00", net: "47,500.00" },
  ];

  const guidelines = [
    { icon: CheckCircle2, text: "The 5% charge is deducted automatically at withdrawal — no hidden fees at any other stage." },
    { icon: Clock, text: "Withdrawals are processed within 24–72 business hours of request submission." },
    { icon: Wallet, text: "All payouts are sent only to your verified USDT wallet (BEP20 or TRC20). Minimum 50 USDT after charge." },
    { icon: KeyRound, text: "Every request requires 2FA confirmation. PIXEL will never ask for your private keys or seed phrase." },
  ];

  return (
    <section id="withdrawal" className="py-20 md:py-32 relative">
      <div className="section-container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <span className="section-label text-emerald-400 mb-4 block justify-center">
            <span className="w-5 h-[2px] bg-emerald-400 rounded-full" /> Withdrawal Policy
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5">
            Simple, Transparent, Always in Your Control
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            All withdrawals are subject to a flat 5% processing charge covering network gas, platform maintenance, and
            liquidity management — keeping the ecosystem healthy for every participant.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Charge highlight + examples */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-7 space-y-4"
          >
            <div className="glass-card p-7 text-center border border-emerald-400/20">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.18em] mb-2">Withdrawal Processing Charge</p>
              <p className="text-6xl font-bold font-display gradient-text mb-1">5%</p>
              <p className="text-sm text-gray-400">applied to every withdrawal transaction</p>
            </div>

            <div className="glass-card overflow-hidden border border-white/[0.08]">
              <div className="px-6 py-4 border-b border-white/[0.08] flex items-center gap-3">
                <span className="w-1 h-5 rounded-full bg-emerald-400" />
                <h4 className="text-base font-bold text-white">Withdrawal Examples</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="dark-table w-full">
                  <thead>
                    <tr>
                      <th>Withdrawal (USDT)</th>
                      <th className="text-right">5% Charge</th>
                      <th className="text-right">Net Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examples.map((e, i) => (
                      <tr key={i}>
                        <td className="text-gray-300">{e.amount}</td>
                        <td className="text-right text-amber-400">{e.charge}</td>
                        <td className="text-right font-bold text-emerald-400">{e.net}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Guidelines */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="lg:col-span-5"
          >
            <div className="glass-card p-7 border border-emerald-400/[0.2] shadow-[0_0_40px_rgba(16,185,129,0.08)]">
              <h4 className="portal-section-header text-lg">
                <span className="w-1 h-5 bg-gradient-to-b from-emerald-400 to-primary rounded-full" />
                Withdrawal Guidelines
              </h4>
              <ul className="space-y-5">
                {guidelines.map((g, i) => (
                  <li key={i} className="flex items-start gap-4 group">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                      <g.icon size={15} className="text-emerald-400" />
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm">{g.text}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center gap-2 text-sm text-gray-400">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                Security first — withdraw only to wallets you personally control.
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
