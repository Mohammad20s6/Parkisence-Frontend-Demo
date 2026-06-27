import styles from "./Security.module.css";
import {
  ShieldIcon,
  LockIcon,
  EyeIcon,
  CircleCheckBig,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";

function Security() {
  const { t } = useTranslation();
  return (
    <section id="security" className={styles.security}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <ShieldIcon />
            <span>{t("security.badge")}</span>
          </div>

          <h2 className={styles.title}>{t("security.title")}</h2>
          <p className={styles.subtitle}>{t("security.subtitle")}</p>
        </div>

        {/* Cards */}
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.iconBox}>
              <LockIcon />
            </div>
            <h3>{t("security.encryptionTitle")}</h3>
            <p>{t("security.encryptionDesc")}</p>
          </div>

          <div className={styles.card}>
            <div className={styles.iconBox}>
              <ShieldIcon />
            </div>
            <h3>{t("security.hipaaTitle")}</h3>
            <p>{t("security.hipaaDesc")}</p>
          </div>

          <div className={styles.card}>
            <div className={styles.iconBox}>
              <EyeIcon />
            </div>
            <h3>{t("security.privacyTitle")}</h3>
            <p>{t("security.privacyDesc")}</p>
          </div>
        </div>

        {/* Certificates */}
        <div className={styles.certificates}>
          <span className={styles.cert}>
            <CircleCheckBig size={18} className={styles.check} />
            {t("security.certHipaa")}
          </span>
          <span className={styles.cert}>
            <CircleCheckBig size={18} className={styles.check} />
            {t("security.certSoc")}
          </span>
          <span className={styles.cert}>
            <CircleCheckBig size={18} className={styles.check} />
            {t("security.certIso")}
          </span>
          <span className={styles.cert}>
            <CircleCheckBig size={18} className={styles.check} />
            {t("security.certGdpr")}
          </span>
        </div>
      </div>
    </section>
  );
}

export default Security;
