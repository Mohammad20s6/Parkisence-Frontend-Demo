import { useState, useEffect } from "react";
import styles from "./AddFaqModal.module.css";
import { useTranslation } from "react-i18next";

export default function EditFaqModal({ faq, onClose, onUpdate }) {
  const { t } = useTranslation();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ✅ تعبئة البيانات الحالية
  useEffect(() => {
    if (faq) {
      setQuestion(faq.question || "");
      setAnswer(faq.answer || "");
    }
  }, [faq]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!question || !answer) {
      setError(t("admin.faq.allFieldsRequired"));
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/admin/faqs/${faq._id}`,
        {
          method: "PATCH", // ✅ الأفضل
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ مهم
          },
          body: JSON.stringify({
            question,
            answer,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || t("admin.faq.failedUpdate"));
      }

      // 🔥 التعامل مع structure الباك
      const updatedFaq = data?.data?.faq || data?.data || data;

      // ✅ تحديث UI
      onUpdate(updatedFaq);

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        <h2 className={styles.title}>{t("admin.faq.editModalTitle")}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>{t("admin.faq.labelQuestion")}</label>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>{t("admin.faq.labelAnswer")}</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancel}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </button>

            <button
              type="submit"
              className={styles.submit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("common.saving")
                : t("admin.articles.saveChanges")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
