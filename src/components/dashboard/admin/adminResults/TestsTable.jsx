import styles from "./TestsTable.module.css";

import DataTable from "../../../ui/DataTable";

import { Mic, PenTool, Layers } from "lucide-react";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

function TestsTable({ tests }) {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      {
        header: t("admin.tables.testType"),

        render: (test) => {
          const Icon =
            test.testType === "voice"
              ? Mic
              : test.testType === "drawing"
                ? PenTool
                : Layers;

          return (
            <div className={`${styles.testType} ${styles[test.testType]}`}>
              <Icon
                size={16}
                className={
                  test.testType === "voice"
                    ? styles.voiceIcon
                    : test.testType === "drawing"
                      ? styles.drawingIcon
                      : styles.combineIcon
                }
              />

              <span>
                {t("tests.typeLabel", {
                  type: t(`tests.${test.testType}`),
                })}
              </span>
            </div>
          );
        },
      },

      {
        header: t("admin.tables.patient"),

        render: (test) => (
          <div className={styles.patientCell}>
            <div>
              <p className={styles.name}>{test.patientName}</p>

              <p className={styles.email}>{test.email}</p>
            </div>
          </div>
        ),
      },

      {
        header: t("admin.tables.date"),

        render: (test) => <span className={styles.date}>{test.createdAt}</span>,
      },

      {
        header: t("admin.tables.result"),

        render: (test) => (
          <span
            className={`${styles.resultBadge} ${
              test.result === "healthy" ? styles.healthy : styles.parkinson
            }`}
          >
            {test.result === "healthy"
              ? t("admin.results.healthy")
              : t("admin.results.parkinson")}
          </span>
        ),
      },
    ],
    [t],
  );

  return (
    <div className={styles.container}>
      <DataTable
        columns={columns}
        data={tests}
        emptyKey="admin.tables.noTests"
      />
    </div>
  );
}

export default TestsTable;
