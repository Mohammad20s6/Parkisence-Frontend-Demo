import { Link, NavLink } from "react-router-dom";
import styles from "./CTA.module.css";
import { Sparkles, ArrowRight, Award, Shield, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

function CTA() {
  const { t } = useTranslation();
  return (
    <section className={styles.cta}>
      {/* Background layers */}
      <div className={styles.bgGradient} />
      <div className={styles.blobMain} />
      <div className={styles.blobSide} />
      <div className={styles.gridOverlay} />

      <div className={styles.container}>
        <div className={styles.content}>
          {/* Badge */}
          <div className={styles.badge}>
            <Sparkles size={16} />
            <span>{t("cta.badge")}</span>
          </div>

          {/* Title */}
          <h2 className={styles.title}>
            {t("cta.titleLead")}
            <span>{t("cta.titleHighlight")}</span>
          </h2>

          {/* Description */}
          <p className={styles.description}>{t("cta.description")}</p>

          {/* Actions */}
          {/* Actions */}
          <div className={styles.actions}>
            <NavLink to="/register" className={styles.primaryBtn}>
              {t("cta.startAssessment")} <ArrowRight size={20} />
            </NavLink>

            <NavLink to="/login" className={styles.secondaryBtn}>
              {t("cta.login")}
            </NavLink>
          </div>

          {/* Trust Indicators */}
          <div className={styles.trustGrid}>
            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                <Shield size={28} />
              </div>
              <p className={styles.trustTitle}>{t("cta.hipaaTitle")}</p>
              <span className={styles.trustText}>{t("cta.securePrivate")}</span>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                <Clock size={28} />
              </div>
              <p className={styles.trustTitle}>{t("cta.resultsMinutes")}</p>
              <span className={styles.trustText}>{t("cta.fastAnalysis")}</span>
            </div>

            <div className={styles.trustCard}>
              <div className={styles.trustIcon}>
                <Award size={28} />
              </div>
              <p className={styles.trustTitle}>{t("cta.clinicalTitle")}</p>
              <span className={styles.trustText}>{t("cta.researchBacked")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
