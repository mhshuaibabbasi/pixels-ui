import { useState } from "react";
import { toast } from "react-hot-toast";
import { Mail, Loader2, ArrowLeft, MailCheck } from "lucide-react";
import type { ViewMode } from "./types";
import FloatingInput from "./FloatingInput";

interface ForgotPasswordFormProps {
  setViewMode: (mode: ViewMode) => void;
}

export default function ForgotPasswordForm({ setViewMode }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error("Please enter a valid email address"); return; }
    setLoading(true);
    // No backend reset endpoint exists yet — simulate the request.
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
    toast.success("If this email is registered, a reset link has been sent.");
  };

  if (sent) {
    return (
      <div className="animate-in fade-in duration-300">
        <div className="text-center py-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
            <MailCheck size={26} className="text-emerald-400" />
          </div>
          <p className="text-sm text-gray-300 mb-1">Check your inbox</p>
          <p className="text-xs text-gray-500">
            We've sent reset instructions to <span className="text-gray-300 font-medium">{email}</span>.
          </p>
        </div>
        <button type="button" onClick={() => setViewMode("login")}
          className="w-full flex items-center justify-center gap-1.5 pt-3 mt-3 border-t border-white/10 text-xs text-gray-500 hover:text-gray-200 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleForgot} className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="space-y-1.5">
        <FloatingInput
          id="forgot-email" type="email" label="Email address" value={email}
          onChange={(e) => setEmail(e.target.value)} required icon={<Mail className="h-4 w-4" />}
        />
        <p className="text-xs text-gray-500 pl-1">We'll send password reset instructions to this email.</p>
      </div>

      <button type="submit" disabled={loading}
        className="btn-gradient w-full py-3 text-sm justify-center flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
          : <><Mail className="w-4 h-4" /> Send Reset Link</>}
      </button>

      <button type="button" onClick={() => setViewMode("login")}
        className="w-full flex items-center justify-center gap-1.5 pt-2 border-t border-white/10 text-xs text-gray-500 hover:text-gray-200 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to login
      </button>
    </form>
  );
}
