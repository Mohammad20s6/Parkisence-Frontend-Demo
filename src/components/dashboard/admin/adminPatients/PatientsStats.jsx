import styles from "./PatientsStats.module.css";
import { Users, ShieldCheck, AlertTriangle, Siren } from "lucide-react";
import { useTranslation } from "react-i18next";

function PatientsStats({ patients = [] }) {
  const { t } = useTranslation();
  const totalPatients = patients.length;

  const lowRisk = patients.filter((p) => p.riskLevel === "low").length;

  const moderateRisk = patients.filter(
    (p) => p.riskLevel === "moderate",
  ).length;

  const highRisk = patients.filter((p) => p.riskLevel === "high").length;

  return (
    <div className={styles.grid}>
      {/* TOTAL */}
      <div className={styles.card}>
        <div className={styles.iconTotal}>
          <Users size={18} />
        </div>

        <p className={styles.totalNumber}>
          {totalPatients ? totalPatients : "-"}
        </p>
        <p className={styles.label}>{t("admin.stats.totalPatients")}</p>
      </div>

      {/* LOW */}
      <div className={styles.card}>
        <div className={styles.iconLow}>
          <ShieldCheck size={18} />
        </div>

        <p className={styles.lowNumber}>{lowRisk ? lowRisk : "-"}</p>
        <p className={styles.label}>{t("admin.stats.lowRisk")}</p>
      </div>

      {/* MODERATE */}
      <div className={styles.card}>
        <div className={styles.iconModerate}>
          <AlertTriangle size={18} />
        </div>

        <p className={styles.moderateNumber}>
          {moderateRisk ? moderateRisk : "-"}
        </p>
        <p className={styles.label}>{t("admin.stats.moderateRisk")}</p>
      </div>

      {/* HIGH */}
      <div className={styles.card}>
        <div className={styles.iconHigh}>
          <Siren size={18} />
        </div>

        <p className={styles.highNumber}>{highRisk ? highRisk : "-"}</p>
        <p className={styles.label}>{t("admin.stats.highRisk")}</p>
      </div>
    </div>
  );
}

export default PatientsStats;
