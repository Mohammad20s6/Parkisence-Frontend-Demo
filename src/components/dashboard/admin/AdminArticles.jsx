import styles from "./AdminArticles.module.css";

import Loading from "../../ui/Loading";
import ErrorAlert from "../../ui/ErrorAlert";

import { Newspaper, Pencil, Trash2, Search, Plus } from "lucide-react";

import { useEffect, useState } from "react";

import AddArticleModal from "./AddArticleModal";
import EditArticleModal from "./EditArticleModal";
import { useTranslation } from "react-i18next";

function AdminArticles() {
  const { t } = useTranslation();

  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedArticle, setSelectedArticle] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [successToastKey, setSuccessToastKey] = useState("");

  // ✅ FETCH (مثل صفحة المستخدم)
  useEffect(() => {
    async function fetchArticles() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch("http://localhost:3000/api/articles");

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || t("admin.articles.failedFetch"));
        }

        const articlesData = data?.data?.data || data?.data || data;

        if (!Array.isArray(articlesData)) {
          throw new Error("Invalid Articles data format");
        }

        setArticles(articlesData);
        setFilteredArticles(articlesData);
      } catch (err) {
        console.error("Admin Articles fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticles();
  }, [t]);

  // ✅ SEARCH
  useEffect(() => {
    const filtered = articles.filter((article) =>
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setFilteredArticles(filtered);
  }, [searchQuery, articles]);

  // ✅ DELETE
  const openDeleteModal = (article) => {
    setSelectedArticle(article);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedArticle(null);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/admin/articles/${selectedArticle._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || t("admin.articles.failedDelete"));
      }

      // ✅ تحديث فوري
      setArticles((prev) => prev.filter((a) => a._id !== selectedArticle._id));

      setSuccessToastKey("toastDeleted");
      closeDeleteModal();

      setTimeout(() => setSuccessToastKey(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // ✅ EDIT
  const handleEdit = (article) => {
    setSelectedArticle(article);
    setShowEditModal(true);
  };

  return (
    <>
      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.pageHeader}>
          <span className={styles.badge}>
            <Newspaper size={16} />
            {t("admin.panelBadge")}
          </span>

          <h1 className={styles.title}>{t("admin.articles.title")}</h1>

          <p className={styles.description}>
            {t("admin.articles.description")}
          </p>
        </div>

        {/* CONTROLS */}
        <div className={styles.header}>
          <div className={styles.left}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input
                type="text"
                placeholder={t("admin.articles.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.counter}>
              <span>{filteredArticles.length}</span>
              <p>{t("admin.articles.articlesCount")}</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className={styles.addBtn}
          >
            <Plus size={18} />
            <span>{t("admin.articles.addArticle")}</span>
          </button>
        </div>

        {/* Loading */}
        {isLoading && <Loading />}

        {/* Error */}
        {error && (
          <div className={styles.error}>
            <ErrorAlert error={error} />
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && !error && filteredArticles.length === 0 && (
          <div className={styles.emptyWrapper}>
            <div className={styles.emptyBox}>
              <div className={styles.emptyIcon}>
                <Newspaper size={30} />
              </div>

              <h2 className={styles.emptyTitle}>
                {t("admin.articles.emptyTitle")}
              </h2>

              <p className={styles.emptyText}>
                {t("admin.articles.emptyText")}
              </p>
            </div>
          </div>
        )}

        {/* LIST */}
        {!isLoading && !error && filteredArticles.length > 0 && (
          <div className={styles.grid}>
            {filteredArticles.map((article) => (
              <div key={article._id} className={styles.card}>
                <div className={styles.cardHeader}>
                  {/* <span className={styles.category}>
                    {article.source || "General"}
                  </span> */}

                  <div className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(article)}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className={styles.deleteBtn}
                      onClick={() => openDeleteModal(article)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className={styles.titleCard}>{article.title}</h3>

                <p className={styles.summary}>{article.summary}</p>

                <div className={styles.meta}>
                  <span>{article.readTime || 5} min</span>
                  <span>{t("common.bullet")}</span>
                  <span>{article.createdAt?.slice(0, 10)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{t("admin.articles.deleteTitle")}</h2>
              <p>{t("admin.articles.deleteConfirm")}</p>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                {t("common.cancel")}
              </button>

              <button
                className={styles.deleteConfirmBtn}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? t("common.deleting") : t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD */}
      {showAddModal && (
        <AddArticleModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newArticle) => {
            setArticles((prev) => [...prev, newArticle]);
            setSuccessToastKey("toastAdded");

            setTimeout(() => setSuccessToastKey(""), 3000);
          }}
        />
      )}

      {/* EDIT */}
      {showEditModal && (
        <EditArticleModal
          article={selectedArticle}
          onClose={() => {
            setShowEditModal(false);
            setSelectedArticle(null);
          }}
          onUpdate={(updatedArticle) => {
            setArticles((prev) =>
              prev.map((a) =>
                a._id === updatedArticle._id ? updatedArticle : a,
              ),
            );

            setSuccessToastKey("toastUpdated");

            setTimeout(() => setSuccessToastKey(""), 3000);
          }}
        />
      )}

      {/* SUCCESS */}
      {successToastKey && (
        <div className={styles.successToast}>
          {t(`admin.articles.${successToastKey}`)}
        </div>
      )}
    </>
  );
}

export default AdminArticles;
