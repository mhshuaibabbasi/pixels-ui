import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { clearError } from "@/reducer/authSlice";
import { toast } from "react-hot-toast";
import {
  TrendingUp, Users, Shield, Gamepad2, Coins, LogIn, UserPlus, KeyRound,
} from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import type { ViewMode } from "@/components/auth/types";

const highlights = [
  { icon: TrendingUp, title: "2× in 15 Months", desc: "Every dollar doubles — paid as monthly USDT instalments." },
  { icon: Users, title: "Referral Rewards", desc: "Flat $20 bonus + 1% monthly income share per referral." },
  { icon: Shield, title: "Secure & Transparent", desc: "Built on the Ronin Network with full KYC compliance." },
];

const stats = [
  { value: "2×", label: "Return" },
  { value: "15mo", label: "Duration" },
  { value: "USDT", label: "Payouts" },
  { value: "Ronin", label: "Network" },
];

const headings: Record<ViewMode, { icon: any; title: string; sub: string }> = {
  login: { icon: LogIn, title: "Welcome back", sub: "Sign in to access your investment dashboard." },
  signup: { icon: UserPlus, title: "Create your account", sub: "Join PIXEL and start earning monthly USDT rewards." },
  forgot: { icon: KeyRound, title: "Reset password", sub: "We'll send you reset instructions." },
};

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { isLoading, isAuthenticated, error } = useAppSelector((s) => s.auth);

  const refCode = searchParams.get("ref") || "";
  const initialMode: ViewMode =
    location.pathname === "/signup" ? "signup" : location.pathname === "/forgot" ? "forgot" : "login";
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  const [email, setEmail] = useState("");

  useEffect(() => { setViewMode(initialMode); }, [initialMode]);

  useEffect(() => {
    const stored = localStorage.getItem("rememberedEmail");
    if (stored && localStorage.getItem("isRemembered") === "true") setEmail(stored);
  }, []);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error, { style: { background: "#111827", color: "#fff", border: "1px solid #ef4444" } });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const head = headings[viewMode];

  return (
    <section className="relative h-[100dvh] overflow-hidden px-4 pt-[72px] pb-5">
      {/* Background orbs + grid */}
      <div className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full opacity-[0.13] blur-[130px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,212,255,0.8) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full opacity-[0.13] blur-[130px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.8) 0%, transparent 70%)" }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.8) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,212,255,0.8) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />

      <div className="relative z-10 h-full flex items-center">
        <div className="section-container w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-stretch max-w-6xl mx-auto">

            {/* ── Left: About The Pixels Network ── */}
            <div className="hidden lg:flex flex-col justify-center">
              <span className="text-[11px] font-bold text-primary/70 uppercase tracking-[0.22em] mb-2.5 block">The Digital Revolution</span>
              <h2 className="text-[34px] xl:text-[40px] font-display font-bold text-white leading-[1.1] mb-3.5">
                The Pixels <span className="gradient-text">Network</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
                A next-generation Web3 gaming &amp; investment ecosystem on the Ronin Network. Double your capital in
                15 months and build a network that earns while you sleep.
              </p>

              <div className="space-y-2.5 mb-6 max-w-md">
                {highlights.map((f) => (
                  <div key={f.title} className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <f.icon size={15} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">{f.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-4 max-w-md">
                {stats.map((s) => (
                  <div key={s.label} className="flex-1 text-center p-2 rounded-lg bg-white/[0.03] border border-white/[0.07]">
                    <p className="text-sm font-bold gradient-text font-display">{s.value}</p>
                    <p className="text-[10px] text-gray-600 leading-tight mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-5 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5"><Gamepad2 size={13} className="text-gray-600" /> Play-to-Own</span>
                <span className="flex items-center gap-1.5"><Coins size={13} className="text-gray-600" /> USDT payouts</span>
                <span className="flex items-center gap-1.5"><Shield size={13} className="text-gray-600" /> KYC secured</span>
              </div>
            </div>

            {/* ── Right: Form card (stretches to match the left column) ── */}
            <div className="w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
              <div className="h-full rounded-2xl bg-[#0f1524]/95 border border-white/10 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.45)] p-5 sm:p-6 flex flex-col justify-center">
                {/* Heading */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-brand-accent flex items-center justify-center shrink-0 shadow-neon">
                    <head.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-display font-bold text-white leading-tight">{head.title}</h1>
                    <p className="text-xs text-gray-500 mt-0.5">{head.sub}</p>
                  </div>
                </div>

                {viewMode === "login" && (
                  <LoginForm setViewMode={setViewMode} isLoading={isLoading} email={email} setEmail={setEmail} />
                )}
                {viewMode === "signup" && (
                  <SignupForm setViewMode={setViewMode} isLoading={isLoading} initialRefCode={refCode} />
                )}
                {viewMode === "forgot" && (
                  <ForgotPasswordForm setViewMode={setViewMode} />
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
