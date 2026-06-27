import styles from "./Articles.module.css";
import { Newspaper, MoveRight, X } from "lucide-react";
import { useEffect, useState } from "react";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Loading from "../components/ui/Loading";
import ErrorAlert from "../components/ui/ErrorAlert";

import { useTranslation } from "react-i18next";

function Articles() {
  const { t } = useTranslation();

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  // ✅ ESC close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedArticle(null);
    };

    if (selectedArticle) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selectedArticle]);

  // ✅ FETCH
  useEffect(() => {
    async function fetchArticles() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch("http://localhost:3000/api/articles");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || t("articlesPage.failedFetch"));
        }

        const articlesData = data?.data?.data || data?.data || data;

        if (!Array.isArray(articlesData)) {
          throw new Error("Invalid Articles data format");
        }
        console.log("this is art now :", articlesData);
        setArticles(articlesData);
      } catch (err) {
        console.error("Articles fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();
  }, [t]);

  // ✅ تقسيم البيانات
  const featured = articles.filter((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <span className={styles.badge}>
            <Newspaper size={16} />
            {t("articlesPage.badge")}
          </span>

          <h1 className={styles.title}>{t("articlesPage.title")}</h1>

          <p className={styles.description}>{t("articlesPage.description")}</p>
        </div>

        {/* Loading */}
        {isLoading && <Loading />}

        {/* Error */}
        {error && (
          <div className={styles.errore}>
            <ErrorAlert error={error} />
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && articles.length === 0 && (
          <div className={styles.emptyWrapper}>
            <div className={styles.emptyBox}>
              <div className={styles.emptyIcon}>
                <Newspaper size={32} />
              </div>

              <h2 className={styles.emptyTitle}>
                {t("articlesPage.emptyTitle")}
              </h2>

              <p className={styles.emptyText}>{t("articlesPage.emptyText")}</p>

              <button
                className={styles.retryBtn}
                onClick={() => window.location.reload()}
              >
                {t("common.refreshPage")}
              </button>
            </div>
          </div>
        )}

        {/* CONTENT */}
        {!isLoading && !error && articles.length > 0 && (
          <>
            {/* ✅ FEATURED LIST */}
            {featured.length > 0 && (
              <div className={styles.featuredWrapper}>
                {featured.map((article) => (
                  <div
                    key={article._id}
                    className={styles.featuredCard}
                    onClick={() => setSelectedArticle(article)}
                  >
                    <div className={styles.featuredContent}>
                      <div className={styles.tags}>
                        <span className={styles.featuredTag}>
                          {t("common.featured")}
                        </span>
                        {/* <span className={styles.category}>
                          {article.category}
                        </span> */}
                      </div>

                      <h2 className={styles.featuredTitle}>{article.title}</h2>

                      <p className={styles.featuredSummary}>
                        {article.summary}
                      </p>

                      <div className={styles.meta}>
                        <span>{article.readTime || "5 min"}</span>
                        <span>{t("common.bullet")}</span>
                        <span>{article.createdAt?.slice(0, 10)}</span>
                      </div>

                      <a
                        href={article.source || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.readBtn}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t("common.readFullArticle")}
                        <span className={styles.arrow}>
                          <MoveRight size={12} />
                        </span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* GRID */}
            <div className={styles.grid}>
              {rest.map((article) => (
                <div
                  key={article._id}
                  className={styles.card}
                  onClick={() => setSelectedArticle(article)}
                >
                  {/* <span className={styles.categorySmall}>
                    {article.category}
                  </span> */}

                  <h3 className={styles.cardTitle}>{article.title}</h3>

                  <p className={styles.cardSummary}>{article.summary}</p>

                  <div className={styles.cardFooter}>
                    <span>{article.readTime || "5 min"}</span>

                    <a
                      href={article.source || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.readMore}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {t("common.readMore")} <MoveRight size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* MODAL */}
        {selectedArticle && (
          <div
            className={styles.overlay}
            onClick={() => setSelectedArticle(null)}
          >
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.closeBtn}
                onClick={() => setSelectedArticle(null)}
              >
                <X size={20} />
              </button>

              <div className={styles.modalContent}>
                {/* <span className={styles.modalCategory}>
                  {selectedArticle.category}
                </span> */}

                <h2 className={styles.modalTitle}>{selectedArticle.title}</h2>

                <div className={styles.modalMeta}>
                  <span>{selectedArticle.readTime || "5 min"}</span>
                  <span>{t("common.bullet")}</span>
                  <span>{selectedArticle.createdAt?.slice(0, 10)}</span>
                </div>

                <p className={styles.modalSummary}>{selectedArticle.summary}</p>

                <div className={styles.modalAction}>
                  <a
                    href={selectedArticle.source || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.modalReadBtn}
                  >
                    {t("common.readFullArticle")}
                    <MoveRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Articles;
