import styles from "./AdminStatsCards.module.css";
import { Users, FileText, ShieldCheck, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function AdminStatsCards() {
  const { t } = useTranslation();

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalTests: 0,
    healthyTests: 0,
    parkinsonTests: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAdminStats() {
      try {
        setIsLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Unauthorized");
        }

        const response = await fetch("http://127.0.0.1:3000/api/admin/stats", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch admin stats");
        }

        setStats({
          totalPatients: data.data.totalPatients || 0,
          totalTests: data.data.totalTests || 0,
          healthyTests: data.data.healthyTests || 0,
          parkinsonTests: data.data.parkinsonTests || 0,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Admin stats error:", err);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdminStats();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.grid}>
      {/* Total Patients */}
      <div className={styles.card}>
        <div className={styles.content}>
          <div>
            <p className={styles.label}>{t("admin.stats.totalPatients")}</p>

            <p className={styles.value}>{stats.totalPatients}</p>
          </div>

          <div className={`${styles.iconBox} ${styles.patients}`}>
            <Users size={22} />
          </div>
        </div>
      </div>

      {/* Total Tests */}
      <div className={styles.card}>
        <div className={styles.content}>
          <div>
            <p className={styles.label}>
              {t("admin.stats.totalTestsDashboard")}
            </p>

            <p className={styles.value}>{stats.totalTests}</p>
          </div>

          <div className={`${styles.iconBox} ${styles.tests}`}>
            <FileText size={22} />
          </div>
        </div>
      </div>

      {/* Healthy Tests */}
      <div className={styles.card}>
        <div className={styles.content}>
          <div>
            <p className={styles.label}>{t("admin.stats.normalTests")}</p>

            <p className={styles.value}>{stats.healthyTests}</p>
          </div>

          <div className={`${styles.iconBox} ${styles.rate}`}>
            <ShieldCheck size={22} />
          </div>
        </div>
      </div>

      {/* Parkinson Tests */}
      <div className={styles.card}>
        <div className={styles.content}>
          <div>
            <p className={styles.label}>{t("admin.stats.abnormalTests")}</p>

            <p className={styles.value}>{stats.parkinsonTests}</p>
          </div>

          <div className={`${styles.iconBox} ${styles.pending}`}>
            <Activity size={22} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminStatsCards;
