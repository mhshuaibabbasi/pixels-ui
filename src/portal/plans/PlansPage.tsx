import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Layers, TrendingUp, Wallet, CircleDollarSign, CalendarClock, Lock, LockOpen,
  CheckCircle2, Clock, Plus, Coins, Target, Hourglass,
} from "lucide-react";
import { pixelsAPI } from "@/api/allAPIs";
import { useAppSelector } from "@/app/hooks";
import { Skel, SkeletonStatGrid } from "@/components/ui/Wireframe";

const fmt = (n: any) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (s?: string | null) =>
  s ? new Date(s + (s.length <= 10 ? "T00:00:00Z" : "")).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";
const addDays = (s: string, days: number) => {
  const d = new Date(s + (s.length <= 10 ? "T00:00:00Z" : ""));
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

interface Installment { m: number; date: string; amount: number; paid: boolean; isNext: boolean; }

const buildSchedule = (p: any): Installment[] => {
  const out: Installment[] = [];
  for (let m = 1; m <= p.term_months; m++) {
    out.push({
      m,
      date: addDays(p.start_date, m * 30),
      amount: p.monthly_payout,
      paid: m <= p.months_paid,
      isNext: m === p.months_paid + 1 && p.status === "ACTIVE",
    });
  }
  return out;
};

const PlansPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const userId = user?.id as number;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!userId) return;
    pixelsAPI.getPlans({ user_id: Number(userId) })
      .then((r) => { if (r?.status === 1) setData(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const plans: any[] = data?.plans || [];
  const summary = data?.summary || {};

  const summaryCards = [
    { label: "Total Invested", value: `${fmt(summary.total_invested)} USDT`, icon: Wallet, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Monthly Income", value: `${fmt(summary.total_monthly_income)} USDT`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Earned So Far", value: `${fmt(summary.total_earned)} USDT`, icon: CircleDollarSign, color: "text-brand-accent", bg: "bg-brand-accent/10", border: "border-brand-accent/20" },
    { label: "Expected Return", value: `${fmt(summary.total_expected_return)} USDT`, icon: Target, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2">
            <Layers size={22} className="text-primary" /> My Plans
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track your active investments, monthly income and progress.</p>
        </div>
        <Link to="/dashboard/wallet" className="btn-gradient px-4 py-2.5 text-sm flex items-center gap-2 shrink-0">
          <Plus size={16} /> New Investment
        </Link>
      </div>

      {/* Summary */}
      {loading ? (
        <SkeletonStatGrid count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {summaryCards.map((c) => (
            <div key={c.label} className={`portal-card p-4 sm:p-5 border ${c.border}`}>
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3 sm:mb-4`}>
                <c.icon size={18} className={c.color} />
              </div>
              <p className="text-lg sm:text-2xl font-bold text-white font-display mb-0.5 break-words">{c.value}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-400">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Plans */}
      {loading ? (
        <div className="space-y-4">
          <Skel className="h-64 w-full rounded-2xl" />
        </div>
      ) : plans.length === 0 ? (
        <div className="portal-card border border-white/[0.08] py-16 flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Layers size={26} className="text-primary" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No active plans yet</h3>
          <p className="text-sm text-gray-500 mb-5 max-w-sm">
            Start the 15-month plan with a minimum of 500 USDT and watch your capital double, with income paid every 30 days.
          </p>
          <Link to="/dashboard/wallet" className="btn-gradient px-6 py-3 text-sm flex items-center gap-2">
            <Plus size={16} /> Invest Now
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {plans.map((p, idx) => <PlanCard key={p.investment_id} plan={p} index={idx} />)}
        </div>
      )}
    </div>
  );
};

const PlanCard = ({ plan, index }: { plan: any; index: number }) => {
  const schedule = buildSchedule(plan);
  const completed = plan.status === "COMPLETED";
  const term = plan.term_months;

  const tiles = [
    { label: "Monthly Payout", value: `${fmt(plan.monthly_payout)}`, sub: "USDT / 30 days", icon: Coins, color: "text-primary" },
    { label: "Paid So Far", value: `${fmt(plan.paid_amount)}`, sub: `${plan.months_paid} of ${term} months`, icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Remaining", value: `${fmt(plan.remaining_amount)}`, sub: "USDT to receive", icon: Hourglass, color: "text-amber-400" },
    { label: "Total Return", value: `${fmt(plan.total_return)}`, sub: "2× your capital", icon: Target, color: "text-brand-accent" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="portal-card border border-white/[0.08] overflow-hidden"
    >
      {/* Banner header */}
      <div className="relative p-5 sm:p-6 bg-gradient-to-r from-primary/[0.12] via-brand-accent/[0.08] to-transparent border-b border-white/[0.07]">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Plan #{plan.investment_id}</span>
              <span className={completed ? "tag-info" : "tag-success"}>
                {completed ? "Completed" : "Active"}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-display font-bold text-white">{fmt(plan.principal)} <span className="text-base text-gray-400 font-sans">USDT</span></p>
            <p className="text-xs text-gray-500 mt-1">Principal · 15-month doubling plan</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Term</p>
            <p className="text-sm font-semibold text-white flex items-center gap-1.5 justify-end">
              <CalendarClock size={14} className="text-primary" /> {fmtDate(plan.start_date)}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">to {fmtDate(plan.end_date)}</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white">Plan Progress</span>
            <span className="text-sm font-bold text-primary">{plan.progress_pct}%</span>
          </div>
          <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${plan.progress_pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-brand-accent shadow-[0_0_12px_rgba(0,212,255,0.4)]"
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-xs text-gray-500">
            <span>{plan.months_paid} of {term} installments paid</span>
            <span>{term - plan.months_paid} remaining</span>
          </div>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-3.5">
              <t.icon size={16} className={`${t.color} mb-2`} />
              <p className="text-base sm:text-lg font-bold text-white font-display leading-tight">{t.value}</p>
              <p className="text-[11px] text-gray-500">{t.label}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">{t.sub}</p>
            </div>
          ))}
        </div>

        {/* Next payout + lock-in */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <CalendarClock size={18} className="text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Next payout</p>
              {completed ? (
                <p className="text-sm font-bold text-white">Plan completed 🎉</p>
              ) : (
                <p className="text-sm font-bold text-white">
                  {fmt(plan.monthly_payout)} USDT · {fmtDate(plan.next_payout_date)}
                  <span className="text-emerald-400 font-medium"> · in {plan.days_to_next}d</span>
                </p>
              )}
            </div>
          </div>

          <div className={`rounded-xl border p-4 flex items-center gap-3 ${plan.locked ? "bg-amber-500/[0.06] border-amber-500/15" : "bg-white/[0.03] border-white/[0.07]"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${plan.locked ? "bg-amber-500/10 border border-amber-500/20" : "bg-white/[0.05] border border-white/10"}`}>
              {plan.locked ? <Lock size={18} className="text-amber-400" /> : <LockOpen size={18} className="text-emerald-400" />}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Lock-in (6 months)</p>
              {plan.locked ? (
                <p className="text-sm font-bold text-white">Locked · {plan.days_to_unlock}d left <span className="text-gray-500 font-normal">({fmtDate(plan.lock_in_until)})</span></p>
              ) : (
                <p className="text-sm font-bold text-emerald-400">Unlocked — early exit available</p>
              )}
            </div>
          </div>
        </div>

        {/* Cumulative income chart */}
        <div>
          <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <TrendingUp size={15} className="text-primary" /> Cumulative Income
          </p>
          <div className="flex items-end gap-1 sm:gap-1.5 h-24">
            {schedule.map((it) => (
              <div key={it.m} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                <div
                  className={`w-full rounded-t-sm transition-all ${it.paid ? "bg-gradient-to-t from-primary/60 to-brand-accent" : it.isNext ? "bg-primary/30 animate-pulse" : "bg-white/[0.07]"}`}
                  style={{ height: `${(it.m / term) * 100}%` }}
                />
                {/* tooltip */}
                <div className="absolute -top-9 hidden group-hover:block bg-[#111a2e] border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white whitespace-nowrap z-10 shadow-lg">
                  M{it.m} · {fmt(it.amount * it.m)} USDT
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-primary/60 to-brand-accent" /> Paid</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary/30" /> Next</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-white/[0.07]" /> Upcoming</span>
          </div>
        </div>

        {/* Installment schedule */}
        <div>
          <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <CalendarClock size={15} className="text-primary" /> Monthly Installment Schedule
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {schedule.map((it) => (
              <div
                key={it.m}
                className={`flex items-center gap-3 rounded-xl border p-3 ${
                  it.paid ? "bg-emerald-500/[0.05] border-emerald-500/15"
                    : it.isNext ? "bg-primary/[0.06] border-primary/25"
                    : "bg-white/[0.02] border-white/[0.06]"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  it.paid ? "bg-emerald-500/15 text-emerald-400"
                    : it.isNext ? "bg-primary/15 text-primary"
                    : "bg-white/[0.05] text-gray-500"
                }`}>
                  {it.m}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{fmt(it.amount)} USDT</p>
                  <p className="text-[11px] text-gray-500">{fmtDate(it.date)}</p>
                </div>
                {it.paid ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400"><CheckCircle2 size={12} /> Paid</span>
                ) : it.isNext ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-primary"><Clock size={12} /> Next</span>
                ) : (
                  <span className="text-[10px] font-semibold text-gray-600">Pending</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlansPage;
