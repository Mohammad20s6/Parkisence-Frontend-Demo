import styles from "./ErrorAlert.module.css";
function ErrorAlert({ error }) {
  return <div className={styles.alert}>{error}</div>;
}

export default ErrorAlert;
