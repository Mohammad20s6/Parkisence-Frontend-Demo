import styles from "./StatsCards.module.css";

import {
  CalendarDays,
  Activity,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import testService from "../../../api/testService";
import Loading from "../../ui/Loading";
import ErrorAlert from "../../ui/ErrorAlert";
function StatsCards() {
  const { t, i18n } = useTranslation();

  const locale = i18n.language === "ar" ? "ar-SY" : "en-GB";

  const [stats, setStats] = useState({
    totalTests: 0,
    healthyCount: 0,
    parkinsonCount: 0,
    lastTestDate: "-",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        setError("");

        const response = await testService.getMyStats();

        const data = response.data;

        const testsResponse = await testService.getMyTests();

        const tests = testsResponse.data.tests;

        setStats({
          totalTests: data.totalTests,
          healthyCount: data.healthy,
          parkinsonCount: data.parkinson,
          lastTestDate: tests.length > 0 ? tests[0].createdAt : "-",
        });
      } catch (err) {
        console.error("Stats error:", err);
        setError(err.message || "Failed to load statistics");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  return (
    <div className={styles.grid}>
      {/* TOTAL TESTS */}

      <div className={styles.card}>
        <div className={styles.content}>
          <div>
            <p className={styles.label}>{t("patient.statsCards.totalTests")}</p>

            <p className={styles.value}>{stats.totalTests || 0}</p>
          </div>

          <div className={`${styles.iconBox} ${styles.totalIcon}`}>
            <Activity size={22} />
          </div>
        </div>
      </div>

      {/* HEALTHY TESTS */}

      <div className={styles.card}>
        <div className={styles.content}>
          <div>
            <p className={styles.label}>
              {t("patient.statsCards.normalTests")}
            </p>

            <p className={styles.value}>{stats.healthyCount || 0}</p>
          </div>

          <div className={`${styles.iconBox} ${styles.healthyIcon}`}>
            <ShieldCheck size={22} />
          </div>
        </div>
      </div>

      {/* ABNORMAL TESTS */}

      <div className={styles.card}>
        <div className={styles.content}>
          <div>
            <p className={styles.label}>
              {t("patient.statsCards.abnormalTests")}
            </p>

            <p className={styles.value}>{stats.parkinsonCount || 0}</p>
          </div>

          <div className={`${styles.iconBox} ${styles.parkinsonIcon}`}>
            <TriangleAlert size={22} />
          </div>
        </div>
      </div>

      {/* LAST TEST */}

      <div className={styles.card}>
        <div className={styles.content}>
          <div>
            <p className={styles.label}>{t("patient.statsCards.lastTest")}</p>

            <p className={styles.value}>
              {stats.lastTestDate && stats.lastTestDate !== "-"
                ? new Date(stats.lastTestDate).toLocaleDateString(locale)
                : "-"}
            </p>
          </div>

          <div className={`${styles.iconBox} ${styles.dateIcon}`}>
            <CalendarDays size={22} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
