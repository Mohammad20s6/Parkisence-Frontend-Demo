import { useState } from "react";
import styles from "./AddArticleModal.module.css";
import { useTranslation } from "react-i18next";

export default function AddArticleModal({ onClose, onAdd }) {
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [link, setLink] = useState("");
  const [readTime, setReadTime] = useState("");
  const [featured, setFeatured] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    // ✅ Validation
    if (
      !title.trim() ||
      !content.trim() ||
      !summary.trim() ||
      !link.trim() ||
      !readTime
    ) {
      setError(t("admin.articles.allFieldsRequired"));
      return;
    }

    if (isNaN(readTime) || Number(readTime) < 1) {
      setError("Read time must be a valid number greater than 0");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/api/admin/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 نفس FAQ
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          summary: summary.trim(),
          source: link.trim(), // 👈 نفس الباك
          readTime: Number(readTime),
          featured,
        }),
      });

      const data = await res.json();

      // ❗ نفس أسلوب FAQ
      if (!res.ok) {
        throw new Error(data.message || t("admin.articles.failedAdd"));
      }

      // ✅ استخراج المقال الحقيقي
      const newArticle = data?.data?.article;

      if (!newArticle) {
        throw new Error("Invalid server response");
      }

      // 🔥 تحديث مباشر بدون refetch
      onAdd(newArticle);

      onClose();
    } catch (err) {
      console.error("Add Article error:", err);
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

        <h2 className={styles.title}>{t("admin.articles.addModalTitle")}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* TITLE */}
          <div className={styles.field}>
            <label>{t("admin.articles.labelTitle")}</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* CONTENT */}
          <div className={styles.field}>
            <label>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* SUMMARY */}
          <div className={styles.field}>
            <label>{t("admin.articles.labelSummary")}</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          {/* LINK */}
          <div className={styles.field}>
            <label>{t("admin.articles.labelLink")}</label>
            <input value={link} onChange={(e) => setLink(e.target.value)} />
          </div>

          {/* READ TIME + FEATURED */}
          <div className={styles.gridTwo}>
            <div className={styles.field}>
              <label>{t("admin.articles.labelReadTime")}</label>
              <input
                type="number"
                value={readTime}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 3) setReadTime(value); // 🔥 limit digits
                }}
              />
            </div>

            <div className={styles.fieldToggle}>
              <span className={styles.toggleLabel}>
                {featured ? "Featured Article" : "Normal Article"}
              </span>

              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
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
              {isSubmitting
                ? t("common.adding")
                : t("admin.articles.addArticleBtn")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
