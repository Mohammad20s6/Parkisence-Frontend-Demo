import styles from "./AdminDashboard.module.css";

import AdminStatsCards from "./adminDashboard/AdminStatsCards";
import DashboardAnalyticsSection from "./adminDashboard/DashboardAnalyticsSection";
import RecentActivitySection from "./adminDashboard/RecentActivitySection";

function AdminDashboard() {
  return (
    <div className={styles.section}>
      <AdminStatsCards />
      <DashboardAnalyticsSection />
      <RecentActivitySection />
    </div>
  );
}

export default AdminDashboard;
