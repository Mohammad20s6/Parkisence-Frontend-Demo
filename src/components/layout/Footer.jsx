import styles from "./Footer.module.css";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import { useTranslation } from "react-i18next";
function Footer() {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Top Grid */}
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Logo />

            <p className={styles.brandDesc}>{t("footer.brandDesc")}</p>
          </div>

          {/* Links */}
          <div>
            <h4 className={styles.title}>{t("footer.quickLinks")}</h4>
            <ul className={styles.list}>
              <li>
                <Link to="#" className={styles.link}>
                  {t("navbar.home")}
                </Link>
              </li>
              <li>
                <Link to="#" className={styles.link}>
                  {t("navbar.articles")}
                </Link>
              </li>
              <li>
                <Link to="#" className={styles.link}>
                  {t("navbar.faq")}
                </Link>
              </li>
              <li>
                <Link to="#" className={styles.link}>
                  {t("navbar.feedback")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Tests */}
          <div>
            <h4 className={styles.title}>{t("footer.ourTests")}</h4>
            <ul className={styles.list}>
              <li>
                <Link to="#" className={styles.link}>
                  {t("footer.voiceTest")}
                </Link>
              </li>
              <li>
                <Link to="#" className={styles.link}>
                  {t("footer.drawingTest")}
                </Link>
              </li>
              <li>
                <Link to="#" className={styles.link}>
                  {t("footer.combinedAnalysis")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={styles.title}>{t("footer.contact")}</h4>
            <ul className={styles.contactList}>
              <li>
                <Mail size={16} />
                {t("footer.email")}
              </li>
              <li>
                <Phone size={16} />
                {t("footer.phone")}
              </li>
              <li>
                <Phone size={16} />
                {t("footer.phone")}
              </li>
              <li>
                <MapPin size={16} />
                {t("footer.damascus")}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <p>{t("footer.copyright")}</p>

          <p className={styles.made}>
            {t("footer.madeWith")} <Heart size={14} />{" "}
            {t("footer.forBetterHealth")}
          </p>
          <div className={styles.legal}>
            <Link to="#" className={styles.link}>
              {t("footer.privacyPolicy")}
            </Link>
            <Link to="#" className={styles.link}>
              {t("footer.termsOfService")}
            </Link>{" "}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
