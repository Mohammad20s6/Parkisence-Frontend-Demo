import { useState } from "react";
import styles from "./AddFaqModal.module.css";
import { useTranslation } from "react-i18next";

export default function AddFaqModal({ onClose, onAdd }) {
  const { t } = useTranslation();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!question.trim() || !answer.trim()) {
      setError(t("admin.faq.allFieldsRequired"));
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/admin/faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question,
          answer,
        }),
      });

      const data = await res.json();

      // ❗ Error handling واضح
      if (!res.ok) {
        throw new Error(data.message || t("admin.faq.failedAdd"));
      }

      // ✅ استخراج FAQ الحقيقي
      const newFaq = data?.data?.faq;

      if (!newFaq) {
        throw new Error("Invalid server response");
      }

      // 🔥 تحديث الجدول مباشرة بدون refetch
      onAdd(newFaq);

      onClose();
    } catch (err) {
      console.error("Add FAQ error:", err);
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

        <h2 className={styles.title}>{t("admin.faq.addModalTitle")}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>{t("admin.faq.labelQuestion")}</label>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t("admin.faq.placeholderQuestion")}
            />
          </div>

          <div className={styles.field}>
            <label>{t("admin.faq.labelAnswer")}</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t("admin.faq.placeholderAnswer")}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancel}>
              {t("common.cancel")}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submit}
            >
              {isSubmitting ? t("common.adding") : t("admin.faq.addFaqBtn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
