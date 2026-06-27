import styles from "./DashboardAnalyticsSection.module.css";

import { Line } from "rc-progress";

import { Mic, PenTool, Layers, Users, ClipboardList } from "lucide-react";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

function DashboardAnalyticsSection() {
  const { t } = useTranslation();

  const [stats, setStats] = useState({
    totalTests: 0,

    // =========================
    // Test Distribution
    // =========================
    voiceTests: 0,
    drawingTests: 0,
    combinedTests: 0,

    voiceTestsCount: 0,
    drawingTestsCount: 0,
    combinedTestsCount: 0,

    // =========================
    // Parkinson Detection Distribution
    // =========================
    voiceParkinsonPercentage: 0,
    drawingParkinsonPercentage: 0,
    combinedParkinsonPercentage: 0,

    voiceParkinsonText: "0 of 0 tests",
    drawingParkinsonText: "0 of 0 tests",
    combinedParkinsonText: "0 of 0 tests",

    // =========================
    // Monthly Stats
    // =========================
    newPatientsThisMonth: 0,
    testsThisMonth: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDashboardAnalytics() {
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

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch dashboard analytics",
          );
        }

        const data = result.data;

        const totalTests = data.totalTests || 0;

        // =========================
        // Test Distribution
        // =========================

        const voiceTestsCount = data.testsByType?.voice || 0;

        const drawingTestsCount = data.testsByType?.drawing || 0;

        const combinedTestsCount = data.testsByType?.combined || 0;

        const voiceTests =
          totalTests > 0 ? Math.round((voiceTestsCount / totalTests) * 100) : 0;

        const drawingTests =
          totalTests > 0
            ? Math.round((drawingTestsCount / totalTests) * 100)
            : 0;

        const combinedTests =
          totalTests > 0
            ? Math.round((combinedTestsCount / totalTests) * 100)
            : 0;

        // =========================
        // Parkinson Detection Distribution
        // Parkinson Cases / Total Tests By Type
        // =========================

        const voiceParkinson = data.parkinsonTestsByType?.voice || 0;

        const drawingParkinson = data.parkinsonTestsByType?.drawing || 0;

        const combinedParkinson = data.parkinsonTestsByType?.combined || 0;

        const voiceParkinsonPercentage =
          voiceTestsCount > 0
            ? Math.round((voiceParkinson / voiceTestsCount) * 100)
            : 0;

        const drawingParkinsonPercentage =
          drawingTestsCount > 0
            ? Math.round((drawingParkinson / drawingTestsCount) * 100)
            : 0;

        const combinedParkinsonPercentage =
          combinedTestsCount > 0
            ? Math.round((combinedParkinson / combinedTestsCount) * 100)
            : 0;

        setStats({
          totalTests,

          // =========================
          // Test Distribution
          // =========================
          voiceTests,
          drawingTests,
          combinedTests,

          voiceTestsCount,
          drawingTestsCount,
          combinedTestsCount,

          // =========================
          // Parkinson Detection Distribution
          // =========================
          voiceParkinsonPercentage,
          drawingParkinsonPercentage,
          combinedParkinsonPercentage,

          voiceParkinsonText: `${voiceParkinson} / ${voiceTestsCount}`,

          drawingParkinsonText: `${drawingParkinson} / ${drawingTestsCount}`,

          combinedParkinsonText: `${combinedParkinson} / ${combinedTestsCount}`,

          // =========================
          // Monthly Stats
          // =========================
          newPatientsThisMonth: data.patientsThisMonth || 0,

          testsThisMonth: data.testsThisMonth || 0,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Dashboard analytics error:", err);

          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardAnalytics();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {/* =========================
            Test Distribution
        ========================= */}

        <div className={styles.card}>
          <h3 className={styles.title}>
            {t("admin.analytics.testDistribution")}
          </h3>

          <div className={styles.list}>
            {/* Voice Tests */}

            <div className={styles.row}>
              <div className={styles.iconAccent}>
                <Mic size={18} />
              </div>

              <div className={styles.progressBlock}>
                <div className={styles.progressHeader}>
                  <span>
                    {t("admin.stats.voiceTests")} ({stats.voiceTestsCount})
                  </span>

                  <span>{stats.voiceTests}%</span>
                </div>

                <Line
                  percent={stats.voiceTests}
                  strokeWidth={4}
                  trailWidth={4}
                  strokeColor="var(--success)"
                  trailColor="var(--bg-primary)"
                  strokeLinecap="round"
                />
              </div>
            </div>

            {/* Drawing Tests */}

            <div className={styles.row}>
              <div className={styles.iconPrimary}>
                <PenTool size={18} />
              </div>

              <div className={styles.progressBlock}>
                <div className={styles.progressHeader}>
                  <span>
                    {t("admin.stats.drawingTests")} ({stats.drawingTestsCount})
                  </span>

                  <span>{stats.drawingTests}%</span>
                </div>

                <Line
                  percent={stats.drawingTests}
                  strokeWidth={4}
                  trailWidth={4}
                  strokeColor="var(--info)"
                  trailColor="var(--bg-primary)"
                  strokeLinecap="round"
                />
              </div>
            </div>

            {/* Combined Tests */}

            <div className={styles.row}>
              <div className={styles.iconPurple}>
                <Layers size={18} />
              </div>

              <div className={styles.progressBlock}>
                <div className={styles.progressHeader}>
                  <span>
                    {t("admin.stats.combinedTests")} ({stats.combinedTestsCount}
                    )
                  </span>

                  <span>{stats.combinedTests}%</span>
                </div>

                <Line
                  percent={stats.combinedTests}
                  strokeWidth={4}
                  trailWidth={4}
                  strokeColor="var(--purple)"
                  trailColor="var(--bg-primary)"
                  strokeLinecap="round"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            Parkinson Detection Distribution
        ========================= */}

        <div className={styles.card}>
          <h3 className={styles.title}>
            {t("admin.analytics.resultDistribution")}
          </h3>

          <div className={styles.list}>
            {/* Voice Parkinson Cases */}

            <div className={styles.row}>
              <div className={styles.iconAccent}>
                <Mic size={18} />
              </div>

              <div className={styles.progressBlock}>
                <div className={styles.progressHeader}>
                  <span>{t("admin.stats.voiceResult")}</span>

                  <span>
                    {stats.voiceParkinsonText} ({stats.voiceParkinsonPercentage}
                    %)
                  </span>
                </div>

                <Line
                  percent={stats.voiceParkinsonPercentage}
                  strokeWidth={4}
                  trailWidth={4}
                  strokeColor="var(--success)"
                  trailColor="var(--bg-primary)"
                  strokeLinecap="round"
                />
              </div>
            </div>

            {/* Drawing Parkinson Cases */}

            <div className={styles.row}>
              <div className={styles.iconPrimary}>
                <PenTool size={18} />
              </div>

              <div className={styles.progressBlock}>
                <div className={styles.progressHeader}>
                  <span>{t("admin.stats.drawingResult")}</span>

                  <span>
                    {stats.drawingParkinsonText} (
                    {stats.drawingParkinsonPercentage}%)
                  </span>
                </div>

                <Line
                  percent={stats.drawingParkinsonPercentage}
                  strokeWidth={4}
                  trailWidth={4}
                  strokeColor="var(--moderate)"
                  trailColor="var(--bg-primary)"
                  strokeLinecap="round"
                />
              </div>
            </div>

            {/* Combined Parkinson Cases */}

            <div className={styles.row}>
              <div className={styles.iconPurple}>
                <Layers size={18} />
              </div>

              <div className={styles.progressBlock}>
                <div className={styles.progressHeader}>
                  <span>{t("admin.stats.combinedResult")}</span>

                  <span>
                    {stats.combinedParkinsonText} (
                    {stats.combinedParkinsonPercentage}%)
                  </span>
                </div>

                <Line
                  percent={stats.combinedParkinsonPercentage}
                  strokeWidth={4}
                  trailWidth={4}
                  strokeColor="var(--high)"
                  trailColor="var(--bg-primary)"
                  strokeLinecap="round"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            Monthly Statistics
        ========================= */}

        <div className={styles.card}>
          <h3 className={styles.title}>{t("admin.analytics.thisMonth")}</h3>

          <div className={styles.monthStats}>
            {/* New Patients */}

            <div className={styles.monthItem}>
              <div>
                <p className={styles.label}>{t("admin.stats.newPatients")}</p>

                <p className={styles.monthValue}>
                  {stats.newPatientsThisMonth}
                </p>
              </div>

              <div className={styles.iconPrimaryLarge}>
                <Users size={22} />
              </div>
            </div>

            {/* Tests Conducted */}

            <div className={styles.monthItem}>
              <div>
                <p className={styles.label}>
                  {t("admin.stats.testsConducted")}
                </p>

                <p className={styles.monthValue}>{stats.testsThisMonth}</p>
              </div>

              <div className={styles.iconAccentLarge}>
                <ClipboardList size={22} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardAnalyticsSection;
