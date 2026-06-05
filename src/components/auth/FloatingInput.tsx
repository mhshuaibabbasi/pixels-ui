import { forwardRef } from "react";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
  invalid?: boolean;
}

/**
 * MUI-style floating-label input, themed for PIXEL (dark glass).
 * Uses placeholder=" " + the peer CSS trick so the label sits inside when empty
 * and floats onto the border when focused or filled. The floated label's
 * background must match the card colour (#0f1524) so it cleanly cuts the border.
 */
const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, icon, rightElement, className = "", containerClassName = "", id, disabled, invalid, ...props }, ref) => {
    return (
      <div className={`relative ${containerClassName}`}>
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          disabled={disabled}
          placeholder=" "
          className={[
            "peer h-10 w-full rounded-xl border bg-white/[0.04] text-sm text-white outline-none transition-colors",
            invalid ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-primary",
            disabled ? "opacity-60 cursor-not-allowed" : "",
            icon ? "pl-9" : "pl-3.5",
            rightElement ? "pr-10" : "pr-3.5",
            className,
          ].join(" ")}
          {...props}
        />

        <label
          htmlFor={id}
          className={[
            "pointer-events-none absolute z-10 left-3 transition-all duration-150 select-none",
            // floating (default: has value)
            "top-0 -translate-y-1/2 text-[0.68rem] font-medium px-1 bg-[#0f1524]",
            invalid ? "text-red-400" : "text-primary",
            // inside (empty + unfocused)
            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2",
            "peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-500",
            "peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0",
            icon ? "peer-placeholder-shown:left-9" : "",
            // focus: always float
            "peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.68rem] peer-focus:font-medium peer-focus:px-1 peer-focus:bg-[#0f1524]",
            invalid ? "peer-focus:text-red-400" : "peer-focus:text-primary",
            icon ? "peer-focus:left-3" : "",
          ].join(" ")}
        >
          {label}
        </label>

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">{rightElement}</div>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";
export default FloatingInput;
