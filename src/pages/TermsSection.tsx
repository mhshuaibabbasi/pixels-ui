import { motion } from "framer-motion";

export const TermsSection = () => {
  const terms = [
    { num: "01", title: "Plan Duration", desc: "The PIXEL Networker investment plan runs for a fixed term of 15 months from the exact date of your first deposit. All payouts are scheduled from this date." },
    { num: "02", title: "Minimum Investment", desc: "The minimum investment amount is 500 USDT. There is no maximum cap — investors may deposit any amount above the minimum threshold." },
    { num: "03", title: "Return Structure", desc: "Your total return over 15 months equals 200% of your principal — your capital is fully doubled. Distributed as equal monthly instalments of Principal ÷ 15 every 30 days." },
    { num: "04", title: "Accepted Currency", desc: "All investments and payouts are processed exclusively in USDT, accepted on BEP20 (Binance Smart Chain) and TRC20 (TRON) networks only." },
    { num: "05", title: "Payout Schedule", desc: "Monthly profits are distributed every 30 days from the date of your first deposit. There are no fixed calendar closing dates — your schedule is personal." },
    { num: "06", title: "Withdrawal Charge", desc: "A flat 5% processing charge is applied to every withdrawal transaction, deducted automatically at the time of withdrawal to cover network fees and liquidity." },
    { num: "07", title: "Minimum Withdrawal", desc: "The minimum withdrawal amount is 50 USDT (after the 5% charge has been deducted). Requests below this threshold will not be processed." },
    { num: "08", title: "Referral Bonus", desc: "A flat $20 USDT joining bonus is paid for every successful referral's first qualifying deposit, plus an ongoing 1% monthly income share for the full duration of their plan." },
    { num: "09", title: "Networker Income", desc: "A flat 5% monthly Networker Income applies to qualifying network business volumes, calculated on a rolling 3-month cycle that resets after each period." },
    { num: "10", title: "Lock-In Period", desc: "A lock-in period of 6 months applies from the date of investment. No principal refund is available before this period expires." },
    { num: "11", title: "Early Exit", desc: "Requests to exit before the 6-month lock-in expires result in forfeiture of the principal. Monthly profits already distributed are retained by the investor." },
    { num: "12", title: "Post Lock-In Exit", desc: "After the 6-month lock-in, you may exit at any time. The remaining principal balance (proportional to months remaining) is refunded, subject to the 5% withdrawal charge." },
    { num: "13", title: "Reinvestment", desc: "On completion of the 15-month term, investors may reinvest into a new plan, retaining their referral network, Networker rank, and account history." },
    { num: "14", title: "KYC & Compliance", desc: "All participants must complete identity verification (KYC) before investment activation. PIXEL reserves the right to suspend or terminate accounts in violation of platform terms." },
  ];

  return (
    <section id="terms" className="py-20 md:py-32 relative">
      <div className="section-container">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <span className="section-label text-gray-400 mb-4 block justify-center">
            <span className="w-5 h-[2px] bg-gray-400/40 rounded-full" /> Terms &amp; Conditions
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            15-Month Plan — Full Terms
          </h2>
          <p className="text-gray-400 text-base">Please read all terms carefully before investing.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {terms.map((term, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
              className="glass-card-hover p-6 flex gap-5 border border-white/[0.07] group"
            >
              <div className="shrink-0">
                <span className="text-4xl font-display font-bold text-white/[0.05] group-hover:text-white/[0.09] transition-colors select-none leading-none">
                  {term.num}
                </span>
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">{term.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{term.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
