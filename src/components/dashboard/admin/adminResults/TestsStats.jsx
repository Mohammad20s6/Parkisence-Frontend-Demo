import styles from "./TestsStats.module.css";

import { Mic, PenTool, Layers, ClipboardList } from "lucide-react";

import { useTranslation } from "react-i18next";

function TestsStats({ tests = [] }) {
  const { t } = useTranslation();

  const totalTests = tests.length;

  const voiceTests = tests.filter((test) => test.testType === "voice").length;

  const drawingTests = tests.filter(
    (test) => test.testType === "drawing",
  ).length;

  const combinedTests = tests.filter(
    (test) => test.testType === "combined",
  ).length;

  return (
    <div className={styles.grid}>
      {/* TOTAL */}

      <div className={styles.card}>
        <div className={styles.iconTotal}>
          <ClipboardList size={18} />
        </div>

        <p className={styles.totalNumber}>{totalTests || "-"}</p>

        <p className={styles.label}>{t("admin.stats.totalTests")}</p>
      </div>

      {/* VOICE */}

      <div className={styles.card}>
        <div className={styles.iconLow}>
          <Mic size={18} />
        </div>

        <p className={styles.lowNumber}>{voiceTests || "-"}</p>

        <p className={styles.label}>{t("admin.stats.voiceTests")}</p>
      </div>

      {/* DRAWING */}

      <div className={styles.card}>
        <div className={styles.iconModerate}>
          <PenTool size={18} />
        </div>

        <p className={styles.moderateNumber}>{drawingTests || "-"}</p>

        <p className={styles.label}>{t("admin.stats.drawingTests")}</p>
      </div>

      {/* COMBINED */}

      <div className={styles.card}>
        <div className={styles.iconHigh}>
          <Layers size={18} />
        </div>

        <p className={styles.highNumber}>{combinedTests || "-"}</p>

        <p className={styles.label}>{t("admin.stats.combinedTests")}</p>
      </div>
    </div>
  );
}

export default TestsStats;
