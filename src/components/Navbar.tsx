import { useState, useEffect } from "react";
import { Menu, X, LogOut, LayoutDashboard, Zap, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAuth, useUI } from "@/app/hooks";
import { setMobileMenuOpen, toggleMobileMenu } from "@/reducer/uiSlice";
import { logout } from "@/reducer/authSlice";
import { APP_CONFIG } from "@/config/app.config";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobileMenuOpen } = useUI();
  const { isAuthenticated, user } = useAuth();
  const navLinks = APP_CONFIG.NAV_LINKS;

  // On the home page these are in-page anchors; elsewhere (e.g. /login) they
  // route back to the home section.
  const isHome = location.pathname === "/";
  const sectionHref = (href: string) => (isHome ? href : `/${href}`);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogin = () => {
    navigate("/login");
    dispatch(setMobileMenuOpen(false));
  };
  const handleLogout = () => {
    dispatch(logout());
    dispatch(setMobileMenuOpen(false));
    navigate("/", { replace: true });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-3 bg-[#0a0e1a]/80 backdrop-blur-2xl border-b border-white/[0.07] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="section-container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-brand-accent opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-brand-accent blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
            <Zap className="relative text-white fill-white z-10" size={18} />
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-white group-hover:text-primary transition-colors duration-300">
            {APP_CONFIG.name}
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={sectionHref(link.href)}
              className="relative text-sm font-semibold text-gray-400 hover:text-white transition-colors duration-200 tracking-wide group"
            >
              {link.name}
              <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-brand-accent rounded-full group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-all"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-full hover:bg-red-500/[0.08] transition-all"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-all"
              >
                Sign In
              </button>
              <Link
                to="/signup"
                className="btn-gradient px-5 py-2 text-sm flex items-center gap-1.5"
              >
                Get Started <ChevronRight size={14} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => dispatch(toggleMobileMenu())}
          className="md:hidden p-2 text-gray-300 hover:text-white rounded-xl hover:bg-white/5 transition-all"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isMobileMenuOpen ? "x" : "menu"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[#0a0e1a]/98 backdrop-blur-2xl border-b border-white/[0.08]"
          >
            <div className="section-container py-6 space-y-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={sectionHref(link.href)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                  className="flex items-center justify-between py-3 px-4 text-base font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  {link.name}
                  <ChevronRight size={16} className="text-gray-600" />
                </motion.a>
              ))}

              <div className="pt-4 mt-4 border-t border-white/[0.08] space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.04] rounded-xl border border-white/[0.08]">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-brand-accent flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-white">{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                      className="flex items-center gap-3 py-3 px-4 text-base font-semibold text-gray-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                    >
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 py-3 px-4 text-base font-semibold text-red-400 hover:bg-red-500/[0.08] rounded-xl transition-all text-left"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLogin}
                      className="w-full py-3 px-4 text-base font-semibold text-gray-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all text-left"
                    >
                      Sign In
                    </button>
                    <Link
                      to="/signup"
                      onClick={() => dispatch(setMobileMenuOpen(false))}
                      className="btn-gradient w-full py-3 px-4 text-sm text-center justify-center"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
