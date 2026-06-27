import styles from "./AdminLayout.module.css";

import { useState } from "react";

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import AdminNavBar from "./AdminNavBar";
import Footer from "./Footer";
import AdminSidebar from "../dashboard/admin/AdminSidebar";
import { Menu } from "lucide-react";

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleSidebar() {
    setIsOpen((prev) => !prev);
  }
  return (
    <>
      <AdminNavBar />
      {/* <div className={styles.layout}>
        <AdminSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        {isOpen && (
          <div className={styles.overlay} onClick={() => setIsOpen(false)} />
        )}
        <div className={styles.content}>
          <div className={styles.mobileHeader}>
            <button className={styles.menuBtn} onClick={toggleSidebar}>
              <Menu size={22} />
            </button>
            <span className={styles.title}>Admin Panel</span>
          </div>

          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
      </div> */}
      <Outlet />
      <Footer />
    </>
  );
}

export default AdminLayout;
