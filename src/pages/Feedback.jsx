import styles from "./Feedback.module.css";
import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import { MessageSquare } from "lucide-react";

import Loading from "../components/ui/Loading";
import ErrorAlert from "../components/ui/ErrorAlert";

import { useTranslation } from "react-i18next";

function Feedback() {
  const { t } = useTranslation();

  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [abortController, setAbortController] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ VALIDATION
    if (!message.trim()) {
      setError("Feedback message is required");
      return;
    }

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    const controller = new AbortController();
    setAbortController(controller);

    try {
      setIsSubmitting(true);
      setSubmitStatus(null);
      setError("");

      // ✅ TOKEN
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You must login first");
      }

      // ✅ API CALL
      const res = await fetch("http://localhost:3000/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: message.trim(),
          rating: Number(rating), // ✅ مهم جدا
        }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send feedback");
      }

      console.log("Feedback created:", data);

      // ✅ SUCCESS
      setSubmitStatus("success");

      // ✅ RESET
      setRating(0);
      setMessage("");
    } catch (err) {
      console.error("Feedback error:", err);

      if (err.name === "AbortError") {
        console.log("Request cancelled");
      } else {
        setSubmitStatus("error");
        setError(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ CANCEL REQUEST
  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <Navbar />

      {/* LOADING */}
      {isSubmitting && <Loading onHandelCancel={handleCancel} />}

      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <MessageSquare size={16} />
            {t("feedbackPage.badge")}
          </div>

          <h1 className={styles.title}>{t("feedbackPage.title")}</h1>

          <p className={styles.description}>{t("feedbackPage.description")}</p>
        </div>

        {/* CARD */}
        <div className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* RATING */}
            <div className={styles.field}>
              <label>{t("feedbackPage.rateQuestion")}</label>

              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${styles.star} ${
                      star <= rating ? styles.activeStar : ""
                    }`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* MESSAGE */}
            <div className={styles.field}>
              <label>{t("feedbackPage.yourFeedback")}</label>

              <textarea
                rows="6"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("feedbackPage.placeholder")}
                required
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className={styles.errorBox}>
                <ErrorAlert error={error} />
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("common.sending") : t("feedbackPage.submit")}
            </button>
          </form>
        </div>

        {/* SUCCESS */}
        {submitStatus === "success" && (
          <div className={styles.successBox}>{t("feedbackPage.success")}</div>
        )}

        {/* ERROR */}
        {submitStatus === "error" && error && (
          <div className={styles.errorBox}>{error}</div>
        )}

        {/* NOTE */}
        <div className={styles.note}>{t("feedbackPage.note")}</div>
      </div>

      <Footer />
    </div>
  );
}

export default Feedback;
