import styles from "./PatientLayout.module.css";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
function PatientLayout() {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default PatientLayout;
