import styles from "./Navbar.module.css";
import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "../Logo";
import {
  Sun,
  Moon,
  Menu,
  UserCircle,
  ChevronDown,
  X,
  Home,
  Sparkles,
  Info,
  FileText,
  HelpCircle,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react";
import { Link as ScrollLink } from "react-scroll";
import { useTranslation } from "react-i18next";

import { useAuth } from "../../contexts/AuthContext";

function Navbar() {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const logoutWrapperRef = useRef(null);
  const mobileLogoutWrapperRef = useRef(null); // السطر الجديد
  const { isAuthenticated, user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "dark",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Close logout popover when clicking outside
  // Close logout popover when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        logoutWrapperRef.current &&
        !logoutWrapperRef.current.contains(e.target) &&
        mobileLogoutWrapperRef.current &&
        !mobileLogoutWrapperRef.current.contains(e.target) // السطر الجديد
      ) {
        setShowLogoutConfirm(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  function handleLogout() {
    logout();
    navigate("/");
    setShowLogoutConfirm(false);
    setMobileOpen(false);
  }

  function toggleLanguage() {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo className={styles.logo} />

        {/* Desktop Nav */}
        <nav className={styles.nav}>
          {/* 
            FIX 1: Home active state 
            - When on home page (isHome), always apply active class directly
              since the whole page IS the home page — no need to depend on scroll spy.
            - When on other pages, NavLink handles active via route matching.
          */}
          {isHome ? (
            <ScrollLink
              to="hero"
              spy
              smooth
              offset={-80}
              duration={500}
              className={`${styles.navItem} ${styles.active}`}
            >
              <Home size={18} />
              <span>{t("navbar.home")}</span>
            </ScrollLink>
          ) : (
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              <Home size={18} />
              <span>{t("navbar.home")}</span>
            </NavLink>
          )}

          {/* {isHome ? (
            <ScrollLink
              to="features"
              spy
              smooth
              offset={-80}
              duration={500}
              activeClass={styles.active}
              className={styles.navItem}
            >
              <Sparkles size={18} />
              <span>{t("navbar.features")}</span>
            </ScrollLink>
          ) : (
            <NavLink to="/#features" className={styles.navItem}>
              <Sparkles size={18} />
              <span>{t("navbar.features")}</span>
            </NavLink>
          )}

          {isHome ? (
            <ScrollLink
              to="how"
              spy
              smooth
              offset={-80}
              duration={500}
              activeClass={styles.active}
              className={styles.navItem}
            >
              <Info size={18} />
              <span>{t("navbar.how")}</span>
            </ScrollLink>
          ) : (
            <NavLink to="/#how" className={styles.navItem}>
              <Info size={18} />
              <span>{t("navbar.how")}</span>
            </NavLink>
          )} */}

          <NavLink
            to="/articles"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <FileText size={18} />
            <span>{t("navbar.articles")}</span>
          </NavLink>

          <NavLink
            to="/faq"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <HelpCircle size={18} />
            <span>{t("navbar.faq")}</span>
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/feedback"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              <MessageSquare size={18} />
              <span>{t("navbar.feedback")}</span>
            </NavLink>
          )}

          {isAuthenticated && (
            <NavLink
              to={`${user.role === "patient" ? "/patient" : "/admin"}`}
              end
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              <LayoutDashboard size={18} />
              <span>{t("navbar.dashboard")}</span>
            </NavLink>
          )}
        </nav>

        {/* Actions section */}
        <div className={styles.actions}>
          {/* Theme */}
          <button
            className={styles.iconBtn}
            aria-label={t("navbar.toggleTheme")}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className={styles.iconBtn}
            aria-label={t("navbar.toggleLanguage")}
            onClick={toggleLanguage}
          >
            {i18n.language === "en" ? "AR" : "EN"}
          </button>

          {/* Auth */}
          {!isAuthenticated && (
            <NavLink to="/login" className={styles.loginBtn}>
              {t("navbar.login")}
            </NavLink>
          )}

          {!isAuthenticated && (
            <NavLink to="/register" className={styles.registerBtn}>
              {t("navbar.register")}
            </NavLink>
          )}

          {isAuthenticated && (
            <div className={styles.userArea}>
              <NavLink
                to="/patient/profile"
                className={({ isActive }) =>
                  `${styles.userBtn} ${isActive ? styles.active : ""}`
                }
              >
                <UserCircle className={styles.userIcon} />
                <span className={styles.userName}>
                  {user?.name?.length > 9
                    ? user?.name?.slice(0, 9)
                    : user?.name}
                </span>
                <ChevronDown size={16} />
              </NavLink>

              {/* 
                FIX 3: Logout confirmation popover 
                - Clicking logout button now toggles a small popover below it
                - Popover has confirm + cancel buttons
                - Clicking outside closes the popover
              */}
              <div className={styles.logoutWrapper} ref={logoutWrapperRef}>
                <button
                  className={styles.logoutBtn}
                  onClick={() => setShowLogoutConfirm((prev) => !prev)}
                >
                  {t("navbar.logout")}
                </button>

                {showLogoutConfirm && (
                  <div className={styles.logoutPopover}>
                    <p className={styles.logoutPopoverText}>
                      {t("navbar.logoutConfirm", "تأكيد تسجيل الخروج؟")}
                    </p>
                    <div className={styles.logoutPopoverActions}>
                      <button
                        className={styles.logoutConfirmBtn}
                        onClick={handleLogout}
                      >
                        {t("navbar.logoutYes", "خروج")}
                      </button>
                      <button
                        className={styles.logoutCancelBtn}
                        onClick={() => setShowLogoutConfirm(false)}
                      >
                        {t("navbar.logoutNo", "إلغاء")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Button */}
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileOpen(true)}
            aria-label={t("navbar.toggleMenu")}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile Drawer */}
      <div
        className={`${styles.drawer} ${mobileOpen ? styles.drawerOpen : ""}`}
      >
        <div className={styles.drawerHeader}>
          <button
            className={styles.closeBtn}
            onClick={() => setMobileOpen(false)}
            aria-label={t("navbar.toggleMenu")}
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.drawerNav}>
          {/* Same home active fix for mobile drawer */}
          {isHome ? (
            <ScrollLink
              to="hero"
              spy
              smooth
              offset={-80}
              duration={400}
              className={`${styles.drawerItem} ${styles.drawerActive}`}
              onClick={() => setMobileOpen(false)}
            >
              <Home size={22} />
              <span>{t("navbar.home")}</span>
            </ScrollLink>
          ) : (
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${styles.drawerItem} ${isActive ? styles.drawerActive : ""}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <Home size={22} />
              <span>{t("navbar.home")}</span>
            </NavLink>
          )}

          {/* {isHome ? (
            <ScrollLink
              to="features"
              spy
              smooth
              offset={-80}
              duration={400}
              activeClass={styles.drawerActive}
              className={styles.drawerItem}
              onClick={() => setMobileOpen(false)}
            >
              <Sparkles size={22} />
              <span>{t("navbar.features")}</span>
            </ScrollLink>
          ) : (
            <NavLink
              to="/#features"
              className={styles.drawerItem}
              onClick={() => setMobileOpen(false)}
            >
              <Sparkles size={22} />
              <span>{t("navbar.features")}</span>
            </NavLink>
          )}

          {isHome ? (
            <ScrollLink
              to="how"
              spy
              smooth
              offset={-80}
              duration={400}
              activeClass={styles.drawerActive}
              className={styles.drawerItem}
              onClick={() => setMobileOpen(false)}
            >
              <Info size={22} />
              <span>{t("navbar.how")}</span>
            </ScrollLink>
          ) : (
            <NavLink
              to="/#how"
              className={styles.drawerItem}
              onClick={() => setMobileOpen(false)}
            >
              <Info size={22} />
              <span>{t("navbar.how")}</span>
            </NavLink>
          )} */}

          <NavLink
            to="/articles"
            className={({ isActive }) =>
              `${styles.drawerItem} ${isActive ? styles.drawerActive : ""}`
            }
            onClick={() => setMobileOpen(false)}
          >
            <FileText size={22} />
            <span>{t("navbar.articles")}</span>
          </NavLink>

          <NavLink
            to="/faq"
            className={({ isActive }) =>
              `${styles.drawerItem} ${isActive ? styles.drawerActive : ""}`
            }
            onClick={() => setMobileOpen(false)}
          >
            <HelpCircle size={22} />
            <span>{t("navbar.faq")}</span>
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/feedback"
              className={({ isActive }) =>
                `${styles.drawerItem} ${isActive ? styles.drawerActive : ""}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <MessageSquare size={22} />
              <span>{t("navbar.feedback")}</span>
            </NavLink>
          )}

          {isAuthenticated && (
            <NavLink
              to={`${user.role === "patient" ? "/patient" : "/admin"}`}
              end
              className={({ isActive }) =>
                `${styles.drawerItem} ${isActive ? styles.drawerActive : ""}`
              }
              onClick={() => setMobileOpen(false)}
            >
              <LayoutDashboard size={22} />
              <span>{t("navbar.dashboard")}</span>
            </NavLink>
          )}

          {!isAuthenticated && (
            <NavLink
              to="/login"
              onClick={() => setMobileOpen(false)}
              className={styles.drawerAction}
            >
              {t("navbar.login")}
            </NavLink>
          )}

          {!isAuthenticated && (
            <NavLink
              to="/register"
              onClick={() => setMobileOpen(false)}
              className={styles.drawerPrimaryAction}
            >
              {t("navbar.register")}
            </NavLink>
          )}

          {/* Drawer logout with inline confirmation */}
          {isAuthenticated && (
            <div
              className={styles.drawerLogoutWrapper}
              ref={mobileLogoutWrapperRef} // إضافة المرجع هنا
            >
              {!showLogoutConfirm ? (
                <button
                  className={styles.drawerLogout}
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  {t("navbar.logout")}
                </button>
              ) : (
                <div className={styles.drawerLogoutConfirm}>
                  <p className={styles.drawerLogoutConfirmText}>
                    {t("navbar.logoutConfirm")}
                  </p>
                  <div className={styles.drawerLogoutConfirmActions}>
                    <button
                      className={styles.logoutConfirmBtn}
                      onClick={handleLogout}
                    >
                      {t("navbar.logoutYes")}
                    </button>
                    <button
                      className={styles.logoutCancelBtn}
                      onClick={() => setShowLogoutConfirm(false)}
                    >
                      {t("navbar.logoutNo")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
