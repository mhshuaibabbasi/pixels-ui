import { motion } from "framer-motion";
import { Users, PieChart, Joystick, Crown, Settings2 } from "lucide-react";

export const VisionSection = () => {
  const highlights = [
    {
      num: "01",
      title: "Invest in Gamers",
      desc: "Back professional and semi-professional gamers directly. When they win, you earn — a true sports-investment model reimagined for the digital age.",
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      num: "02",
      title: "Smart Share System",
      desc: "Receive an automatic proportional share of revenues every time a game in your portfolio is played — passively and continuously.",
      icon: PieChart,
      color: "text-brand-accent",
      bg: "bg-brand-accent/10",
    },
    {
      num: "03",
      title: "Franchise Token Supplies",
      desc: "Be among the first to hold tokens tied to the world's biggest gaming IP — GTA VI, Tekken, WWE, and upcoming titles.",
      icon: Joystick,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      num: "04",
      title: "Game Holder Status",
      desc: "Accumulate enough tokens and earn the prestigious Game Holder designation — unlocking exclusive benefits and priority access.",
      icon: Crown,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      num: "05",
      title: "Community Governance",
      desc: "Shape the platform's future. Vote on new franchise additions, reward structure adjustments, and platform upgrades.",
      icon: Settings2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/[0.04] via-transparent to-transparent pointer-events-none" />

      <div className="section-container relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20 max-w-3xl mx-auto"
        >
          <span className="section-label text-brand-accent mb-4 block justify-center">
            <span className="w-5 h-[2px] bg-brand-accent rounded-full" /> Our Vision
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-display font-bold text-white leading-tight mb-6">
            Redefining the{" "}
            <span className="gradient-text">Gaming‑Finance</span> Nexus
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed">
            PIXEL's vision is to become the world's leading crypto gaming investment platform — where passionate gamers, shrewd investors, and visionary networkers unite.
          </p>
        </motion.div>

        {/* Highlight cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              className={`glass-card-hover p-7 border border-white/[0.07] group ${i === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon size={22} className={item.color} />
                </div>
                <span className="text-4xl font-display font-bold text-white/[0.05] group-hover:text-white/[0.08] transition-colors select-none">
                  {item.num}
                </span>
              </div>
              <h4 className={`text-lg font-bold text-white mb-3 group-hover:${item.color} transition-colors duration-300`}>{item.title}</h4>
              <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Quote block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/[0.06] via-brand-accent/[0.04] to-primary/[0.06]" />
          <div className="absolute inset-0 rounded-3xl border border-primary/[0.15]" />
          <div className="absolute -top-px left-16 right-16 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute -bottom-px left-16 right-16 h-px bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent" />

          <div className="relative z-10 px-10 md:px-16 py-12 md:py-16 text-center">
            <div className="text-6xl font-serif text-white/[0.06] leading-none mb-4 select-none">"</div>
            <p className="text-xl md:text-2xl lg:text-3xl font-display font-semibold text-white leading-relaxed italic">
              Now is the time to do big and get big.
              <br className="hidden md:block" />
              You will be the game holder in the gaming industry.
              <br className="hidden md:block" />
              <span className="gradient-text font-bold not-italic">This is the new revolution of crypto.</span>
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
