import { motion } from "framer-motion";
import { Lock, Bell, Moon, Key, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/app/hooks";
import { pixelsAPI } from "@/api/allAPIs";
import { refreshNotifications } from "@/lib/notify";

type Tab = "security" | "notifications" | "appearance";

const SettingsPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState<Tab>("security");
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const newPassword = watch("password");

  const [prefs, setPrefs] = useState({ profit: true, referral: true, platform: false });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await pixelsAPI.changePassword({ email: user?.email, ...data });
      if (response?.status === 1) {
        toast.success("Password updated successfully");
        reset();
        refreshNotifications();
      } else {
        toast.error(response?.info || "Failed to update password");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs: { key: Tab; icon: React.ElementType; label: string }[] = [
    { key: "security", icon: Lock, label: "Security" },
    { key: "notifications", icon: Bell, label: "Notifications" },
    { key: "appearance", icon: Moon, label: "Appearance" },
  ];

  return (
    <div className="space-y-5">

      {/* Tab bar — always visible, responsive */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center justify-center gap-2 px-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-primary/[0.18] to-brand-accent/[0.1] text-white border border-primary/20 shadow-[0_0_18px_rgba(0,212,255,0.08)]"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] border border-transparent"
            }`}
          >
            <tab.icon size={15} className={activeTab === tab.key ? "text-primary" : ""} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content card */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="portal-card border border-white/[0.08] p-5 sm:p-7"
      >
        {activeTab === "security" && (
          <>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-5">
              <Key size={16} className="text-primary" /> Change Password
            </h3>
            <form className="space-y-4 max-w-md" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="portal-label">Current Password</label>
                <div className="relative">
                  <input type={show ? "text" : "password"} {...register("current_password", { required: "Current password is required" })} placeholder="••••••••" className="portal-input pr-10" />
                  <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.current_password && <p className="text-red-400 text-xs mt-1.5">{errors.current_password.message as string}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="portal-label">New Password</label>
                  <input type="password" {...register("password", { required: "New password is required", minLength: { value: 6, message: "Min 6 characters" } })} placeholder="••••••••" className="portal-input" />
                  {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message as string}</p>}
                </div>
                <div>
                  <label className="portal-label">Confirm New</label>
                  <input type="password" {...register("confirm_password", { required: "Please confirm", validate: (v) => v === newPassword || "Passwords do not match" })} placeholder="••••••••" className="portal-input" />
                  {errors.confirm_password && <p className="text-red-400 text-xs mt-1.5">{errors.confirm_password.message as string}</p>}
                </div>
              </div>

              <div className="pt-1">
                <button type="submit" disabled={isLoading} className="btn-gradient px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50">
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </>
        )}

        {activeTab === "notifications" && (
          <>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-5">
              <Bell size={16} className="text-primary" /> Notification Preferences
            </h3>
            <div className="space-y-3 max-w-md">
              {([
                { key: "profit", label: "Profit distributions", desc: "Monthly payout alerts" },
                { key: "referral", label: "Referral activity", desc: "When someone joins via your link" },
                { key: "platform", label: "Platform updates", desc: "System notices & announcements" },
              ] as const).map((item) => {
                const enabled = prefs[item.key];
                return (
                  <div key={item.key} className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setPrefs((p) => ({ ...p, [item.key]: !p[item.key] }))}
                      className={`w-11 h-6 rounded-full flex items-center px-0.5 transition-colors shrink-0 ${enabled ? "bg-primary/80 justify-end" : "bg-white/10 justify-start"}`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow" />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === "appearance" && (
          <>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-5">
              <Moon size={16} className="text-primary" /> Appearance
            </h3>
            <div className="space-y-4 max-w-md">
              <div className="p-4 rounded-xl bg-primary/[0.06] border border-primary/20 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0a0e1a] border border-white/10 flex items-center justify-center shrink-0">
                  <Moon size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Dark Mode</p>
                  <p className="text-xs text-gray-500">Active — the PIXEL default experience.</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">Additional theme options coming soon.</p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default SettingsPage;
