import { AudioLines, Layers, PenTool } from "lucide-react";
import styles from "./Features.module.css";
import { useTranslation } from "react-i18next";
function Features() {
  const { t } = useTranslation();
  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{t("features.title")}</h2>
          <p className={styles.subtitle}>{t("features.subtitle")}</p>
        </div>

        {/* Cards */}
        <div className={styles.grid}>
          {/* Feature 1 */}
          <div className={styles.card}>
            <div className={`${styles.iconBox} ${styles.primary}`}>
              <AudioLines />
            </div>
            <h3>{t("features.voiceTitle")}</h3>
            <p>{t("features.voiceDesc")}</p>
          </div>

          {/* Feature 2 */}
          <div className={styles.card}>
            <div className={`${styles.iconBox} ${styles.accent}`}>
              <PenTool />
            </div>
            <h3>{t("features.drawingTitle")}</h3>
            <p>{t("features.drawingDesc")}</p>
          </div>

          {/* Feature 3 */}
          <div className={styles.card}>
            <div className={`${styles.iconBox} ${styles.success}`}>
              <Layers />
            </div>
            <h3>{t("features.combinedTitle")}</h3>
            <p>{t("features.combinedDesc")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
