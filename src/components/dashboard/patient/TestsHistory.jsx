import styles from "./TestsHistory.module.css";

import { usePatientDashboard } from "../../../contexts/PatientDashboardContext";

import { useState, useMemo } from "react";

import SelectFilter from "../../ui/SelectFilter";
import RecentTests from "./RecentTests";
import TestListItem from "./TestListItem";

import { useTranslation } from "react-i18next";

function TestsHistory() {
  const { t } = useTranslation();

  const { allTests } = usePatientDashboard();

  const [typeFilter, setTypeFilter] = useState("all");

  const [resultFilter, setResultFilter] = useState("all");

  /* ============================= */
  /* ===== FILTER BY TYPE ======= */
  /* ============================= */

  const filteredTypeTests = useMemo(() => {
    if (typeFilter === "all") return allTests;

    return allTests.filter((test) => test.type === typeFilter);
  }, [allTests, typeFilter]);

  /* ============================= */
  /* ===== FILTER BY RESULT ===== */
  /* ============================= */

  const filteredTests = useMemo(() => {
    if (resultFilter === "all") return filteredTypeTests;

    if (resultFilter === "healthy") {
      return filteredTypeTests.filter((test) => test.result === "Healthy");
    }

    if (resultFilter === "parkinson") {
      return filteredTypeTests.filter((test) => test.result === "Parkinson");
    }

    if (resultFilter === "failed") {
      return filteredTypeTests.filter((test) => test.status === "failed");
    }

    return filteredTypeTests;
  }, [filteredTypeTests, resultFilter]);

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t("patient.testsHistory.title")}</h1>

          <p className={styles.subtitle}>
            {t("patient.testsHistory.subtitle")}
          </p>
        </div>

        <div className={styles.actions}>
          {/* FILTER BY TEST TYPE */}

          <SelectFilter
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              {
                value: "all",
                label: t("patient.testsHistory.filterAllTests"),
              },

              {
                value: "voice",
                label: t("patient.testsHistory.filterVoice"),
              },

              {
                value: "drawing",
                label: t("patient.testsHistory.filterDrawing"),
              },

              {
                value: "combined",
                label: t("patient.testsHistory.filterCombined"),
              },
            ]}
          />

          {/* FILTER BY RESULT */}

          <SelectFilter
            value={resultFilter}
            onChange={setResultFilter}
            options={[
              {
                value: "all",
                label: "All Results",
              },

              {
                value: "healthy",
                label: "Healthy",
              },

              {
                value: "parkinson",
                label: "Parkinson",
              },

              {
                value: "failed",
                label: "Failed",
              },
            ]}
          />
        </div>
      </div>

      <div className={styles.card}>
        {filteredTests.length > 0 ? (
          filteredTests.map((test) => (
            <TestListItem key={test.id} test={test} />
          ))
        ) : (
          <p className={styles.emptyMessage}>
            No tests found for selected filters.
          </p>
        )}
      </div>
    </section>
  );
}

export default TestsHistory;
