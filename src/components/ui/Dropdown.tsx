import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Themed custom dropdown for the PIXEL dark/neon UI.
 * Replaces native <select> so the option list matches the app theme
 * (native option popups are OS-styled and can't be themed reliably).
 */
export const Dropdown = ({ value, onChange, options, className = "", placeholder = "Select", disabled }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`portal-input w-full flex items-center justify-between gap-2 text-left ${open ? "!border-primary" : ""} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <span className={selected ? "text-white truncate" : "text-gray-500 truncate"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-primary" : "text-gray-400"}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute z-50 mt-1.5 w-full rounded-xl bg-[#111a2e] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.55)] overflow-hidden p-1 max-h-60 overflow-y-auto scrollbar-thin"
          >
            {options.map((o) => {
              const active = o.value === value;
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => { onChange(o.value); setOpen(false); }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                      active ? "bg-primary/15 text-white font-semibold" : "text-gray-300 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span className="truncate">{o.label}</span>
                    {active && <Check size={15} className="text-primary shrink-0" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
