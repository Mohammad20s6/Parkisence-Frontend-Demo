import styles from "./Logo.module.css";
import { Link as RouterLink } from "react-router-dom";

function Logo() {
  return (
    <RouterLink
      to="/"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={styles.logoLink}
    >
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          {/* تم تصحيح المسار هنا */}
          <img
            src="/imges/parkisense-logo-3.png"
            alt="ParkiSense Logo"
            className={styles.logoImg}
          />
        </div>
        <span className={styles.logoText}>
          Parki<span className={styles.secendColor}>Sense</span>
        </span>
      </div>
    </RouterLink>
  );
}

export default Logo;
