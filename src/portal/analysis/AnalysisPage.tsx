import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Users, Wallet, TrendingUp, CircleDollarSign, ArrowDownToLine, ArrowUpFromLine,
  Network, X, Search, Ban, Gift, Layers, Mail, Phone, Calendar, Hash,
} from "lucide-react";
import { pixelsAPI } from "@/api/allAPIs";
import { useAppSelector } from "@/app/hooks";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Skel, SkeletonStatGrid, SkeletonTable, SkeletonListRows } from "@/components/ui/Wireframe";
import { timeAgo } from "@/lib/notify";
import ReferralTree, { type TreeNode } from "@/portal/referral/ReferralTree";

const fmt = (n: any) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (s?: string | null) =>
  s ? new Date(s + (String(s).length <= 10 ? "T00:00:00Z" : "")).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

type Tab = "users" | "network";

const AnalysisPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const adminId = user?.id as number;
  const isAdmin = (user?.role || "").toUpperCase() === "ADMIN";

  const [overview, setOverview] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [network, setNetwork] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("users");
  const [search, setSearch] = useState("");
  const [detailId, setDetailId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAdmin || !adminId) { setLoading(false); return; }
    Promise.all([
      pixelsAPI.getAnalysisOverview({ admin_id: adminId }).then((r) => { if (r?.status === 1) setOverview(r.data); }).catch(() => {}),
      pixelsAPI.getAnalysisUsers({ admin_id: adminId }).then((r) => { if (r?.status === 1) setUsers(Array.isArray(r.data) ? r.data : []); }).catch(() => {}),
      pixelsAPI.getAnalysisNetwork({ admin_id: adminId }).then((r) => { if (r?.status === 1) setNetwork(Array.isArray(r.data) ? r.data : []); }).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [isAdmin, adminId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      String(u.full_name || "").toLowerCase().includes(q) ||
      String(u.email || "").toLowerCase().includes(q) ||
      String(u.referral_code || "").toLowerCase().includes(q) ||
      String(u.user_id).includes(q)
    );
  }, [users, search]);

  const forest = useMemo<TreeNode[]>(() => {
    const map = new Map<number, TreeNode>();
    network.forEach((r) => map.set(r.user_id, {
      user_id: r.user_id, name: r.full_name || r.email, email: r.email,
      joined: r.created_at, invested: Number(r.invested) || 0, children: [],
    }));
    const roots: TreeNode[] = [];
    network.forEach((r) => {
      const node = map.get(r.user_id)!;
      if (r.referred_by && map.has(r.referred_by)) map.get(r.referred_by)!.children!.push(node);
      else roots.push(node);
    });
    return roots;
  }, [network]);

  if (!isAdmin) {
    return (
      <div className="portal-card border border-white/[0.08] p-10 text-center">
        <Ban size={32} className="mx-auto text-gray-600 mb-3" />
        <p className="text-sm text-gray-400">This area is restricted to administrators.</p>
      </div>
    );
  }

  const o = overview || {};
  const cards = [
    { label: "Total Users", value: o.users?.total_users ?? 0, sub: `${o.users?.active_users ?? 0} active`, icon: Users, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Total Invested", value: `${fmt(o.wallets?.total_invested)}`, sub: "USDT principal", icon: TrendingUp, color: "text-brand-accent", bg: "bg-brand-accent/10", border: "border-brand-accent/20" },
    { label: "Wallet Balance Pool", value: `${fmt(o.wallets?.total_balance)}`, sub: `${fmt(o.wallets?.total_locked)} locked`, icon: Wallet, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Total Paid Out", value: `${fmt(o.wallets?.total_earned)}`, sub: `${fmt(o.wallets?.total_withdrawn)} withdrawn`, icon: CircleDollarSign, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Active Plans", value: o.investments?.active_plans ?? 0, sub: `${fmt(o.investments?.active_principal)} USDT`, icon: Layers, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Pending Deposits", value: o.pending_deposits?.pending_count ?? 0, sub: `${fmt(o.pending_deposits?.pending_amount)} USDT`, icon: ArrowDownToLine, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Pending Withdrawals", value: o.pending_withdrawals?.pending_count ?? 0, sub: `${fmt(o.pending_withdrawals?.pending_amount)} USDT`, icon: ArrowUpFromLine, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "Referral Paid", value: `${fmt(o.referrals?.total_referral_paid)}`, sub: `${o.referrals?.referral_events ?? 0} events`, icon: Gift, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2">
          <BarChart3 size={22} className="text-primary" /> Platform Analysis
        </h1>
        <p className="text-sm text-gray-500 mt-1">Full visibility into every user, wallet, plan and the referral network.</p>
      </div>

      {/* Overview */}
      {loading ? (
        <SkeletonStatGrid count={8} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {cards.map((c) => (
            <div key={c.label} className={`portal-card p-4 sm:p-5 border ${c.border}`}>
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                <c.icon size={18} className={c.color} />
              </div>
              <p className="text-lg sm:text-2xl font-bold text-white font-display mb-0.5 break-words">{c.value}</p>
              <p className="text-xs sm:text-sm font-medium text-gray-400">{c.label}</p>
              <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] max-w-sm">
        {([["users", Users, "Users"], ["network", Network, "Network"]] as const).map(([key, Icon, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center justify-center gap-2 px-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              tab === key ? "bg-gradient-to-r from-primary/[0.18] to-brand-accent/[0.1] text-white border border-primary/20" : "text-gray-500 hover:text-gray-300 border border-transparent"
            }`}>
            <Icon size={15} className={tab === key ? "text-primary" : ""} /> {label}
          </button>
        ))}
      </div>

      {tab === "users" ? (
        <div className="portal-card border border-white/[0.08] overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-white/[0.07] flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users size={16} className="text-primary" /> All Users
              {!loading && <span className="tag-info">{filtered.length}</span>}
            </h3>
            <div className="relative flex-1 sm:flex-none sm:w-64 max-w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, code…"
                className="portal-input pl-9 w-full text-sm" />
            </div>
          </div>

          {loading ? (
            <SkeletonTable rows={6} cols={6} />
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="dark-table w-full min-w-[760px]">
                <thead>
                  <tr>
                    <th className="text-left">User</th>
                    <th>Role</th>
                    <th className="text-right">Balance</th>
                    <th className="text-right">Invested</th>
                    <th className="text-right">Earned</th>
                    <th className="text-center">Plans</th>
                    <th className="text-center">Refs</th>
                    <th className="text-left">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.user_id} onClick={() => setDetailId(u.user_id)} className="cursor-pointer hover:bg-white/[0.03]">
                      <td>
                        <div className="flex items-center gap-2.5">
                          <UserAvatar name={u.full_name} className="w-8 h-8" textClassName="text-[11px]" />
                          <div className="min-w-0">
                            <p className="text-white font-medium truncate max-w-[160px]">{u.full_name || "—"}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[160px]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className={u.role === "ADMIN" ? "tag-info" : u.role === "NETWORKER" ? "tag-success" : "tag-muted"}>{u.role}</span>
                      </td>
                      <td className="text-right text-white font-semibold">{fmt(u.balance)}</td>
                      <td className="text-right text-gray-300">{fmt(u.total_invested)}</td>
                      <td className="text-right text-emerald-400">{fmt(u.total_earned)}</td>
                      <td className="text-center text-gray-300">{u.active_plans}</td>
                      <td className="text-center text-gray-300">{u.direct_referrals}</td>
                      <td className="text-gray-500">{fmtDate(u.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="portal-card border border-white/[0.08] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.07]">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Network size={16} className="text-brand-accent" /> Referral Network
              {!loading && <span className="tag-info">{network.length} users</span>}
            </h3>
          </div>
          <div className="p-4 sm:p-5 overflow-x-auto">
            {loading ? (
              <div className="space-y-2.5"><Skel className="h-12 w-full rounded-xl" /><Skel className="h-10 w-[92%] ml-auto rounded-xl" /><Skel className="h-10 w-[85%] ml-auto rounded-xl" /></div>
            ) : forest.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-500">No users in the network yet.</div>
            ) : (
              <div className="space-y-2 min-w-[320px]">
                {forest.map((root) => <ReferralTree key={root.user_id} node={root} isRoot />)}
              </div>
            )}
          </div>
        </div>
      )}

      {detailId !== null && (
        <UserDetailModal adminId={adminId} userId={detailId} onClose={() => setDetailId(null)} />
      )}
    </div>
  );
};

const UserDetailModal = ({ adminId, userId, onClose }: { adminId: number; userId: number; onClose: () => void }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pixelsAPI.getAnalysisUser({ admin_id: adminId, user_id: userId })
      .then((r) => { if (r?.status === 1) setData(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [adminId, userId]);

  const u = data?.user;
  const w = data?.wallet;
  const walletTiles = w ? [
    { label: "Balance", value: fmt(w.balance) },
    { label: "Locked", value: fmt(w.locked_balance) },
    { label: "Invested", value: fmt(w.total_invested) },
    { label: "Earned", value: fmt(w.total_earned) },
    { label: "Deposited", value: fmt(w.total_deposited) },
    { label: "Withdrawn", value: fmt(w.total_withdrawn) },
  ] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#0f1524] border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <h3 className="font-display font-bold text-white text-sm">User Analysis</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="overflow-y-auto scrollbar-thin p-5 space-y-5">
          {loading ? (
            <>
              <Skel className="h-16 w-full rounded-xl" />
              <SkeletonListRows rows={4} />
            </>
          ) : !u ? (
            <p className="text-center text-sm text-gray-500 py-10">User not found.</p>
          ) : (
            <>
              {/* Identity */}
              <div className="flex items-center gap-4 flex-wrap">
                <UserAvatar name={u.full_name} className="w-14 h-14" textClassName="text-lg" rounded="rounded-2xl" />
                <div className="min-w-0">
                  <p className="text-lg font-bold text-white flex items-center gap-2">{u.full_name || "—"}
                    <span className={u.role === "ADMIN" ? "tag-info" : "tag-success"}>{u.role}</span>
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><Mail size={12} /> {u.email}</span>
                    <span className="flex items-center gap-1.5"><Phone size={12} /> {u.phone}</span>
                    <span className="flex items-center gap-1.5"><Hash size={12} /> {u.referral_code || "—"}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {fmtDate(u.created_at)}</span>
                  </div>
                  {u.referrer_name && <p className="text-xs text-gray-500 mt-1">Referred by <span className="text-primary">{u.referrer_name}</span></p>}
                </div>
              </div>

              {/* Wallet tiles */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Wallet size={13} /> Wallet</p>
                <div className="grid grid-cols-3 gap-2.5">
                  {walletTiles.map((t) => (
                    <div key={t.label} className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-3 text-center">
                      <p className="text-sm font-bold text-white font-display">{t.value}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{t.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investments */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Layers size={13} /> Investments ({data.investments.length})</p>
                {data.investments.length === 0 ? (
                  <p className="text-xs text-gray-600">No investments.</p>
                ) : (
                  <div className="space-y-2">
                    {data.investments.map((i: any) => (
                      <div key={i.investment_id} className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.07] p-3 text-sm">
                        <div>
                          <p className="text-white font-semibold">{fmt(i.principal)} USDT <span className={i.status === "ACTIVE" ? "tag-success ml-1" : "tag-info ml-1"}>{i.status}</span></p>
                          <p className="text-[11px] text-gray-500">{i.months_paid}/{i.term_months} months · {fmt(i.monthly_payout)}/mo · {fmtDate(i.start_date)}</p>
                        </div>
                        <p className="text-emerald-400 font-bold text-xs">→ {fmt(i.total_return)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Referral earnings + direct referrals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Gift size={13} /> Referral Earnings</p>
                  {data.referral_earnings.length === 0 ? <p className="text-xs text-gray-600">None.</p> : (
                    <div className="space-y-1.5">
                      {data.referral_earnings.slice(0, 6).map((e: any) => (
                        <div key={e.id} className="flex justify-between text-xs rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2">
                          <span className="text-gray-400 truncate">{e.type === "JOIN_BONUS" ? "Join" : "Share"} · {e.source_name || "—"}</span>
                          <span className="text-emerald-400 font-semibold">+{fmt(e.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Users size={13} /> Direct Referrals ({data.direct_referrals.length})</p>
                  {data.direct_referrals.length === 0 ? <p className="text-xs text-gray-600">None.</p> : (
                    <div className="space-y-1.5">
                      {data.direct_referrals.slice(0, 6).map((r: any) => (
                        <div key={r.user_id} className="flex justify-between text-xs rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2">
                          <span className="text-gray-300 truncate">{r.full_name || r.email}</span>
                          <span className="text-gray-500">{fmt(r.invested)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Transactions */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CircleDollarSign size={13} /> Recent Transactions ({data.transactions.length})</p>
                {data.transactions.length === 0 ? (
                  <p className="text-xs text-gray-600">No transactions.</p>
                ) : (
                  <div className="rounded-xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.05] max-h-56 overflow-y-auto scrollbar-thin">
                    {data.transactions.map((t: any) => (
                      <div key={t.txn_id} className="flex items-center justify-between px-3 py-2 text-xs">
                        <div className="min-w-0">
                          <p className="text-white font-medium">{String(t.type).replace(/_/g, " ")}</p>
                          <p className="text-[10px] text-gray-600">{timeAgo(t.created_at)}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-white font-semibold">{fmt(t.amount)}</p>
                          <span className={t.status === "COMPLETED" ? "tag-success" : t.status === "PENDING" ? "tag-warning" : "tag-info"}>{t.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisPage;
