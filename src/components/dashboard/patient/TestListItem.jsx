import styles from "./TestListItem.module.css";

import { Link } from "react-router-dom";

import { Mic, PenTool, Layers, Calendar } from "lucide-react";

import { useTranslation } from "react-i18next";

function getIcon(type) {
  switch (type) {
    case "voice":
      return Mic;

    case "drawing":
      return PenTool;

    case "combined":
      return Layers;

    default:
      return Mic;
  }
}

function TestListItem({ test }) {
  const { t, i18n } = useTranslation();

  const locale = i18n.language === "ar" ? "ar-SY" : "en-GB";

  const Icon = getIcon(test.type);

  const iconType =
    test.type === "voice"
      ? styles.primary
      : test.type === "drawing"
        ? styles.accent
        : styles.success;

  /* ============================= */
  /* ========= RESULT UI ========= */
  /* ============================= */
  function getResultData() {
    // فشل التحليل
    if (test.status === "failed") {
      return {
        label: t("patient.testsHistory.failed"),
        className: styles.failed,
      };
    }

    // سليم
    if (test.result === "Healthy") {
      return {
        label: t("patient.testsHistory.healthy"),
        className: styles.healthy,
      };
    }

    // باركنسون
    return {
      label: t("patient.testsHistory.parkinson"),
      className: styles.parkinson,
    };
  }

  const resultData = getResultData();

  return (
    <Link to={`/patient/history/${test.id}`} className={styles.row}>
      <div className={styles.left}>
        <div className={`${styles.icon} ${iconType}`}>
          <Icon size={18} />
        </div>

        <div>
          <p className={styles.name}>
            {t("tests.typeLabel", {
              type: t(`tests.${test.type}`, {
                defaultValue: test.type,
              }),
            })}
          </p>

          <p className={styles.date}>
            <Calendar size={12} />

            {new Date(test.createdAt).toLocaleDateString(locale)}
          </p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={`${styles.badge} ${resultData.className}`}>
          {resultData.label}
        </div>
      </div>
    </Link>
  );
}

export default TestListItem;
