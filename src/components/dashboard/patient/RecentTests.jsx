import styles from "./RecentTests.module.css";
import { Link } from "react-router-dom";
import TestListItem from "./TestListItem";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
function RecentTests({ tests = [] }) {
  const { t } = useTranslation();
  // console.log("tests from recent :", tests);
  const latestThree = tests.slice(0, 3);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("patient.recentTests.title")}</h2>
        <Link to="/patient/history" className={styles.viewAll}>
          <span>{t("patient.recentTests.viewAll")}</span>
          <div className={styles.arrow}>
            <ArrowRight size={16} />
          </div>
        </Link>
      </div>

      {latestThree.length === 0 ? (
        <h3>{t("patient.recentTests.empty")}</h3>
      ) : (
        <div className={styles.card}>
          {latestThree.map((test) => (
            <TestListItem key={test.id} test={test} />
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentTests;
