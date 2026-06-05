import { useAppSelector } from "@/app/hooks";

interface RoleGuardProps {
  roles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component-level role gating.
 * Renders children only if the current user's role is in the allowed list.
 * Optionally renders a fallback if the role doesn't match.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ roles, children, fallback = null }) => {
  const { user } = useAppSelector((state) => state.auth);
  const userRole = user?.role || "";

  if (!roles.some((role) => role.toLowerCase() === userRole.toLowerCase())) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Utility hook to check role without rendering.
 */
export const useHasRole = (roles: string[]): boolean => {
  const { user } = useAppSelector((state) => state.auth);
  const userRole = user?.role || "";
  return roles.some((role) => role.toLowerCase() === userRole.toLowerCase());
};
