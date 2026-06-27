import styles from "./PatientsFiltersSection.module.css";

import { Search, Users } from "lucide-react";

import { useTranslation } from "react-i18next";

function PatientsFiltersSection({ searchQuery, onSearchChange, resultsCount }) {
  const { t } = useTranslation();

  return (
    <div className={styles.card}>
      <div className={styles.wrapper}>
        {/* SEARCH */}

        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />

          <input
            type="text"
            placeholder={t("filters.searchNameEmail")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.input}
          />
        </div>

        {/* RESULTS COUNT */}

        <div className={styles.resultsBox}>
          <div className={styles.resultsIcon}>
            <Users size={18} />
          </div>

          <div className={styles.resultsContent}>
            <span className={styles.resultsLabel}>
              {t("admin.tables.totalPatients")}
              <span className={styles.resultsCount}>{resultsCount}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientsFiltersSection;
