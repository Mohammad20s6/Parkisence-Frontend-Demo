import styles from "./RecentActivitySection.module.css";

import { Link } from "react-router-dom";

import { Mic, PenTool, Layers } from "lucide-react";

import { useTranslation } from "react-i18next";

import { useEffect, useState } from "react";

function RecentActivitySection() {
  const { t } = useTranslation();

  const [recentTests, setRecentTests] = useState([]);

  const [recentPatients, setRecentPatients] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchRecentActivity() {
      try {
        setIsLoading(true);

        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Unauthorized");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // =========================
        // Fetch Tests + Patients
        // =========================

        const [testsResponse, patientsResponse] = await Promise.all([
          fetch("http://127.0.0.1:3000/api/admin/tests", {
            method: "GET",
            headers,
            signal: controller.signal,
          }),

          fetch("http://127.0.0.1:3000/api/admin/patients", {
            method: "GET",
            headers,
            signal: controller.signal,
          }),
        ]);

        const testsData = await testsResponse.json();

        const patientsData = await patientsResponse.json();

        if (!testsResponse.ok) {
          throw new Error(testsData.message || "Failed to fetch recent tests");
        }

        if (!patientsResponse.ok) {
          throw new Error(
            patientsData.message || "Failed to fetch recent patients",
          );
        }

        // =========================
        // Create Patients Map
        // =========================

        const patientsMap = {};

        (patientsData.data.patients || []).forEach((patient) => {
          patientsMap[patient._id] = {
            name: patient.user?.name || "Unknown Patient",
            email: patient.user?.email || "No Email",
          };
        });

        // =========================
        // Last 3 Tests
        // =========================

        const latestTests = (testsData.data.tests || [])
          .slice(0, 3)
          .map((test) => {
            const patientId =
              typeof test.patient === "string"
                ? test.patient
                : test.patient?._id;

            const patientData = patientsMap[patientId];

            return {
              id: test._id,

              patientName: patientData?.name || "Unknown Patient",

              type: test.testType || "combined",

              result: test.result || "Unknown",

              date: new Date(test.createdAt).toLocaleDateString(),

              status: test.result === "Healthy" ? "healthy" : "parkinson",
            };
          });

        // =========================
        // Last 3 Patients
        // =========================

        const latestPatients = (patientsData.data.patients || [])
          .slice(0, 3)
          .map((patient) => ({
            id: patient._id,

            name: patient.user?.name || "Unknown",

            email: patient.user?.email || "No Email",
          }));

        setRecentTests(latestTests);

        setRecentPatients(latestPatients);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Recent activity error:", err);

          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentActivity();

    return () => controller.abort();
  }, []);

  const getResultClass = (status) => {
    if (status === "healthy") return styles.low;

    return styles.high;
  };

  const getResultText = (result) => {
    if (result === "Healthy") {
      return t("admin.results.healthy");
    }

    return t("admin.results.parkinson");
  };

  const getTestIcon = (type) => {
    if (type === "voice") return <Mic size={18} />;

    if (type === "drawing") return <PenTool size={18} />;

    return <Layers size={18} />;
  };

  const getTestIconClass = (type) => {
    if (type === "voice") return styles.voiceIcon;

    if (type === "drawing") return styles.drawingIcon;

    return styles.combinedIcon;
  };

  if (isLoading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <section className={styles.wrapper}>
      {/* =========================
          Recent Tests
      ========================= */}

      <div className={styles.card}>
        <div className={styles.header}>
          <h3>{t("admin.recentActivity.recentTests")}</h3>

          <Link to="/admin/results">{t("common.viewAll")}</Link>
        </div>

        <div className={styles.list}>
          {recentTests.map((test) => (
            <div key={test.id} className={styles.item}>
              <div
                className={`${styles.iconBox} ${getTestIconClass(test.type)}`}
              >
                {getTestIcon(test.type)}
              </div>

              <div className={styles.info}>
                <p className={styles.name}>{test.patientName}</p>

                <p className={styles.meta}>
                  {t("admin.activity.testMeta", {
                    typeLabel: t("tests.typeLabel", {
                      type: t(`tests.${test.type}`),
                    }),

                    date: test.date,
                  })}
                </p>
              </div>

              <div className={styles.result}>
                <span
                  className={`${styles.badge} ${getResultClass(test.status)}`}
                >
                  {getResultText(test.result)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          Recent Patients
      ========================= */}

      <div className={styles.card}>
        <div className={styles.header}>
          <h3>{t("admin.recentActivity.recentPatients")}</h3>

          <Link to="/admin/patients">{t("common.viewAll")}</Link>
        </div>

        <div className={styles.list}>
          {recentPatients.map((patient) => (
            <div key={patient.id} className={styles.item}>
              <div className={styles.avatar}>
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div className={styles.info}>
                <p className={styles.name}>{patient.name}</p>

                <p className={styles.meta}>{patient.email}</p>
              </div>

              {/* <div className={styles.result}>
                <span className={`${styles.badge} ${styles.low}`}>
                  {t("admin.recentActivity.newPatient")}
                </span>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecentActivitySection;
