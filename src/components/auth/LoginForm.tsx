import { useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { login } from "@/reducer/authSlice";
import { toast } from "react-hot-toast";
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import type { ViewMode } from "./types";
import FloatingInput from "./FloatingInput";

interface LoginFormProps {
  setViewMode: (mode: ViewMode) => void;
  isLoading: boolean;
  email: string;
  setEmail: (v: string) => void;
}

export default function LoginForm({ setViewMode, isLoading, email, setEmail }: LoginFormProps) {
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(localStorage.getItem("isRemembered") === "true");

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) { toast.error("Please enter a valid email address"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }

    if (remember) {
      localStorage.setItem("isRemembered", "true");
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.setItem("isRemembered", "false");
      localStorage.removeItem("rememberedEmail");
    }
    dispatch(login({ email, password }));
  };

  return (
    <form onSubmit={handleLogin} className="space-y-3.5 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <FloatingInput
        id="login-email"
        type="email"
        label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        required
        icon={<Mail className="h-[1.1rem] w-[1.1rem]" />}
        rightElement={isValidEmail && email.length > 0 ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : null}
      />

      <FloatingInput
        id="login-password"
        type={showPassword ? "text" : "password"}
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        required
        icon={<Lock className="h-[1.1rem] w-[1.1rem]" />}
        rightElement={
          <button type="button" tabIndex={-1} onClick={() => setShowPassword((v) => !v)}
            className="text-gray-500 hover:text-gray-300 transition-colors">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[color:var(--color-primary,#00d4ff)]"
          />
          <span className="text-xs text-gray-400">Remember me</span>
        </label>
        <button type="button" onClick={() => setViewMode("forgot")}
          className="text-xs text-primary hover:text-white font-medium transition-colors">
          Forgot password?
        </button>
      </div>

      <button type="submit" disabled={isLoading}
        className="btn-gradient w-full py-3 text-sm justify-center flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
        {isLoading
          ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing in…</>
          : <><LogIn className="w-4 h-4" /> Sign In</>}
      </button>

      <p className="text-center text-xs text-gray-500">
        Don't have an account?{" "}
        <button type="button" onClick={() => setViewMode("signup")}
          className="text-primary hover:text-white font-semibold transition-colors">
          Sign up
        </button>
      </p>
    </form>
  );
}
