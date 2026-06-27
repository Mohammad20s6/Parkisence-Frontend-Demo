import { useEffect, useState } from "react";

import styles from "./AdminPatients.module.css";

import PatientsFiltersSection from "./adminPatients/PatientsFiltersSection";
import PatientsTable from "./adminPatients/PatientsTable";

import Loading from "../../ui/Loading";
import ErrorAlert from "../../ui/ErrorAlert";

const API_URL = "http://127.0.0.1:3000/api/admin/patients";

function AdminPatients() {
  const [patients, setPatients] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPatients() {
      try {
        setIsLoading(true);

        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch patients");
        }

        setPatients(data.data?.patients || []);
      } catch (err) {
        console.error("Patients fetch error:", err);

        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const patientName = patient.user?.name?.toLowerCase() || "";

    const patientEmail = patient.user?.email?.toLowerCase() || "";

    const query = searchQuery.toLowerCase();

    return patientName.includes(query) || patientEmail.includes(query);
  });

  if (isLoading) return <Loading />;

  if (error) return <ErrorAlert message={error} />;

  return (
    <>
      <div className={styles.section}>
        <PatientsFiltersSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultsCount={filteredPatients.length}
        />
      </div>

      <PatientsTable patients={filteredPatients} />
    </>
  );
}

export default AdminPatients;
