import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp, Users, ArrowRight, Wallet, Activity,
  Award, CircleDollarSign, PieChart, Zap, ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { pixelsAPI } from "@/api/allAPIs";
import { useAppSelector } from "@/app/hooks";
import { timeAgo } from "@/lib/notify";
import { Skel, SkeletonListRows } from "@/components/ui/Wireframe";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

const fmt = (n: any) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const txnLabel = (t: string) => String(t || "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const Dashboard = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [d, setD] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    pixelsAPI.getDashboardData({ user_id: Number(user.id) })
      .then((r) => { if (r?.status === 1) setD(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  const stats = [
    { label: "Wallet Balance", value: `${fmt(d?.balance)} USDT`, sub: `${fmt(d?.locked_balance)} locked`, icon: Wallet, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Active Investment", value: `${fmt(d?.active_principal)} USDT`, sub: `${d?.active_investments || 0} active plan${(d?.active_investments || 0) === 1 ? "" : "s"}`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Monthly Payout", value: `${fmt(d?.monthly_payout)} USDT`, sub: "Principal ÷ 15", icon: CircleDollarSign, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Network Volume", value: `${fmt(d?.network_volume)} USDT`, sub: `${d?.team_count || 0} team members`, icon: Users, color: "text-brand-accent", bg: "bg-brand-accent/10", border: "border-brand-accent/20" },
  ];

  const portfolio = [
    { label: "Total Deposited", val: `${fmt(d?.total_deposited)} USDT`, color: "#00d4ff" },
    { label: "Total Invested", val: `${fmt(d?.total_invested)} USDT`, color: "#8b5cf6" },
    { label: "Total Earned", val: `${fmt(d?.total_earned)} USDT`, color: "#34d399" },
    { label: "Total Withdrawn", val: `${fmt(d?.total_withdrawn)} USDT`, color: "#fb923c" },
  ];

  const recent: any[] = d?.recent_transactions || [];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">

      {/* Welcome banner */}
      <motion.div variants={fadeUp} className="relative rounded-2xl overflow-hidden border border-white/[0.08]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#0f172a]" />
        <div className="absolute top-0 right-0 w-72 h-full bg-gradient-to-l from-primary/[0.07] to-transparent" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-brand-accent" />
              <Zap className="relative text-white fill-white z-10" size={22} />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-white">
                Welcome back, {user?.name?.split(" ")[0] || "Networker"} 👋
              </h2>
              <p className="text-sm text-gray-400">Here's your investment overview.</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="tag-success">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {(d?.active_investments || 0) > 0 ? "Active Plan" : "No Active Plan"}
            </span>
            <Link to="/dashboard/wallet" className="tag-info flex items-center gap-1">
              15-Month Plan <ChevronRight size={11} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}
            className={`portal-card p-5 border ${stat.border} group hover:-translate-y-1 transition-all duration-300`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={19} className={stat.color} />
              </div>
            </div>
            {loading ? (
              <>
                <Skel className="h-7 w-24 mb-2" />
                <Skel className="h-3.5 w-20 mb-1.5" />
                <Skel className="h-3 w-14" />
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-white font-display mb-0.5">{stat.value}</p>
                <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                <p className="text-xs text-gray-600 mt-0.5">{stat.sub}</p>
              </>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Activity */}
        <motion.div variants={fadeUp} className="lg:col-span-2 portal-card border border-white/[0.08] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              Recent Transactions
            </h3>
            <Link to="/dashboard/wallet" className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-white transition-colors">
              View All <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <SkeletonListRows rows={5} />
          ) : recent.length === 0 ? (
            <div className="py-14 text-center text-sm text-gray-500">
              No transactions yet. Make a deposit to get started.
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {recent.map((item) => {
                const pos = !["WITHDRAWAL", "WITHDRAWAL_CHARGE", "INVESTMENT"].includes(item.type);
                return (
                  <div key={item.txn_id} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${pos ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-white/[0.05] border border-white/10"}`}>
                        <CircleDollarSign size={17} className={pos ? "text-emerald-400" : "text-gray-500"} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{txnLabel(item.type)}</p>
                        <p className="text-xs text-gray-500">{timeAgo(item.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${pos ? "text-emerald-400" : "text-gray-400"}`}>{pos ? "+" : "-"}{fmt(item.amount)} USDT</p>
                      <p className={`text-xs font-medium ${item.status === "COMPLETED" ? "text-gray-500" : item.status === "PENDING" ? "text-amber-500" : "text-red-400"}`}>{item.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Portfolio breakdown */}
        <motion.div variants={fadeUp} className="portal-card border border-white/[0.08] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.07]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart size={16} className="text-brand-accent" />
              Portfolio Summary
            </h3>
          </div>

          <div className="p-5">
            <div className="flex justify-center mb-6">
              {loading ? (
                <Skel className="w-32 h-32 rounded-full" />
              ) : (
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                    <circle cx="60" cy="60" r="48" fill="none" stroke="url(#pg)" strokeWidth="12"
                      strokeDasharray="301" strokeDashoffset={d ? `${301 - 301 * Math.min(1, (Number(d.total_invested) || 0) / Math.max(1, Number(d.total_deposited) || 1))}` : "301"}
                      strokeLinecap="round" />
                    <defs>
                      <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00d4ff" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xs text-gray-500 font-medium">Balance</p>
                    <p className="text-lg font-bold text-white font-display">{fmt(d?.balance)}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {portfolio.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                    {item.label}
                  </span>
                  {loading ? <Skel className="h-3.5 w-20" /> : <span className="font-bold text-white text-xs">{item.val}</span>}
                </div>
              ))}
            </div>

            <div className="mt-5 pt-5 border-t border-white/[0.07] grid grid-cols-2 gap-3">
              <Link to="/dashboard/wallet" className="btn-gradient py-2.5 text-sm justify-center flex">Deposit</Link>
              <Link to="/dashboard/referral" className="btn-outline py-2.5 text-sm justify-center flex items-center gap-1.5">
                <Award size={14} /> Refer
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Dashboard;
