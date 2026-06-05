import { Outlet } from "react-router-dom";
import { Navbar } from "../Navbar";

/**
 * Layout for the auth screens (login / signup / forgot).
 * Keeps the global header (Navbar) but no footer, and locks the page to the
 * viewport height so these screens never scroll.
 */
const AuthLayout = () => {
  return (
    <div className="h-[100dvh] overflow-hidden bg-[#0a0e1a] text-white">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AuthLayout;
