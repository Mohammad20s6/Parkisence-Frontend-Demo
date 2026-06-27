import styles from "./HealthSummary.module.css";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Line } from "rc-progress";
import { useTranslation } from "react-i18next";

function HealthSummary() {
  const { t } = useTranslation();

  const [stats, setStats] = useState({
    HealthyPerType: {
      voice: 0,
      drawing: 0,
      combined: 0,
    },

    totalTestsPerType: {
      voice: 0,
      drawing: 0,
      combined: 0,
    },

    averageHealthyTests: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchHealthyStats() {
      try {
        setIsLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Unauthorized");
        }

        const response = await fetch(
          "http://127.0.0.1:3000/api/tests/my-healthy-stats",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch healthy stats");
        }

        setStats(data.data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Healthy stats error:", err);
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchHealthyStats();

    return () => controller.abort();
  }, []);

  // =========================
  // Healthy counts
  // =========================

  const voiceHealthy = stats.HealthyPerType?.voice || 0;

  const drawingHealthy = stats.HealthyPerType?.drawing || 0;

  const combinedHealthy = stats.HealthyPerType?.combined || 0;

  // =========================
  // Total counts
  // =========================

  const voiceTotal = stats.totalTestsPerType?.voice || 0;

  const drawingTotal = stats.totalTestsPerType?.drawing || 0;

  const combinedTotal = stats.totalTestsPerType?.combined || 0;

  // =========================
  // Percentages
  // =========================

  const voicePercent = voiceTotal
    ? Math.round((voiceHealthy / voiceTotal) * 100)
    : 0;

  const drawingPercent = drawingTotal
    ? Math.round((drawingHealthy / drawingTotal) * 100)
    : 0;

  const combinedPercent = combinedTotal
    ? Math.round((combinedHealthy / combinedTotal) * 100)
    : 0;

  // =========================
  // Overall Health Score
  // =========================

  const overall = Math.round(stats.averageHealthyTests * 100);

  if (isLoading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <section>
      <h2 className={styles.heading}>{t("patient.healthSummary.heading")}</h2>

      <div className={styles.card}>
        {/* Overall Circle */}
        <div className={styles.circleWrapper}>
          <CircularProgressbar
            value={overall}
            text={`${overall}%`}
            styles={buildStyles({
              textSize: "18px",
              pathColor: "var(--primary)",
              trailColor: "var(--bg-primary)",
              textColor: "var(--text-primary)",
            })}
          />

          <p className={styles.circleLabel}>
            {t("patient.healthSummary.healthScore")}
          </p>
        </div>

        {/* Voice */}
        <div className={styles.barItem}>
          <div className={styles.barHeader}>
            <span>{t("patient.healthSummary.voiceTest")}</span>

            <span>
              {voiceHealthy}/{voiceTotal}
            </span>
          </div>

          <Line
            percent={voicePercent}
            strokeWidth={4}
            trailWidth={4}
            strokeColor="var(--primary)"
            trailColor="var(--bg-primary)"
            strokeLinecap="round"
          />
        </div>

        {/* Drawing */}
        <div className={styles.barItem}>
          <div className={styles.barHeader}>
            <span>{t("patient.healthSummary.drawingTest")}</span>

            <span>
              {drawingHealthy}/{drawingTotal}
            </span>
          </div>

          <Line
            percent={drawingPercent}
            strokeWidth={4}
            trailWidth={4}
            strokeColor="var(--info)"
            trailColor="var(--bg-primary)"
            strokeLinecap="round"
          />
        </div>

        {/* Combined */}
        <div className={styles.barItem}>
          <div className={styles.barHeader}>
            <span>{t("patient.healthSummary.combinedTest")}</span>

            <span>
              {combinedHealthy}/{combinedTotal}
            </span>
          </div>

          <Line
            percent={combinedPercent}
            strokeWidth={4}
            trailWidth={4}
            strokeColor="var(--success)"
            trailColor="var(--bg-primary)"
            strokeLinecap="round"
          />
        </div>
      </div>
    </section>
  );
}

export default HealthSummary;
