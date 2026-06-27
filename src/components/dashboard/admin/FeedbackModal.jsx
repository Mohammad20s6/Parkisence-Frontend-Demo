import styles from "./FeedbackModal.module.css";
import { X, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

function FeedbackModal({ feedback, onClose }) {
  const { t } = useTranslation();
  if (!feedback) return null;

  const name = feedback.user?.name || "Unknown User";
  const email = feedback.user?.email || "-";

  const formattedDate = feedback.createdAt
    ? new Date(feedback.createdAt).toLocaleString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.header}>
          <h3>{t("admin.feedback.modalTitle")}</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        {/* USER */}
        <div className={styles.user}>
          <p className={styles.name}>{name}</p>
          <p className={styles.email}>{email}</p>
        </div>

        {/* RATING */}
        <div className={styles.rating}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={18}
              fill="currentColor"
              className={
                i < (feedback.rating || 0)
                  ? styles.starFilled
                  : styles.starEmpty
              }
            />
          ))}
        </div>

        {/* MESSAGE */}
        <div className={styles.messageBox}>
          <p className={styles.message}>
            {feedback.message || "No message provided"}
          </p>
        </div>

        {/* DATE */}
        <p className={styles.date}>{formattedDate}</p>
      </div>
    </div>
  );
}

export default FeedbackModal;
