import styles from "./QuickActions.module.css";
import { NavLink } from "react-router-dom";
import { Mic, PenTool, Layers, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

function QuickActions() {
  const { t } = useTranslation();
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{t("patient.quickActions.heading")}</h2>

      <div className={styles.container}>
        <TestCard
          to="voice-test"
          icon={Mic}
          title={t("patient.quickActions.voiceTitle")}
          description={t("patient.quickActions.voiceDesc")}
          type="primary"
        />

        <TestCard
          to="drawing-test"
          icon={PenTool}
          title={t("patient.quickActions.drawingTitle")}
          description={t("patient.quickActions.drawingDesc")}
          type="accent"
        />

        <TestCard
          to="#"
          icon={Layers}
          title={t("patient.quickActions.combinedTitle")}
          description={t("patient.quickActions.combinedDesc")}
          type="success"
        />
      </div>
    </section>
  );
}

function TestCard({ icon: Icon, title, description, to, type = "primary" }) {
  const iconType =
    type === "primary"
      ? styles.primary
      : type === "accent"
        ? styles.accent
        : styles.success;
  return (
    <NavLink to={to} className={styles.card}>
      <div className={`${styles.iconWrapper} ${iconType}`}>
        <Icon size={26} />
      </div>

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      <div className={styles.arrow}>
        <ArrowRight size={18} />
      </div>
    </NavLink>
  );
}

export default QuickActions;
