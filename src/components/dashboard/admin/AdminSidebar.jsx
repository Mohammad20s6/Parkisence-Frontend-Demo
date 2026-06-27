import styles from "./AdminSidebar.module.css";
import { NavLink } from "react-router-dom";
import Logo from "../../Logo";

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  CircleHelp,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

function AdminSidebar({ isOpen, onClose }) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <nav className={styles.nav} onClick={onClose}>
        {/* <span className={styles.title}>Admin Panel</span> */}
        <NavItem
          to="/admin"
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
        />
        <NavItem
          to="/admin/patients"
          icon={<Users size={20} />}
          label="Patients"
        />
        <NavItem
          to="/admin/results"
          icon={<ClipboardList size={20} />}
          label="Test Results"
        />
        <NavItem
          to="/admin/articles"
          icon={<FileText size={20} />}
          label="Articles"
        />
        <NavItem to="/admin/faq" icon={<CircleHelp size={20} />} label="FAQ" />
        <NavItem
          to="/admin/feedback"
          icon={<MessageSquare size={20} />}
          label="Feedback"
        />
      </nav>
    </aside>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === "/admin"}
      className={({ isActive }) =>
        `${styles.link} ${isActive ? styles.active : ""}`
      }
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
      <ChevronRight size={16} className={styles.arrow} />
    </NavLink>
  );
}

export default AdminSidebar;
