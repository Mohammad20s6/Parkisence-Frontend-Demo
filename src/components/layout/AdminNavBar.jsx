import styles from "./AdminNavBar.module.css";
import { useState, useEffect, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../Logo";
import {
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

function AdminNavBar() {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "dark",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  function handleLogout() {
    logout();
    navigate("/");
  }
  function toggleLanguage() {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  }

  const links = useMemo(
    () => [
      {
        to: "/admin",
        label: t("adminNav.dashboard"),
        icon: LayoutDashboard,
        end: true,
      },
      { to: "/admin/patients", label: t("adminNav.patients"), icon: Users },
      { to: "/admin/results", label: t("adminNav.results"), icon: ClipboardList },
      { to: "/admin/articles", label: t("adminNav.articles"), icon: FileText },
      { to: "/admin/faq", label: t("adminNav.faq"), icon: HelpCircle },
      {
        to: "/admin/feedback",
        label: t("adminNav.feedback"),
        icon: MessageSquare,
      },
    ],
    [t, i18n.language],
  );

  // useEffect(() => {
  //   if (mobileOpen) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "auto";
  //   }

  //   return () => {
  //     document.body.style.overflow = "auto";
  //   };
  // }, [mobileOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Logo />

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ""}`
                }
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label={t("adminNav.toggleTheme")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className={styles.iconBtn}
            onClick={toggleLanguage}
            aria-label={t("adminNav.toggleLanguage")}
          >
            {i18n.language === "en" ? "AR" : "EN"}
          </button>

          {isAuthenticated && (
            <button className={styles.logoutBtn} onClick={handleLogout}>
              {t("adminNav.logout")}
            </button>
          )}

          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileOpen(true)}
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
            aria-label={t("adminNav.closeMenu")}
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.drawerNav}>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `${styles.drawerItem} ${isActive ? styles.drawerActive : ""}`
                }
              >
                <Icon size={22} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}

          {isAuthenticated && (
            <button className={styles.drawerLogout} onClick={handleLogout}>
              {t("adminNav.logout")}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default AdminNavBar;
