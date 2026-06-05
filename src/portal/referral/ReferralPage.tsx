import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { Users, Copy, Check, Gift, Network, CircleDollarSign, GitBranch } from "lucide-react";
import { pixelsAPI } from "@/api/allAPIs";
import { useAppSelector } from "@/app/hooks";
import ReferralTree, { type TreeNode } from "./ReferralTree";
import { Skel, SkeletonStatGrid } from "@/components/ui/Wireframe";

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

const fmt = (n: any) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

const ReferralPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const userId = user?.id as number;

  const [summary, setSummary] = useState<any>(null);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [copied, setCopied] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const load = useCallback(() => {
    if (!userId) return;
    Promise.all([
      pixelsAPI.getReferralSummary({ user_id: userId })
        .then((r) => { if (r?.status === 1) setSummary(r.data); })
        .catch(() => {}),
      pixelsAPI.getReferralTree({ user_id: userId })
        .then((r) => { if (r?.status === 1) setTree(r.data); })
        .catch(() => {}),
    ]).finally(() => setPageLoading(false));
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const referralLink = summary?.referral_code
    ? `${window.location.origin}/signup?ref=${summary.referral_code}`
    : "";

  const copy = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  const stats = [
    { label: "Direct Referrals", value: summary?.direct_count ?? 0, icon: Users, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Total Team", value: summary?.team_count ?? 0, icon: Network, color: "text-brand-accent", bg: "bg-brand-accent/10", border: "border-brand-accent/20" },
    { label: "Joining Bonus", value: `${fmt(summary?.join_bonus)} USDT`, icon: Gift, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Total Earnings", value: `${fmt(summary?.total_earnings)} USDT`, icon: CircleDollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={fadeUp}>
        <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <Users size={22} className="text-primary" /> Referral Programme
        </h1>
        <p className="text-sm text-gray-400">Earn a flat $20 joining bonus plus 1% monthly income share for every active referral.</p>
      </motion.div>

      {/* Referral link */}
      <motion.div variants={fadeUp} className="portal-card border border-primary/20 p-5">
        <label className="portal-label">Your Referral Link</label>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input readOnly value={referralLink} className="portal-input flex-1 font-mono text-sm" placeholder="Generating your link..." />
          <button onClick={copy} disabled={!referralLink} className="btn-gradient flex items-center justify-center gap-2 px-5 py-2.5 text-sm">
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy"}
          </button>
        </div>
        {summary?.referral_code && (
          <p className="text-xs text-gray-500 mt-2">Referral code: <span className="text-primary font-semibold">{summary.referral_code}</span></p>
        )}
      </motion.div>

      {/* Stats */}
      {pageLoading ? (
        <SkeletonStatGrid count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className={`portal-card p-5 border ${s.border}`}>
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                <s.icon size={19} className={s.color} />
              </div>
              <p className="text-2xl font-bold text-white font-display mb-0.5">{s.value}</p>
              <p className="text-sm font-medium text-gray-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tree */}
      <motion.div variants={fadeUp} className="portal-card border border-white/[0.08] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <GitBranch size={16} className="text-brand-accent" /> Your Network Tree
          </h3>
        </div>
        <div className="p-5">
          {pageLoading ? (
            <div className="space-y-2.5">
              <Skel className="h-12 w-full rounded-xl" />
              <Skel className="h-10 w-[92%] ml-auto rounded-xl" />
              <Skel className="h-10 w-[92%] ml-auto rounded-xl" />
            </div>
          ) : tree && (tree.children?.length ?? 0) > 0 ? (
            <ReferralTree node={tree} isRoot />
          ) : (
            <div className="text-center py-8">
              <Users size={32} className="mx-auto text-gray-600 mb-3" />
              <p className="text-sm text-gray-400">No referrals yet.</p>
              <p className="text-xs text-gray-600 mt-1">Share your referral link to start building your network.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReferralPage;
