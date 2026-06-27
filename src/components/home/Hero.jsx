// src/components/Hero/Hero.jsx
import styles from "./Hero.module.css";
import { Shield, ArrowRight, AudioLines, PenTool } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useTranslation } from "react-i18next";

function Hero() {
  const { t } = useTranslation();
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* ========= LEFT CONTENT ========= */}
          <div className={styles.content}>
            {/* Badge */}
            <div className={styles.badge}>
              <Shield size={16} />
              <span>{t("hero.badge")}</span>
            </div>

            {/* Title */}
            <h1 className={styles.title}>
              {t("hero.titleLead")}{" "}
              <span className={styles.gradientText}>
                {t("hero.titleHighlight")}
              </span>
            </h1>

            {/* Description */}
            <p className={styles.description}>{t("hero.description")}</p>

            {/* Actions */}
            <div className={styles.actions}>
              <NavLink to="/register" className={styles.primaryBtn}>
                {t("hero.startAssessment")} <ArrowRight size={20} />
              </NavLink>
              <ScrollLink
                to="features"
                spy
                smooth
                offset={-80}
                duration={500}
                className={styles.secondaryBtn}
              >
                {t("hero.learnMore")}
              </ScrollLink>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
              <div>
                <p className={styles.statValue}>98%</p>
                <p className={styles.statLabel}>{t("hero.accuracyRate")}</p>
              </div>
              <div>
                <p className={styles.statValue}>50K+</p>
                <p className={styles.statLabel}>{t("hero.testsAnalyzed")}</p>
              </div>
              <div>
                <p className={styles.statValue}>24/7</p>
                <p className={styles.statLabel}>{t("hero.available")}</p>
              </div>
            </div>
          </div>

          {/* ========= RIGHT VISUAL ========= */}
          <div className={styles.visual}>
            <div className={styles.brainWrapper}>
              <div className={styles.brainGlow}></div>
              <div className={styles.brainGrid}></div>

              {/* تم تصحيح المسار هنا */}
              <div className={styles.brainCore}>
                <img
                  src="/imges/parkisense-logo-3.png"
                  alt="ParkiSense AI Analysis"
                  className={styles.heroMainImg}
                />
              </div>
            </div>

            {/* Floating card */}
            <div className={`${styles.floatingCard} ${styles.voice}`}>
              <div className={styles.icon}>
                <AudioLines />
              </div>
              <div className={styles.cardText}>
                <p>{t("hero.voiceAnalysis")}</p>
                <span>{t("hero.accuracyVoice")}</span>
              </div>
            </div>
            <div className={`${styles.floatingCard} ${styles.drawing}`}>
              <div className={styles.icon}>
                <PenTool />
              </div>
              <div className={styles.cardText}>
                <p>{t("hero.drawingAnalysis")}</p>
                <span>{t("hero.accuracyDrawing")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
