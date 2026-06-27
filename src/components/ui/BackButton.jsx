import styles from "./BackButton.module.css";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
function BackButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
        className={styles.btn}
      >
        <ArrowLeft size={16} />
        {t("common.back")}
      </button>
    </div>
  );
}

export default BackButton;
