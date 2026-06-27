import styles from "./TestsFiltersSection.module.css";
import { Search } from "lucide-react";
import SelectFilter from "../../../ui/SelectFilter";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

function TestsFiltersSection({
  searchQuery,
  onSearchChange,

  resultFilter,
  onResultChange,

  typeTest,
  onTypeChange,
}) {
  const { t } = useTranslation();

  const resultOptions = useMemo(
    () => [
      { value: "all", label: t("admin.results.allResults") },
      { value: "healthy", label: t("admin.results.healthy") },
      { value: "parkinson", label: t("admin.results.parkinson") },
    ],
    [t],
  );

  const typeOptions = useMemo(
    () => [
      { value: "all", label: t("admin.filters.allTests") },

      { value: "voice", label: t("admin.filters.voiceTest") },

      { value: "drawing", label: t("admin.filters.drawingTest") },

      { value: "combined", label: t("admin.filters.combinedTest") },
    ],
    [t],
  );

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

        {/* FILTERS */}

        <div className={styles.filters}>
          <SelectFilter
            value={resultFilter}
            onChange={onResultChange}
            options={resultOptions}
          />

          <SelectFilter
            value={typeTest}
            onChange={onTypeChange}
            options={typeOptions}
          />
        </div>
      </div>
    </div>
  );
}

export default TestsFiltersSection;
