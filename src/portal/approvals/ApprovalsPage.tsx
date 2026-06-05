import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { ShieldCheck, Check, X, ArrowDownToLine, ArrowUpFromLine, Loader2, Ban } from "lucide-react";
import { pixelsAPI } from "@/api/allAPIs";
import { useAppSelector } from "@/app/hooks";
import { refreshNotifications } from "@/lib/notify";
import { SkeletonTable } from "@/components/ui/Wireframe";

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };
const fmt = (n: any) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ApprovalsPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const adminId = user?.id as number;
  const isAdmin = (user?.role || "").toUpperCase() === "ADMIN";

  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const load = useCallback(() => {
    Promise.all([
      pixelsAPI.getPendingDeposits().then((r) => { if (r?.status === 1) setDeposits(Array.isArray(r.data) ? r.data : []); }).catch(() => {}),
      pixelsAPI.getPendingWithdrawals().then((r) => { if (r?.status === 1) setWithdrawals(Array.isArray(r.data) ? r.data : []); }).catch(() => {}),
    ]).finally(() => setPageLoading(false));
  }, []);

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  const act = async (key: string, fn: () => Promise<any>) => {
    setBusy(key);
    try {
      const res = await fn();
      if (res?.status === 1) { toast.success(res.info || "Done."); load(); refreshNotifications(); }
      else toast.error(res?.info || "Action failed.");
    } catch (e: any) {
      toast.error(e?.message || "Action failed.");
    } finally {
      setBusy(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="portal-card border border-white/[0.08] p-10 text-center">
        <Ban size={32} className="mx-auto text-gray-600 mb-3" />
        <p className="text-sm text-gray-400">This area is restricted to administrators.</p>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={fadeUp}>
        <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <ShieldCheck size={22} className="text-primary" /> Pending Approvals
        </h1>
        <p className="text-sm text-gray-400">Review and process deposit and withdrawal requests.</p>
      </motion.div>

      {/* Deposits */}
      <motion.div variants={fadeUp} className="portal-card border border-white/[0.08] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
          <ArrowDownToLine size={16} className="text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Deposit Requests</h3>
          <span className="tag-info ml-auto">{deposits.length}</span>
        </div>
        {pageLoading ? (
          <SkeletonTable rows={3} cols={6} />
        ) : deposits.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">No pending deposits.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="dark-table w-full">
              <thead><tr><th className="text-left">User</th><th className="text-right">Amount</th><th>Network</th><th>Proof</th><th className="text-left">Tx Hash</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {deposits.map((d) => (
                  <tr key={d.deposit_id}>
                    <td className="text-white">{d.full_name || d.email}<div className="text-xs text-gray-500">{d.email}</div></td>
                    <td className="text-right font-semibold text-white">{fmt(d.amount)} USDT</td>
                    <td className="text-center text-gray-400">{d.network}</td>
                    <td className="text-center">
                      {d.screenshot ? (
                        <button type="button" onClick={() => setPreview(d.screenshot)} className="inline-block">
                          <img src={d.screenshot} alt="proof" className="w-12 h-12 object-cover rounded-lg border border-white/10 hover:border-primary/40 transition-colors" />
                        </button>
                      ) : <span className="text-gray-600 text-xs">—</span>}
                    </td>
                    <td className="text-gray-500 font-mono text-xs max-w-[140px] truncate">{d.tx_hash || "—"}</td>
                    <td className="text-right whitespace-nowrap">
                      <button onClick={() => act(`da-${d.deposit_id}`, () => pixelsAPI.approveDeposit({ deposit_id: d.deposit_id, admin_id: adminId }))}
                        disabled={!!busy} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 mr-2">
                        {busy === `da-${d.deposit_id}` ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Approve
                      </button>
                      <button onClick={() => act(`dr-${d.deposit_id}`, () => pixelsAPI.rejectDeposit({ deposit_id: d.deposit_id, admin_id: adminId }))}
                        disabled={!!busy} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20">
                        <X size={13} /> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Withdrawals */}
      <motion.div variants={fadeUp} className="portal-card border border-white/[0.08] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2">
          <ArrowUpFromLine size={16} className="text-amber-400" />
          <h3 className="text-sm font-bold text-white">Withdrawal Requests</h3>
          <span className="tag-info ml-auto">{withdrawals.length}</span>
        </div>
        {pageLoading ? (
          <SkeletonTable rows={3} cols={6} />
        ) : withdrawals.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">No pending withdrawals.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="dark-table w-full">
              <thead><tr><th className="text-left">User</th><th className="text-right">Amount</th><th className="text-right">Charge</th><th className="text-right">Net</th><th className="text-left">Address</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.withdrawal_id}>
                    <td className="text-white">{w.full_name || w.email}<div className="text-xs text-gray-500">{w.email}</div></td>
                    <td className="text-right font-semibold text-white">{fmt(w.amount)}</td>
                    <td className="text-right text-amber-400">{fmt(w.charge)}</td>
                    <td className="text-right text-emerald-400 font-semibold">{fmt(w.net_amount)}</td>
                    <td className="text-gray-500 font-mono text-xs max-w-[160px] truncate">{w.wallet_address} <span className="text-gray-600">({w.network})</span></td>
                    <td className="text-right whitespace-nowrap">
                      <button onClick={() => act(`wa-${w.withdrawal_id}`, () => pixelsAPI.approveWithdrawal({ withdrawal_id: w.withdrawal_id, admin_id: adminId }))}
                        disabled={!!busy} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 mr-2">
                        {busy === `wa-${w.withdrawal_id}` ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Approve
                      </button>
                      <button onClick={() => act(`wr-${w.withdrawal_id}`, () => pixelsAPI.rejectWithdrawal({ withdrawal_id: w.withdrawal_id, admin_id: adminId }))}
                        disabled={!!busy} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20">
                        <X size={13} /> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Screenshot lightbox */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={() => setPreview(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <button className="absolute top-5 right-5 z-10 text-gray-300 hover:text-white" onClick={() => setPreview(null)}>
            <X size={26} />
          </button>
          <img src={preview} alt="Payment proof" className="relative z-10 max-w-full max-h-[85vh] rounded-xl border border-white/10 shadow-2xl" />
        </div>
      )}
    </motion.div>
  );
};

export default ApprovalsPage;
