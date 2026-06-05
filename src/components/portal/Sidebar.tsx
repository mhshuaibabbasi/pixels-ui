import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/reducer/authSlice";
import { useHasRole } from "./RoleGuard";
import { UserAvatar } from "@/components/ui/UserAvatar";
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Shield,
  ShieldCheck,
  X,
  Bell,
  Zap,
  Wallet,
  Users,
} from "lucide-react";
import { APP_CONFIG } from "@/config/app.config";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
}

interface MenuItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles?: string[]; // If undefined, visible to all
}

const allMenuItems: MenuItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Wallet", path: "/dashboard/wallet", icon: Wallet },
  { label: "Referral", path: "/dashboard/referral", icon: Users },
  { label: "Approvals", path: "/dashboard/approvals", icon: ShieldCheck, roles: ["ADMIN"] },
  { label: "Profile", path: "/dashboard/profile", icon: User },
  { label: "Settings", path: "/dashboard/settings", icon: Settings },
  { label: "Notifications", path: "/dashboard/notifications", icon: Bell },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, collapsed }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const isManagerOrAdmin = useHasRole(["Manager", "Admin"]);

  const menuItems = allMenuItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.some(
      (role) => role.toLowerCase() === (user?.role || "").toLowerCase()
    );
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  const sidebarWidth = collapsed ? "w-[64px]" : "w-[240px]";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          bg-[#0a0e1a] border-r border-white/10
          transition-all duration-300 ease-in-out
          flex flex-col group/sidebar flex-none
          ${sidebarWidth}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:z-auto
        `}
      >
        <div className={`flex items-center border-b border-white/10 transition-all duration-300 relative overflow-hidden shrink-0 ${collapsed ? "h-16 px-2 justify-center" : "h-20 px-4 justify-between"
          }`}>
          {collapsed ? (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-brand-accent flex items-center justify-center shrink-0 shadow-neon">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
          ) : (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-brand-accent flex items-center justify-center shrink-0 shadow-neon">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-white font-display font-bold text-lg tracking-tight whitespace-nowrap"
              >
                {APP_CONFIG.name}
              </motion.span>
            </div>
          )}

          {!collapsed && (
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className={`flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-thin transition-all duration-300 ${collapsed ? "px-1" : "px-3"
          }`}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
                ${isActive
                  ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                }
                ${collapsed ? "justify-center px-1" : "px-3"}
                `
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-full"
                    />
                  )}
                  <item.icon
                    size={20}
                    className={`shrink-0 transition-colors ${isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-200"
                      }`}
                  />
                  {!collapsed && (
                    <span className="whitespace-nowrap">{item.label}</span>
                  )}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#111827] text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/10">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={`border-t border-white/10 transition-all duration-300 overflow-hidden shrink-0 ${collapsed ? "px-0 py-2" : "px-3 py-4"
          }`}>
          {!collapsed && isManagerOrAdmin && (
            <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-primary/10 border border-primary/20">
              <Shield size={14} className="text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                {user?.role}
              </span>
            </div>
          )}

          <div className={`flex items-center rounded-xl mb-2 transition-all duration-300 ${collapsed ? "justify-center px-1 py-1" : "gap-3 px-3 py-2"
            }`}>
            <UserAvatar name={user?.name} src={user?.logo} className="w-8 h-8" textClassName="text-xs" />
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{user?.name || "User"}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 ${collapsed ? "justify-center px-1 py-1" : "px-3 py-2.5"
              }`}
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
