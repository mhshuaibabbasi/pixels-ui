import { motion } from "framer-motion";
import { Shield, Gamepad2, Vote, Boxes, Leaf } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" as const } }),
};

export const AboutSection = () => {
  const strengths = [
    {
      title: "Ronin Network Foundation",
      desc: "Built on Axie Infinity's battle-tested, low-fee blockchain — fast transactions and minimal gas costs for every participant.",
      icon: Shield,
      gradient: "from-blue-500 to-cyan-400",
      glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]",
    },
    {
      title: "Play-to-Own Economy",
      desc: "Players genuinely own their in-game assets as NFTs, creating real-world value from virtual achievements and skill.",
      icon: Gamepad2,
      gradient: "from-brand-accent to-pink-500",
      glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]",
    },
    {
      title: "Decentralised Governance",
      desc: "PIXEL token holders vote on key development decisions, giving the community a genuine voice in the platform's direction.",
      icon: Vote,
      gradient: "from-emerald-500 to-teal-400",
      glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]",
    },
    {
      title: "Multi-Franchise Supply",
      desc: "Established token supply pipelines for iconic gaming franchises including GTA VI, Tekken, WWE, and many more.",
      icon: Boxes,
      gradient: "from-orange-500 to-amber-400",
      glow: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.25)]",
    },
    {
      title: "Sustainable Reward Model",
      desc: "A carefully structured tokenomics system ensures long-term viability, balancing player rewards with ecosystem growth.",
      icon: Leaf,
      gradient: "from-primary to-blue-400",
      glow: "group-hover:shadow-[0_0_30px_rgba(0,212,255,0.25)]",
    },
  ];

  return (
    <section id="about" className="py-20 md:py-32 relative">
      {/* Subtle section bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-accent/[0.03] to-transparent pointer-events-none" />

      <div className="section-container relative z-10">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-end mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-label text-primary mb-4 block">
              <span className="w-5 h-[2px] bg-primary rounded-full" /> About PIXEL
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-0">
              What is <span className="gradient-text">PIXEL?</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              PIXEL is the native cryptocurrency of Pixels — a farming and social simulation game built on the Ronin Network. Designed to power a thriving play-to-own economy, PIXEL rewards players for time, skill, and participation while enabling meaningful governance.
            </p>
          </motion.div>
        </div>

        {/* Strengths Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {strengths.map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`glass-card-hover p-7 group border border-white/[0.07] rounded-2xl transition-all duration-300 ${item.glow} ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} p-[1px] mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className="w-full h-full rounded-xl bg-[#0f1628] flex items-center justify-center">
                  <item.icon size={22} className="text-white opacity-90" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300">{item.title}</h4>
              <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Advantage box */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* bg layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-brand-accent/[0.08]" />
          <div className="absolute inset-0 border border-white/[0.09] rounded-3xl" />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-brand-accent/10 blur-[80px] pointer-events-none" />

          <div className="relative z-10 p-8 md:p-14 flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-5">
                The PIXEL Networker Advantage
              </h3>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
                As a PIXEL Networker, you are not merely an investor — you become a stakeholder in the future of gaming. Every time a game powered by PIXEL tokens is played, you earn. Every referral adds to your monthly rewards. Every milestone your network reaches unlocks greater returns.
              </p>
              <p className="text-gray-400 leading-relaxed">
                This is not the old world of passive savings or volatile stock markets. This is the new revolution of crypto — where gaming meets finance, and community drives prosperity.
              </p>
            </div>
            <div className="shrink-0 flex flex-col gap-4 min-w-[200px]">
              {[
                { label: "Total Return", value: "2× Capital", color: "text-primary" },
                { label: "Monthly Payout", value: "Principal ÷ 15", color: "text-brand-accent" },
                { label: "Plan Duration", value: "15 Months", color: "text-blue-400" },
              ].map((item, i) => (
                <div key={i} className="glass-card p-4 border border-white/[0.08]">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] mb-1">{item.label}</p>
                  <p className={`text-xl font-bold font-display ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
