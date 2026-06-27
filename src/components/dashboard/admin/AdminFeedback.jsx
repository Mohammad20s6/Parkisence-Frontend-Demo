import styles from "./AdminFeedback.module.css";

import { Search, Star } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

import Loading from "../../ui/Loading";
import ErrorAlert from "../../ui/ErrorAlert";
import FeedbackTable from "./FeedbackTable";
import { useTranslation } from "react-i18next";

function AdminFeedback() {
  const { t } = useTranslation();

  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState("all");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const ratingOptions = useMemo(
    () => [
      { value: "all", label: "All Ratings" },
      { value: "5", label: "5 Stars" },
      { value: "4", label: "4 Stars" },
      { value: "3", label: "3 Stars" },
      { value: "2", label: "2 Stars" },
      { value: "1", label: "1 Star" },
    ],
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function fetchFeedbacks() {
      try {
        setIsLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized");

        const res = await fetch("http://localhost:3000/api/admin/feedbacks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch feedbacks");
        }

        const feedbackList = data.data.feedbacks || [];

        setFeedbacks(feedbackList);
        setFilteredFeedbacks(feedbackList);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeedbacks();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    let filtered = feedbacks;

    filtered = filtered.filter((item) => {
      const query = searchQuery.toLowerCase();

      return (
        item.message?.toLowerCase().includes(query) ||
        item.user?.name?.toLowerCase().includes(query) ||
        item.user?.email?.toLowerCase().includes(query)
      );
    });

    if (selectedRating !== "all") {
      filtered = filtered.filter(
        (item) => item.rating === Number(selectedRating),
      );
    }

    setFilteredFeedbacks(filtered);
  }, [searchQuery, selectedRating, feedbacks]);

  const totalFeedback = feedbacks.length;

  const avgRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((acc, cur) => acc + (cur.rating || 0), 0) /
          feedbacks.length
        ).toFixed(1)
      : 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.input}
            />
          </div>

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className={styles.select}
          >
            {ratingOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <p className={styles.statNumber}>{totalFeedback}</p>
            <span className={styles.statLabel}>Feedbacks</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.ratingRow}>
              <Star size={16} fill="currentColor" className={styles.star} />
              <p className={styles.statNumber}>{avgRating}</p>
            </div>
            <span className={styles.statLabel}>Avg Rating</span>
          </div>
        </div>
      </div>

      {isLoading && <Loading />}

      {error && (
        <div className={styles.error}>
          <ErrorAlert error={error} />
        </div>
      )}

      {!isLoading && !error && <FeedbackTable feedbacks={filteredFeedbacks} />}
    </div>
  );
}

export default AdminFeedback;
