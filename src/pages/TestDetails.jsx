import styles from "./TestDetails.module.css";
import {
  Download,
  Heart,
  AlertTriangle,
  Stethoscope,
  XCircle,
  Info, // 👈 أضفنا أيقونة للمعلومات
} from "lucide-react";
import { useParams, useLocation } from "react-router-dom"; // 👈 استيراد useLocation
import { useEffect, useRef, useState } from "react";

import Loading from "../components/ui/Loading";
import Errore from "../components/ui/ErrorAlert";
import BackButton from "../components/ui/BackButton";

import { useTranslation } from "react-i18next";

function TestDetails() {
  const { t, i18n } = useTranslation();
  const { testId } = useParams();
  const location = useLocation(); // 👈 تهيئة الـ location لالتقاط الـ state

  // استخراج بيانات التكرار إن وجدت
  const isDuplicate = location.state?.isDuplicate;
  const duplicateMessage = location.state?.duplicateMessage;

  const [test, setTest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const downloadAbortRef = useRef(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        setIsLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Unauthorized");
        }

        const response = await fetch(
          `http://127.0.0.1:3000/api/tests/my-tests/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || t("testDetails.notFound"));
        }

        setTest(result.data.test);
      } catch (err) {
        console.error("Fetch test details error:", err);
        setError(err.message || t("testDetails.notFound"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTest();
  }, [testId, t]);

  const locale = i18n.language === "ar" ? "ar-SY" : "en-GB";

  const formattedDate = test?.createdAt
    ? new Date(test.createdAt).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const isFailed = test?.status === "failed";
  const isHealthy = test?.result === "Healthy";

  let resultLabel = "";

  if (isFailed) {
    resultLabel = t("testDetails.failed");
  } else if (isHealthy) {
    resultLabel = t("testDetails.healthy");
  } else {
    resultLabel = t("testDetails.parkinson");
  }

  const adviceMessage =
    typeof test?.advice === "string"
      ? test.advice
      : test?.advice?.message ||
        (isFailed
          ? t("testDetails.failedAdvice")
          : isHealthy
            ? t("testDetails.defaultHealthyAdvice")
            : t("testDetails.defaultParkinsonAdvice"));

  const resultConfig = {
    failed: {
      icon: <XCircle size={24} strokeWidth={1.8} />,
      bgClass: styles.failedBg,
      textClass: styles.failedText,
    },
    healthy: {
      icon: <Heart size={24} strokeWidth={1.8} />,
      bgClass: styles.healthyBg,
      textClass: styles.healthyText,
    },
    parkinson: {
      icon: <AlertTriangle size={24} strokeWidth={1.8} />,
      bgClass: styles.parkinsonBg,
      textClass: styles.parkinsonText,
    },
  };

  const currentResult = isFailed
    ? resultConfig.failed
    : isHealthy
      ? resultConfig.healthy
      : resultConfig.parkinson;

  /* ================================= */
  /* ========= DOWNLOAD PDF ========== */
  /* ================================= */

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      setDownloadError("");

      downloadAbortRef.current = new AbortController();
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Unauthorized");
      }

      const response = await fetch(
        `http://127.0.0.1:3000/api/tests/${testId}/pdf`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: downloadAbortRef.current.signal,
        },
      );

      if (!response.ok) {
        throw new Error(t("testDetails.failedDownload"));
      }

      const blob = await response.blob();
      const fileURL = window.URL.createObjectURL(blob);

      const contentDisposition = response.headers.get("content-disposition");
      let fileName = `test-${testId}.pdf`;

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch?.[1]) {
          fileName = fileNameMatch[1];
        }
      }

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(fileURL);
    } catch (err) {
      if (err.name === "AbortError") return;

      if (
        err.message &&
        (err.message.includes("Failed to fetch") ||
          err.message.includes("NetworkError"))
      ) {
        console.warn("تم التقاط التحميل بواسطة برنامج خارجي (مثل IDM).");
        setDownloadError("");
        return;
      }

      console.error("Download PDF error:", err);
      setDownloadError(err.message || t("testDetails.failedDownload"));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCancelDownload = () => {
    downloadAbortRef.current?.abort();
  };

  if (isLoading) return <Loading />;
  if (error) return <Errore error={error} />;

  return (
    <>
      {isDownloading && <Loading onHandelCancel={handleCancelDownload} />}

      <div className={styles.page}>
        <div className={styles.backBtn}>
          <BackButton />
        </div>

        {/*  مكون التنبيه يظهر فقط في حال كان الملف مكرراً  */}
        {isDuplicate && (
          <div className={styles.duplicateAlert}>
            <div className={styles.duplicateIconWrapper}>
              <Info size={26} strokeWidth={2} />
            </div>
            <div className={styles.duplicateContent}>
              <h3 className={styles.duplicateTitle}>
                {t("testDetails.duplicateTitle")}
              </h3>
              <p className={styles.duplicateText}>
                {t("testDetails.duplicateMsg")}
              </p>
            </div>
          </div>
        )}
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>
                {t("testDetails.analysisResults")}
              </h1>
              <p className={styles.meta}>
                {t("tests.typeLabel", {
                  type: t(`tests.${test?.testType}`, {
                    defaultValue: test?.testType,
                  }),
                })}
                <span className={styles.dot}></span>
                {formattedDate}
              </p>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.secondaryBtn}
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                <Download size={18} />
                {t("testDetails.downloadPdf")}
              </button>
            </div>
          </div>

          <div className={`${styles.resultBadge} ${currentResult.bgClass}`}>
            {currentResult.icon}
            <span className={currentResult.textClass}>{resultLabel}</span>
          </div>
        </div>

        <div className={styles.adviceCard}>
          <div className={styles.adviceIcon}>
            <Stethoscope size={30} strokeWidth={1.7} />
          </div>

          <div className={styles.adviceContent}>
            <h3 className={styles.adviceTitle}>
              {isFailed
                ? t("testDetails.analysisFailed")
                : isHealthy
                  ? t("testDetails.goodNews")
                  : t("testDetails.medicalAdvice")}
            </h3>
            <p className={styles.adviceText}>{adviceMessage}</p>
          </div>
        </div>

        {downloadError && <Errore error={downloadError} />}
      </div>
    </>
  );
}

export default TestDetails;
