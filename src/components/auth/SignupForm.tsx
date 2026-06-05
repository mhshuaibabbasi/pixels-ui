import { useState, useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { registerUser } from "@/reducer/authSlice";
import { pixelsAPI } from "@/api/allAPIs";
import { toast } from "react-hot-toast";
import {
  UserPlus, Mail, Lock, Eye, EyeOff, Phone, User, Gift,
  Loader2, CheckCircle2, Check, X,
} from "lucide-react";
import type { ViewMode } from "./types";
import FloatingInput from "./FloatingInput";

interface SignupFormProps {
  setViewMode: (mode: ViewMode) => void;
  isLoading: boolean;
  initialRefCode?: string;
}

type RefStatus = "idle" | "checking" | "valid" | "invalid";

const getPwdStrength = (pwd: string): number => {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};
const pwdStrengthMeta = [
  { label: "Weak", bar: "bg-red-400" },
  { label: "Fair", bar: "bg-orange-400" },
  { label: "Good", bar: "bg-sky-500" },
  { label: "Strong", bar: "bg-emerald-500" },
];

export default function SignupForm({ setViewMode, isLoading, initialRefCode = "" }: SignupFormProps) {
  const dispatch = useAppDispatch();

  const [data, setData] = useState({
    full_name: "", email: "", phone: "", password: "", confirm_password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Referral code — editable, prefilled from a referral link, validated live.
  const [refCode, setRefCode] = useState(initialRefCode);
  const [refStatus, setRefStatus] = useState<RefStatus>("idle");
  const [refName, setRefName] = useState("");

  useEffect(() => {
    const code = refCode.trim();
    if (!code) { setRefStatus("idle"); setRefName(""); return; }
    setRefStatus("checking");
    let active = true;
    const t = setTimeout(async () => {
      try {
        const res = await pixelsAPI.validateReferralCode({ ref_code: code });
        if (!active) return;
        if (res?.status === 1 && res.data?.valid) { setRefStatus("valid"); setRefName(res.data.referrer_name || ""); }
        else { setRefStatus("invalid"); setRefName(""); }
      } catch {
        if (active) { setRefStatus("invalid"); setRefName(""); }
      }
    }, 450);
    return () => { active = false; clearTimeout(t); };
  }, [refCode]);

  const pwdStrength = getPwdStrength(data.password);
  const pwdMeta = pwdStrength > 0 ? pwdStrengthMeta[pwdStrength - 1] : null;

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.full_name.trim()) { toast.error("Full name is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { toast.error("Please enter a valid email address"); return; }
    if (!/^\+?\d[\d\s-]{6,}$/.test(data.phone.trim())) { toast.error("Please enter a valid phone number"); return; }
    if (data.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (data.password !== data.confirm_password) { toast.error("Passwords do not match"); return; }
    const code = refCode.trim();
    if (code && refStatus !== "valid") { toast.error("Please enter a valid referral code or clear the field."); return; }

    dispatch(registerUser({
      full_name: data.full_name.trim(),
      email: data.email.trim(),
      phone: data.phone.replace(/\s/g, ""),
      password: data.password,
      confirm_password: data.confirm_password,
      ref_code: code,
    }));
  };

  return (
    <form onSubmit={handleSignup} className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <FloatingInput
        id="s-name" label="Full name" value={data.full_name}
        onChange={(e) => setData({ ...data, full_name: e.target.value })}
        disabled={isLoading} required icon={<User className="h-4 w-4" />}
      />

      <div className="grid sm:grid-cols-2 gap-3">
        <FloatingInput
          id="s-email" type="email" label="Email address" value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          disabled={isLoading} required icon={<Mail className="h-4 w-4" />}
        />
        <FloatingInput
          id="s-phone" type="tel" label="Phone number" value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
          disabled={isLoading} required icon={<Phone className="h-4 w-4" />}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <FloatingInput
            id="s-pwd" type={showPass ? "text" : "password"} label="Password" value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            disabled={isLoading} required icon={<Lock className="h-4 w-4" />}
            rightElement={
              <button type="button" tabIndex={-1} onClick={() => setShowPass((v) => !v)}
                className="text-gray-500 hover:text-gray-300 transition-colors">
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {data.password && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${pwdStrength >= i && pwdMeta ? pwdMeta.bar : "bg-white/10"}`} />
                ))}
              </div>
              {pwdMeta && <p className="text-[0.65rem] text-gray-500">Strength: <span className="font-semibold text-gray-300">{pwdMeta.label}</span></p>}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <FloatingInput
            id="s-confirm" type={showConfirm ? "text" : "password"} label="Confirm password" value={data.confirm_password}
            onChange={(e) => setData({ ...data, confirm_password: e.target.value })}
            disabled={isLoading} required icon={<Lock className="h-4 w-4" />}
            invalid={!!data.confirm_password && data.password !== data.confirm_password}
            rightElement={
              <button type="button" tabIndex={-1} onClick={() => setShowConfirm((v) => !v)}
                className="text-gray-500 hover:text-gray-300 transition-colors">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          {data.confirm_password && data.password === data.confirm_password && (
            <p className="flex items-center gap-1 text-[0.65rem] text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Passwords match</p>
          )}
          {data.confirm_password && data.password !== data.confirm_password && (
            <p className="text-[0.65rem] text-red-400">Passwords don't match</p>
          )}
        </div>
      </div>

      {/* Referral code (optional, validated live) */}
      <div className="space-y-1.5">
        <FloatingInput
          id="s-ref" label="Referral code (optional)" value={refCode}
          onChange={(e) => setRefCode(e.target.value.toUpperCase().trim())}
          disabled={isLoading}
          className="font-mono uppercase"
          invalid={refStatus === "invalid"}
          icon={<Gift className="h-4 w-4" />}
          rightElement={
            refStatus === "checking" ? <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              : refStatus === "valid" ? <Check className="h-4 w-4 text-emerald-400" />
              : refStatus === "invalid" ? <X className="h-4 w-4 text-red-400" />
              : null
          }
        />
        {refStatus === "valid" && <p className="text-[0.65rem] text-emerald-400 pl-1">✓ Valid code — referred by {refName}.</p>}
        {refStatus === "invalid" && <p className="text-[0.65rem] text-red-400 pl-1">This referral code doesn't exist. Clear it to sign up without one.</p>}
      </div>

      <button type="submit" disabled={isLoading || refStatus === "checking"}
        className="btn-gradient w-full py-3 text-sm justify-center flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
        {isLoading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
          : <><UserPlus className="w-4 h-4" /> Create Account</>}
      </button>

      <p className="text-center text-xs text-gray-500">
        Already have an account?{" "}
        <button type="button" onClick={() => setViewMode("login")}
          className="text-primary hover:text-white font-semibold transition-colors">
          Sign in
        </button>
      </p>
    </form>
  );
}
