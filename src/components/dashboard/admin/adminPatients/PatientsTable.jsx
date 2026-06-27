import styles from "./PatientsTable.module.css";

import DataTable from "../../../ui/DataTable";

import { useMemo } from "react";

import { useTranslation } from "react-i18next";

function calculateAge(birthDate) {
  if (!birthDate) return "-";

  const today = new Date();

  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();

  const monthDifference = today.getMonth() - birth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PatientsTable({ patients }) {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      {
        header: t("admin.tables.patient"),

        render: (patient) => (
          <div className={styles.patientCell}>
            <div className={styles.avatar}>
              {patient.user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "?"}
            </div>

            <div>
              <p className={styles.name}>{patient.user?.name || "-"}</p>

              <p className={styles.email}>{patient.user?.email || "-"}</p>
            </div>
          </div>
        ),
      },

      {
        header: t("admin.tables.age"),

        render: (patient) => (
          <span className={styles.info}>{calculateAge(patient.birthDate)}</span>
        ),
      },

      {
        header: t("admin.tables.gender"),

        render: (patient) => (
          <span className={styles.info}>
            {patient.gender ? t(`common.${patient.gender}`) : "-"}
          </span>
        ),
      },

      {
        header: t("admin.tables.phone"),

        render: (patient) => (
          <span className={styles.phone}>{patient.phone || "-"}</span>
        ),
      },

      {
        header: t("admin.tables.accountCreated"),

        render: (patient) => (
          <span className={styles.date}>
            {formatDate(patient.user?.createdAt)}
          </span>
        ),
      },
    ],
    [t],
  );

  return (
    <div className={styles.container}>
      <DataTable columns={columns} data={patients} />
    </div>
  );
}

export default PatientsTable;
