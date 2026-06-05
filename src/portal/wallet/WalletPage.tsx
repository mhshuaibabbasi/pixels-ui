import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Wallet, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Lock,
  CircleDollarSign, X, Loader2, Landmark, Copy, Check, UploadCloud,
} from "lucide-react";
import { pixelsAPI } from "@/api/allAPIs";
import { useAppSelector } from "@/app/hooks";
import { APP_CONFIG } from "@/config/app.config";
import { refreshNotifications } from "@/lib/notify";
import { Dropdown } from "@/components/ui/Dropdown";
import { SkeletonStatGrid, SkeletonTable } from "@/components/ui/Wireframe";

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } } };

const MIN_INVESTMENT = 500;
const MIN_WITHDRAWAL = 50;
const WITHDRAWAL_CHARGE_RATE = 0.05;

type ModalType = "deposit" | "invest" | "withdraw" | null;

const fmt = (n: any) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const WalletPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const userId = user?.id as number;

  const [summary, setSummary] = useState<any>(null);
  const [txns, setTxns] = useState<any[]>([]);
  const [modal, setModal] = useState<ModalType>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const load = useCallback(() => {
    if (!userId) return;
    Promise.all([
      pixelsAPI.getWalletSummary({ user_id: userId })
        .then((r) => { if (r?.status === 1) setSummary(r.data); })
        .catch(() => {}),
      pixelsAPI.getWalletTransactions({ user_id: userId })
        .then((r) => { if (r?.status === 1) setTxns(Array.isArray(r.data) ? r.data : []); })
        .catch(() => {}),
    ]).finally(() => setPageLoading(false));
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const onSuccess = () => { setModal(null); load(); refreshNotifications(); };

  const balance = Number(summary?.balance || 0);

  const cards = [
    { label: "Available Balance", value: `${fmt(summary?.balance)} USDT`, icon: Wallet, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Locked (Pending)", value: `${fmt(summary?.locked_balance)} USDT`, icon: Lock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "Total Invested", value: `${fmt(summary?.total_invested)} USDT`, icon: TrendingUp, color: "text-brand-accent", bg: "bg-brand-accent/10", border: "border-brand-accent/20" },
    { label: "Total Earned", value: `${fmt(summary?.total_earned)} USDT`, icon: CircleDollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
      <motion.div variants={fadeUp} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Wallet size={22} className="text-primary" /> My Wallet
          </h1>
          <p className="text-sm text-gray-400">Manage your USDT balance, investments and withdrawals.</p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button onClick={() => setModal("deposit")} className="btn-outline flex items-center gap-2 px-4 py-2.5 text-sm">
            <ArrowDownToLine size={16} /> Deposit
          </button>
          <button onClick={() => setModal("invest")} className="btn-outline flex items-center gap-2 px-4 py-2.5 text-sm">
            <TrendingUp size={16} /> Invest
          </button>
          <button onClick={() => setModal("withdraw")} className="btn-gradient flex items-center gap-2 px-4 py-2.5 text-sm">
            <ArrowUpFromLine size={16} /> Withdraw
          </button>
        </div>
      </motion.div>

      {/* Balance cards */}
      {pageLoading ? (
        <SkeletonStatGrid count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <motion.div key={c.label} variants={fadeUp} className={`portal-card p-5 border ${c.border}`}>
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-4`}>
                <c.icon size={19} className={c.color} />
              </div>
              <p className="text-2xl font-bold text-white font-display mb-0.5">{c.value}</p>
              <p className="text-sm font-medium text-gray-400">{c.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Transactions */}
      <motion.div variants={fadeUp} className="portal-card border border-white/[0.08] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Landmark size={16} className="text-primary" /> Transaction History
          </h3>
        </div>
        {pageLoading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : txns.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No transactions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="dark-table w-full">
              <thead>
                <tr>
                  <th className="text-left">Type</th>
                  <th className="text-right">Amount (USDT)</th>
                  <th className="text-right">Balance After</th>
                  <th className="text-left">Status</th>
                  <th className="text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {txns.map((t) => (
                  <tr key={t.txn_id}>
                    <td className="text-white">{String(t.type).replace(/_/g, " ")}</td>
                    <td className="text-right font-semibold text-white">{fmt(t.amount)}</td>
                    <td className="text-right text-gray-400">{fmt(t.balance_after)}</td>
                    <td>
                      <span className={t.status === "COMPLETED" ? "tag-success" : t.status === "PENDING" ? "tag-warning" : "tag-info"}>
                        {t.status}
                      </span>
                    </td>
                    <td className="text-gray-500">{t.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {modal && (
        <WalletModal
          type={modal}
          userId={userId}
          balance={balance}
          loading={loading}
          setLoading={setLoading}
          onClose={() => setModal(null)}
          onSuccess={onSuccess}
        />
      )}
    </motion.div>
  );
};

interface ModalProps {
  type: Exclude<ModalType, null>;
  userId: number;
  balance: number;
  loading: boolean;
  setLoading: (v: boolean) => void;
  onClose: () => void;
  onSuccess: () => void;
}

const WalletModal = ({ type, userId, balance, loading, setLoading, onClose, onSuccess }: ModalProps) => {
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState<"BEP20" | "TRC20">("BEP20");
  const [walletAddress, setWalletAddress] = useState("");
  const [screenshot, setScreenshot] = useState("");
  const [copied, setCopied] = useState(false);

  const amt = parseFloat(amount) || 0;
  const charge = type === "withdraw" ? +(amt * WITHDRAWAL_CHARGE_RATE).toFixed(2) : 0;
  const net = type === "withdraw" ? +(amt - charge).toFixed(2) : 0;
  const depositAddress = APP_CONFIG.DEPOSIT_ADDRESSES[network];

  const titles = { deposit: "Deposit USDT", invest: "Invest in 15-Month Plan", withdraw: "Request Withdrawal" };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      toast.success("Address copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy address.");
    }
  };

  const onScreenshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file."); return; }
    if (file.size > 8 * 1024 * 1024) { toast.error("Image must be under 8 MB."); return; }
    try {
      setScreenshot(await fileToDataUrl(file));
    } catch {
      toast.error("Could not read the file.");
    }
  };

  const validate = (): string | null => {
    if (!amt || amt <= 0) return "Enter a valid amount.";
    if (type === "deposit") {
      if (!screenshot) return "Please attach a screenshot of your payment.";
    }
    if (type === "invest") {
      if (amt < MIN_INVESTMENT) return `Minimum investment is ${MIN_INVESTMENT} USDT.`;
      if (amt > balance) return "Insufficient wallet balance. Please deposit first.";
    }
    if (type === "withdraw") {
      if (amt < MIN_WITHDRAWAL) return `Minimum withdrawal is ${MIN_WITHDRAWAL} USDT.`;
      if (amt > balance) return "Amount exceeds available balance.";
      if (!walletAddress.trim()) return "Wallet address is required.";
    }
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }
    setLoading(true);
    try {
      let res: any;
      if (type === "deposit") res = await pixelsAPI.requestDeposit({ user_id: userId, amount: amt, network, tx_hash: "", screenshot });
      else if (type === "invest") res = await pixelsAPI.invest({ user_id: userId, amount: amt });
      else res = await pixelsAPI.requestWithdrawal({ user_id: userId, amount: amt, wallet_address: walletAddress, network });

      if (res?.status === 1) { toast.success(res.info || "Request submitted."); onSuccess(); }
      else toast.error(res?.info || "Request failed.");
    } catch (e: any) {
      toast.error(e?.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  const minHint = type === "invest" ? `Min ${MIN_INVESTMENT} USDT` : type === "withdraw" ? `Min ${MIN_WITHDRAWAL} USDT` : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md max-h-[94vh] bg-[#0f1524] border border-primary/30 rounded-2xl shadow-neon overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 shrink-0">
          <div>
            <h3 className="font-display font-bold text-white leading-tight">{titles[type]}</h3>
            <p className="text-[11px] text-gray-500">Balance: <span className="text-gray-300 font-medium">{fmt(balance)} USDT</span></p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-4 space-y-3">
          {/* Amount (+ network inline for deposit/withdraw) */}
          {type === "invest" ? (
            <div>
              <label className="portal-label">Amount (USDT)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="portal-input w-full" placeholder="0.00" min={0} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="portal-label">Amount (USDT)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="portal-input w-full" placeholder="0.00" min={0} />
              </div>
              <div>
                <label className="portal-label">Network</label>
                <Dropdown
                  value={network}
                  onChange={(v) => setNetwork(v as "BEP20" | "TRC20")}
                  options={[
                    { value: "BEP20", label: "BEP20 (BSC)" },
                    { value: "TRC20", label: "TRC20 (TRON)" },
                  ]}
                />
              </div>
            </div>
          )}
          {minHint && <p className="text-[11px] text-gray-500 -mt-1.5">{minHint}{type === "withdraw" ? " · 5% charge applies" : type === "invest" ? " · doubles in 15 months" : ""}</p>}

          {type === "invest" && amt >= MIN_INVESTMENT && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs space-y-1">
              <div className="flex justify-between text-gray-400"><span>Monthly payout</span><span className="text-white">{fmt(amt / 15)} USDT</span></div>
              <div className="flex justify-between text-gray-400"><span>Total return (15 mo)</span><span className="text-emerald-400 font-semibold">{fmt(amt * 2)} USDT</span></div>
            </div>
          )}

          {type === "withdraw" && amt > 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs space-y-1">
              <div className="flex justify-between text-gray-400"><span>5% charge</span><span className="text-amber-400">- {fmt(charge)} USDT</span></div>
              <div className="flex justify-between text-gray-400"><span>You receive</span><span className="text-white font-semibold">{fmt(net)} USDT</span></div>
            </div>
          )}

          {type === "deposit" && (
            <>
              {/* Pay to platform address */}
              <div className="rounded-xl border border-primary/20 bg-primary/[0.05] p-3">
                <p className="text-[11px] font-semibold text-white mb-1.5">
                  Send {amt > 0 ? <span className="text-primary">{fmt(amt)} </span> : ""}USDT ({network}) to:
                </p>
                <div className="flex items-center gap-2 rounded-lg bg-black/30 border border-white/10 px-2.5 py-1.5">
                  <code className="text-[11px] text-gray-300 break-all flex-1 font-mono leading-tight">{depositAddress}</code>
                  <button onClick={copyAddress} type="button" className="shrink-0 text-gray-400 hover:text-primary transition-colors">
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <p className="text-[10px] text-amber-400/90 mt-1.5">Send only USDT on {network}. Wrong-network transfers can't be recovered.</p>
              </div>

              {/* Upload proof */}
              {screenshot ? (
                <div className="relative rounded-xl border border-white/10 overflow-hidden">
                  <img src={screenshot} alt="Payment proof" className="w-full max-h-28 object-contain bg-black/40" />
                  <button type="button" onClick={() => setScreenshot("")}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/70 border border-white/10 flex items-center justify-center text-gray-300 hover:text-red-400">
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] py-3.5 cursor-pointer hover:border-primary/40 hover:bg-white/[0.04] transition-colors">
                  <UploadCloud size={18} className="text-gray-500" />
                  <span className="text-xs text-gray-400">Attach payment screenshot</span>
                  <span className="text-[10px] text-gray-600">· max 8MB</span>
                  <input type="file" accept="image/*" onChange={onScreenshotChange} className="hidden" />
                </label>
              )}
            </>
          )}

          {type === "withdraw" && (
            <div>
              <label className="portal-label">Your USDT Wallet Address</label>
              <input value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} className="portal-input w-full font-mono text-sm" placeholder="Wallet address" />
            </div>
          )}

          <button onClick={submit} disabled={loading} className="btn-gradient w-full py-2.5 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : titles[type]}
          </button>
          {type === "deposit" && <p className="text-[10px] text-gray-600 text-center -mt-1">Credited after admin verifies your payment.</p>}
        </div>
      </motion.div>
    </div>
  );
};

export default WalletPage;
