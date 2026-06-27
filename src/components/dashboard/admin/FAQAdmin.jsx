import styles from "./FAQAdmin.module.css";

import Loading from "../../ui/Loading";
import ErrorAlert from "../../ui/ErrorAlert";

import {
  CircleHelp,
  ChevronDown,
  Pencil,
  Trash2,
  Search,
  Plus,
} from "lucide-react";

import { useEffect, useState } from "react";

import AddFaqModal from "./AddFaqModal";
import EditFaqModal from "./EditFaqModal";
import { useTranslation } from "react-i18next";

function FAQAdmin() {
  const { t } = useTranslation();

  const [openIndex, setOpenIndex] = useState(null);

  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedFaq, setSelectedFaq] = useState(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [successToastKey, setSuccessToastKey] = useState("");

  // ✅ FETCH REAL FAQS
  useEffect(() => {
    async function fetchFaqs() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch("http://localhost:3000/api/faqs");

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || t("admin.faq.failedFetch"));
        }

        const faqsData = data?.data?.data || data?.data || [];

        if (!Array.isArray(faqsData)) {
          throw new Error("Invalid FAQ data format");
        }

        setFaqs(faqsData);
        setFilteredFaqs(faqsData);
      } catch (err) {
        console.error("Fetch FAQ error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFaqs();
  }, [t]);

  // ✅ SEARCH
  useEffect(() => {
    const filtered = faqs.filter((faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setFilteredFaqs(filtered);
  }, [searchQuery, faqs]);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // ✅ DELETE
  const openDeleteModal = (faq) => {
    setSelectedFaq(faq);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedFaq(null);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:3000/api/admin/faqs/${selectedFaq._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || t("admin.faq.failedDelete"));
      }

      // ✅ تحديث مباشر
      setFaqs((prev) => prev.filter((faq) => faq._id !== selectedFaq._id));

      setSuccessToastKey("toastDeleted");

      setOpenIndex(null);
      closeDeleteModal();

      setTimeout(() => {
        setSuccessToastKey("");
      }, 3000);
    } catch (err) {
      console.error("Delete FAQ error:", err);
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // ✅ EDIT
  const handleEdit = (faq) => {
    setSelectedFaq(faq);
    setShowEditModal(true);
  };

  return (
    <>
      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.pageHeader}>
          <span className={styles.badge}>
            <CircleHelp size={16} />
            {t("admin.panelBadge")}
          </span>

          <h1 className={styles.title}>{t("admin.faq.title")}</h1>

          <p className={styles.description}>{t("admin.faq.description")}</p>
        </div>

        {/* CONTROL */}
        <div className={styles.header}>
          <div className={styles.left}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />

              <input
                type="text"
                placeholder={t("admin.faq.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.counter}>
              <span>{filteredFaqs.length}</span>
              <p>{t("admin.faq.faqsCount")}</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className={styles.addBtn}
          >
            <Plus size={18} />
            <span>{t("admin.faq.addFaq")}</span>
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
        {!isLoading && !error && filteredFaqs.length === 0 && (
          <div className={styles.emptyWrapper}>
            <div className={styles.emptyBox}>
              <div className={styles.emptyIcon}>
                <CircleHelp size={30} />
              </div>

              <h2 className={styles.emptyTitle}>{t("admin.faq.emptyTitle")}</h2>

              <p className={styles.emptyText}>{t("admin.faq.emptyText")}</p>
            </div>
          </div>
        )}

        {/* LIST */}
        {!isLoading && !error && filteredFaqs.length > 0 && (
          <div className={styles.faqList}>
            {filteredFaqs.map((item, index) => (
              <div
                key={item._id}
                className={`${styles.faqItem} ${
                  openIndex === index ? styles.active : ""
                }`}
              >
                <div className={styles.row}>
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

                  <div className={styles.actions}>
                    <button
                      className={styles.editBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item);
                      }}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(item);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

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

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{t("admin.faq.deleteTitle")}</h2>
              <p>{t("admin.faq.deleteConfirm")}</p>
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
        <AddFaqModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newFaq) => {
            setFaqs((prev) => [newFaq, ...prev]);

            setSuccessToastKey("toastAdded");

            setTimeout(() => {
              setSuccessToastKey("");
            }, 3000);
          }}
        />
      )}

      {/* EDIT */}
      {showEditModal && (
        <EditFaqModal
          faq={selectedFaq}
          onClose={() => {
            setShowEditModal(false);
            setSelectedFaq(null);
          }}
          onUpdate={(updatedFaq) => {
            setFaqs((prev) =>
              prev.map((faq) =>
                faq._id === updatedFaq._id ? updatedFaq : faq,
              ),
            );

            setSuccessToastKey("toastUpdated");

            setTimeout(() => {
              setSuccessToastKey("");
            }, 3000);
          }}
        />
      )}

      {/* SUCCESS */}
      {successToastKey && (
        <div className={styles.successToast}>
          {t(`admin.faq.${successToastKey}`)}
        </div>
      )}
    </>
  );
}

export default FAQAdmin;
