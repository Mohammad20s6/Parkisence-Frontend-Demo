import styles from "./PatientDashboard.module.css";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { usePatientDashboard } from "../contexts/PatientDashboardContext.jsx";

import ErrorAlert from "../components/ui/ErrorAlert.jsx";
import Loading from "../components/ui/Loading.jsx";
import StatsCards from "../components/dashboard/patient/StatsCards";
import QuickActions from "../components/dashboard/patient/QuickActions";
import RecentTests from "../components/dashboard/patient/RecentTests";
import HealthSummary from "../components/dashboard/patient/HealthSummary";
import { useTranslation } from "react-i18next";

function PatientDashboard() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const { stats, allTests, recentTests, isLoading, error } =
    usePatientDashboard();

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>
            {t("patient.dashboard.welcome", { name: user.name })}
          </h1>

          <p className={styles.subtitle}>{t("patient.dashboard.subtitle")}</p>
        </div>
        {error && error !== "no data" && (
          <div className={styles.error}>
            <ErrorAlert error={error} />
          </div>
        )}
        <StatsCards stats={stats} />
        <div className={styles.sectionsGrid}>
          <div className={styles.leftColumn}>
            <QuickActions />
            <RecentTests tests={recentTests} />
          </div>
          <HealthSummary />
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
}

export default PatientDashboard;
