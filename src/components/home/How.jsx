import styles from "./How.module.css";
import { UserPlus, Mic, BarChart3, FileCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

function How() {
  const { t } = useTranslation();
  return (
    <section id="how" className={styles.how}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{t("how.title")}</h2>
          <p className={styles.subtitle}>{t("how.subtitle")}</p>
        </div>

        {/* Timeline line */}
        <div className={styles.timelineWrapper}>
          <div className={styles.timeline}></div>

          {/* Steps */}
          <div className={styles.grid}>
            {/* Step 1 */}
            <div className={styles.step} style={{ animationDelay: "0s" }}>
              <div className={styles.card}>
                <span className={styles.stepNumber}>01</span>
                <div className={styles.iconBox}>
                  <UserPlus />
                </div>
                <h3>{t("how.step1Title")}</h3>
                <p>{t("how.step1Desc")}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={styles.step} style={{ animationDelay: "0.15s" }}>
              <div className={styles.card}>
                <span className={styles.stepNumber}>02</span>
                <div className={styles.iconBox}>
                  <Mic />
                </div>
                <h3>{t("how.step2Title")}</h3>
                <p>{t("how.step2Desc")}</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={styles.step} style={{ animationDelay: "0.3s" }}>
              <div className={styles.card}>
                <span className={styles.stepNumber}>03</span>
                <div className={styles.iconBox}>
                  <BarChart3 />
                </div>
                <h3>{t("how.step3Title")}</h3>
                <p>{t("how.step3Desc")}</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className={styles.step} style={{ animationDelay: "0.45s" }}>
              <div className={styles.card}>
                <span className={styles.stepNumber}>04</span>
                <div className={styles.iconBox}>
                  <FileCheck />
                </div>
                <h3>{t("how.step4Title")}</h3>
                <p>{t("how.step4Desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default How;
