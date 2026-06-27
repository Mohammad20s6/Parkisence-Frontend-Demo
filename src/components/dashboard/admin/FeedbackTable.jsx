import styles from "./FeedbackTable.module.css";
import DataTable from "../../ui/DataTable";
import { Star, MessageSquare, Eye } from "lucide-react";
import { useState, useMemo } from "react";
import FeedbackModal from "./FeedbackModal";
import { useTranslation } from "react-i18next";

function FeedbackTable({ feedbacks }) {
  const { t } = useTranslation();
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name = "U") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const columns = useMemo(
    () => [
      {
        header: t("admin.feedback.tableUser"),
        render: (fb) => {
          const name = fb.user?.name || "Unknown User";
          const email = fb.user?.email || "-";

          return (
            <div className={styles.patientCell}>
              <div className={styles.avatar}>{getInitials(name)}</div>

              <div>
                <p className={styles.name}>{name}</p>
                <p className={styles.email}>{email}</p>
              </div>
            </div>
          );
        },
      },

      {
        header: t("admin.feedback.tableMessage"),
        render: (fb) => {
          const message = fb.message || "";

          return (
            <div className={styles.messageCell}>
              <MessageSquare size={14} className={styles.messageIcon} />
              <span className={styles.message}>
                {message.length > 40 ? message.slice(0, 40) + "..." : message}
              </span>
            </div>
          );
        },
      },

      {
        header: t("admin.feedback.tableRating"),
        render: (fb) => (
          <div className={styles.rating}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                fill="currentColor"
                className={
                  i < (fb.rating || 0) ? styles.starFilled : styles.starEmpty
                }
              />
            ))}
          </div>
        ),
      },

      {
        header: t("admin.feedback.tableDate"),
        render: (fb) => (
          <span className={styles.date}>{formatDate(fb.createdAt)}</span>
        ),
      },

      {
        header: t("admin.feedback.tableActions"),
        render: (fb) => (
          <button
            className={styles.viewBtn}
            onClick={() => setSelectedFeedback(fb)}
          >
            <Eye size={16} />
            {t("common.view")}
          </button>
        ),
      },
    ],
    [t],
  );

  return (
    <>
      <div className={styles.container}>
        <DataTable
          columns={columns}
          data={feedbacks}
          emptyKey="admin.feedback.noResults"
        />
      </div>

      {selectedFeedback && (
        <FeedbackModal
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}
    </>
  );
}

export default FeedbackTable;
