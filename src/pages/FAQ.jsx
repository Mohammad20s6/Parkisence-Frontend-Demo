import styles from "./FAQ.module.css";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Loading from "../components/ui/Loading";
import ErrorAlert from "../components/ui/ErrorAlert";

import { NavLink } from "react-router-dom";
import { CircleHelp, ChevronDown, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import faqService from "../api/faqService";
function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFaqs() {
      try {
        setIsLoading(true);
        setError("");

        const response = await faqService.getAll();

        setFaqs(response.data.data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFaqs();
  }, []);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />

      {/* تمت إضافة هذا الغلاف الرئيسي ليأخذ لون الخلفية بعرض الشاشة بالكامل */}
      <main className={styles.page}>
        <div className={styles.container}>
          {/* HEADER */}
          <div className={styles.header}>
            <span className={styles.badge}>
              <CircleHelp size={16} />
              {t("faqPage.badge")}
            </span>

            <h1 className={styles.title}>{t("faqPage.title")}</h1>

            <p className={styles.description}>{t("faqPage.description")}</p>
          </div>

          {/* Loading */}
          {isLoading && <Loading />}

          {/* Error */}
          {error && (
            <div className={styles.error}>
              <ErrorAlert error={error} />
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && faqs.length === 0 && (
            <div className={styles.emptyWrapper}>
              <div className={styles.emptyBox}>
                <div className={styles.emptyIcon}>
                  <CircleHelp size={30} />
                </div>

                <h2 className={styles.emptyTitle}>{t("faqPage.emptyTitle")}</h2>

                <p className={styles.emptyText}>{t("faqPage.emptyText")}</p>
              </div>
            </div>
          )}

          {/* FAQ LIST */}
          {!isLoading && !error && faqs.length > 0 && (
            <div className={styles.faqList}>
              {faqs.map((item, index) => (
                <div
                  key={item.id || item._id || index}
                  className={`${styles.faqItem} ${
                    openIndex === index ? styles.active : ""
                  }`}
                >
                  <button
                    className={styles.question}
                    onClick={() => toggleItem(index)}
                  >
                    <span>{item.question}</span>

                    <ChevronDown
                      size={18}
                      className={`${styles.icon} ${
                        openIndex === index ? styles.rotate : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`${styles.answerWrapper} ${
                      openIndex === index ? styles.open : ""
                    }`}
                  >
                    <p className={styles.answer}>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FEEDBACK SECTION */}
        <div className={styles.feedbackBox}>
          <div className={styles.feedbackCard}>
            <div className={styles.iconWrapper}>
              <MessageCircle size={28} />
            </div>

            <h3 className={styles.feedbackTitle}>
              {t("faqPage.stillQuestions")}
            </h3>

            <p className={styles.feedbackText}>
              {t("faqPage.stillQuestionsText")}
            </p>

            <NavLink to="/feedback" className={styles.feedbackBtn}>
              {t("faqPage.contactSupport")}
            </NavLink>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default FAQ;
