import styles from "./DataTable.module.css";
import { useTranslation } from "react-i18next";

function DataTable({ columns, data, emptyKey = "admin.tables.noPatients" }) {
  const { t } = useTranslation();
  return (
    <div className={styles.card}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                {columns.map((col, i) => (
                  <td className={styles.center} key={i}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className={styles.empty}>{t(emptyKey)}</div>
      )}
    </div>
  );
}

export default DataTable;
