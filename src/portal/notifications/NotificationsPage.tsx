import { motion } from "framer-motion";
import {
  Bell, Info, AlertTriangle, Check, Gift, Wallet,
  ArrowDownToLine, ArrowUpFromLine, ShieldCheck, Star,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { pixelsAPI } from "@/api/allAPIs";
import { useAppSelector } from "@/app/hooks";
import { extractNotifications, timeAgo, refreshNotifications } from "@/lib/notify";
import { SkeletonListRows } from "@/components/ui/Wireframe";

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  welcome:    { icon: Star,            color: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/20" },
  deposit:    { icon: ArrowDownToLine, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  withdrawal: { icon: ArrowUpFromLine, color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20" },
  investment: { icon: Wallet,          color: "text-primary",     bg: "bg-primary/10",     border: "border-primary/20" },
  referral:   { icon: Gift,            color: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/20" },
  security:   { icon: ShieldCheck,     color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20" },
  profile:    { icon: Info,            color: "text-brand-accent",bg: "bg-brand-accent/10",border: "border-brand-accent/20" },
  warning:    { icon: AlertTriangle,   color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20" },
  info:       { icon: Info,            color: "text-primary",     bg: "bg-primary/10",     border: "border-primary/20" },
};

const NotificationsPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const userId = user?.id as number;
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!userId) return;
    pixelsAPI.getNotifications({ user_id: Number(userId) })
      .then((r) => setList(extractNotifications(r)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const isUnread = (n: any) => String(n.is_read) !== "true";
  const unread = list.filter(isUnread).length;

  const markRead = async (n: any) => {
    if (!isUnread(n)) return;
    setList((l) => l.map((x) => (x.notification_id === n.notification_id ? { ...x, is_read: "true" } : x)));
    try {
      await pixelsAPI.updateNotification({ notification_id: n.notification_id, is_read: "true" });
      refreshNotifications();
    } catch { load(); }
  };

  const markAllRead = async () => {
    setList((l) => l.map((x) => ({ ...x, is_read: "true" })));
    try {
      await pixelsAPI.markAllNotificationsRead({ user_id: Number(userId) });
      refreshNotifications();
    } catch { load(); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
    
        {unread > 0 && (
          <button onClick={markAllRead}
            className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-white transition-colors border border-primary/20 hover:border-primary/40 px-3 py-2 rounded-xl hover:bg-primary/5">
            <Check size={13} /> Mark all read
          </button>
        )}
      </div>

      {unread > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/[0.06] border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <p className="text-sm text-primary font-medium">{unread} unread notification{unread !== 1 ? "s" : ""}</p>
        </div>
      )}

      <div className="portal-card border border-white/[0.08] overflow-hidden">
        {loading ? (
          <SkeletonListRows rows={6} />
        ) : list.length > 0 ? (
          <div className="divide-y divide-white/[0.05]">
            {list.map((n, i) => {
              const cfg = typeConfig[n.type] || typeConfig.info;
              const unreadItem = isUnread(n);
              return (
                <motion.div
                  key={n.notification_id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i, 8) * 0.04 }}
                  onClick={() => markRead(n)}
                  className={`p-5 flex gap-4 cursor-pointer hover:bg-white/[0.03] transition-colors ${unreadItem ? "bg-primary/[0.03]" : ""}`}
                >
                  <div className="shrink-0 mt-0.5">
                    <div className={`w-9 h-9 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center`}>
                      <cfg.icon size={17} className={cfg.color} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`text-sm font-bold leading-snug ${unreadItem ? "text-white" : "text-gray-300"}`}>{n.title}</h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-600">{timeAgo(n.created_at)}</span>
                        {unreadItem && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{n.message}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
              <Bell size={22} className="text-gray-600" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1">All caught up</h3>
            <p className="text-sm text-gray-500">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
