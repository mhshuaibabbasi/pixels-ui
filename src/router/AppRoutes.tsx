import { Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "./authGuard";
import RoutesList from "./allRoutes";
import PortalRoutesList from "./portalRoutes";
import NotFound from "@/pages/not-found";
import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import PortalLayout from "@/components/layout/PortalLayout";
import Login from "@/pages/Login";
import { useAppSelector } from "@/app/hooks";
import { localService } from "../services/local";

function AppRoutes() {
  const { token: reduxToken, isAuthenticated } = useAppSelector((state) => state.auth);
  const token = reduxToken || localService.getToken();
  const isLoggedIn = isAuthenticated || !!token;

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {RoutesList.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* Auth screens: global header (Navbar), no footer, locked to viewport height. */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/forgot" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
      </Route>

      <Route
        path="/dashboard/*"
        element={
          <AuthGuard>
            <PortalLayout />
          </AuthGuard>
        }
      >
        {PortalRoutesList.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
            index={route.path === ""}
          />
        ))}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;