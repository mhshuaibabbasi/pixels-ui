import { useState, useEffect } from "react";

/** Derives up to two uppercase initials from a name ("John Doe" -> "JD"). */
export function getInitials(name?: string): string {
  const clean = (name || "").trim();
  if (!clean) return "U";
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

interface UserAvatarProps {
  name?: string;
  src?: string | null;
  /** Tailwind size classes for the container, e.g. "w-9 h-9". */
  className?: string;
  /** Tailwind classes for the initials text, e.g. "text-xs". */
  textClassName?: string;
  rounded?: string;
}

/**
 * Avatar that shows the profile image when available and a clean
 * gradient + name-initials fallback otherwise (including broken/empty images).
 */
export const UserAvatar = ({
  name,
  src,
  className = "w-9 h-9",
  textClassName = "text-sm",
  rounded = "rounded-lg",
}: UserAvatarProps) => {
  const [errored, setErrored] = useState(false);
  useEffect(() => setErrored(false), [src]);

  const showImg = src && src.trim() !== "" && !errored;

  return (
    <div className={`${className} ${rounded} bg-gradient-to-br from-primary to-brand-accent flex items-center justify-center overflow-hidden shrink-0`}>
      {showImg ? (
        <img src={src as string} alt={name || "User"} className="w-full h-full object-cover" onError={() => setErrored(true)} />
      ) : (
        <span className={`font-bold text-white ${textClassName}`}>{getInitials(name)}</span>
      )}
    </div>
  );
};

export default UserAvatar;
