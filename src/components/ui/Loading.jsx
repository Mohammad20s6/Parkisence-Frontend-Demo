import styles from "./Loading.module.css";
import { useTranslation } from "react-i18next";
function Loading({ onHandelCancel = null }) {
  const { t } = useTranslation();
  return (
    <div className={styles.overlay}>
      <div className={styles.loader}></div>
      {onHandelCancel && (
        <button className={styles.cancelButton} onClick={onHandelCancel}>
          {t("common.cancelUpper")}
        </button>
      )}
    </div>
  );
}

export default Loading;
