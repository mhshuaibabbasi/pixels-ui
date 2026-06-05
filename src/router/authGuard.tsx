import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { localService } from "../services/local";
import { Fragment } from "react/jsx-runtime";

interface Props {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<Props> = ({ children }) => {
  const { token: reduxToken, isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const token = reduxToken || localService.getToken();

  // Redirect to landing page if not authenticated
  if (!token || !isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Fragment>{children}</Fragment>;
};