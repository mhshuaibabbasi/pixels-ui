import { Menu, Search, Bell, PanelLeftClose, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "@/app/hooks";
import { pixelsAPI } from "@/api/allAPIs";
import { extractNotifications, timeAgo } from "@/lib/notify";
import { UserAvatar } from "@/components/ui/UserAvatar";

interface PortalHeaderProps {
  onMenuToggle: () => void;
  onCollapseToggle: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({ onMenuToggle, onCollapseToggle }) => {
  const { user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const userId = user?.id as number;

  const [list, setList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifs = useCallback(() => {
    if (!userId) return;
    pixelsAPI.getNotifications({ user_id: Number(userId) })
      .then((r) => setList(extractNotifications(r)))
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    fetchNotifs();
    const onRefresh = () => fetchNotifs();
    window.addEventListener("refreshNotifications", onRefresh);
    const interval = setInterval(fetchNotifs, 60000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("refreshNotifications", onRefresh);
    };
  }, [fetchNotifs]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unread = list.filter((n) => String(n.is_read) !== "true").length;

  const markRead = async (n: any) => {
    if (String(n.is_read) === "true") return;
    setList((l) => l.map((x) => (x.notification_id === n.notification_id ? { ...x, is_read: "true" } : x)));
    try { await pixelsAPI.updateNotification({ notification_id: n.notification_id, is_read: "true" }); } catch { fetchNotifs(); }
  };

  const markAll = async () => {
    setList((l) => l.map((x) => ({ ...x, is_read: "true" })));
    try { await pixelsAPI.markAllNotificationsRead({ user_id: Number(userId) }); } catch { fetchNotifs(); }
  };

  return (
    <header className="h-16 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-white/[0.07] flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-2 -ml-1 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all">
          <Menu size={22} />
        </button>
        <button onClick={onCollapseToggle} className="hidden lg:flex p-2 -ml-1 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all">
          <PanelLeftClose size={20} />
        </button>
        <div className="hidden md:flex items-center relative group">
          <Search size={15} className="absolute left-3.5 text-gray-600 group-focus-within:text-primary transition-colors" />
          <input type="text" placeholder="Search platform..."
            className="pl-9 pr-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-full text-sm text-white placeholder-gray-600 w-56 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 focus:w-72 transition-all duration-300" />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications bell + dropdown */}
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen((v) => !v)}
            className="relative p-2 text-gray-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all">
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-[#0a0e1a]">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl bg-[#0f1524] border border-white/10 shadow-[0_12px_48px_rgba(0,0,0,0.5)] overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                  <p className="text-sm font-bold text-white">Notifications</p>
                  {unread > 0 && (
                    <button onClick={markAll} className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-white transition-colors">
                      <Check size={12} /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[360px] overflow-y-auto scrollbar-thin">
                  {list.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                      <Bell size={24} className="text-gray-600 mb-2" />
                      <p className="text-xs text-gray-500">No notifications yet</p>
                    </div>
                  ) : (
                    list.slice(0, 12).map((n) => {
                      const unreadItem = String(n.is_read) !== "true";
                      return (
                        <button
                          key={n.notification_id}
                          onClick={() => { markRead(n); setOpen(false); navigate("/dashboard/notifications"); }}
                          className={`w-full text-left px-4 py-3 flex gap-3 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03] transition-colors ${unreadItem ? "bg-primary/[0.03]" : ""}`}
                        >
                          <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${unreadItem ? "bg-primary" : "bg-transparent"}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-xs font-bold truncate ${unreadItem ? "text-white" : "text-gray-400"}`}>{n.title}</p>
                              <span className="text-[10px] text-gray-600 shrink-0">{timeAgo(n.created_at)}</span>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-snug mt-0.5 line-clamp-2">{n.message}</p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                <button onClick={() => { setOpen(false); navigate("/dashboard/notifications"); }}
                  className="w-full py-2.5 text-center text-[11px] font-bold text-gray-400 hover:text-primary hover:bg-white/[0.03] transition-all border-t border-white/[0.07]">
                  View all notifications
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden sm:block h-5 w-px bg-white/10" />

        {/* Profile */}
        <Link to="/dashboard/profile"
          className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition-all">
          <UserAvatar name={user?.name} src={user?.logo} className="w-8 h-8 shadow-[0_0_12px_rgba(0,212,255,0.3)]" textClassName="text-xs" />
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-white leading-tight">{user?.name || "Networker"}</p>
            <p className="text-[11px] text-gray-500">{user?.role || "Investor"}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};
