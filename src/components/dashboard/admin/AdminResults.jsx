import styles from "./AdminResults.module.css";
import { useEffect, useMemo, useState } from "react";

import TestsFiltersSection from "./adminResults/TestsFiltersSection";
import TestsStats from "./adminResults/TestsStats";
import TestsTable from "./adminResults/TestsTable";

import Loading from "../../ui/Loading";
import ErrorAlert from "../../ui/ErrorAlert";

const API_URL = "http://localhost:3000/api/admin/tests";

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeResult(result) {
  if (!result) return "healthy";

  const normalized = result.toLowerCase();

  return normalized === "healthy" ? "healthy" : "parkinson";
}

function AdminResults() {
  const [tests, setTests] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [resultFilter, setResultFilter] = useState("all");

  const [typeTest, setTypeTest] = useState("all");

  useEffect(() => {
    async function fetchTests() {
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

        if (!response.ok) {
          throw new Error("Failed to fetch tests");
        }

        const data = await response.json();

        const testsData = data.data.tests || [];

        const formattedTests = await Promise.all(
          testsData.map(async (test) => {
            let patientName = "Unknown Patient";

            let patientEmail = "No Email";

            try {
              if (test.patient) {
                const patientId =
                  typeof test.patient === "string"
                    ? test.patient
                    : test.patient._id;

                if (patientId) {
                  const patientResponse = await fetch(
                    `http://localhost:3000/api/admin/patients/${patientId}`,
                    {
                      method: "GET",

                      headers: {
                        "Content-Type": "application/json",

                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );

                  if (patientResponse.ok) {
                    const patientData = await patientResponse.json();

                    const patient =
                      patientData.data?.patient || patientData.data?.doc || {};

                    patientName =
                      patient.user?.name || patient.name || "Unknown Patient";

                    patientEmail =
                      patient.user?.email || patient.email || "No Email";
                  }
                }
              }
            } catch (error) {
              console.error("Patient fetch error:", error);
            }

            return {
              id: test._id,

              patientId:
                typeof test.patient === "string"
                  ? test.patient
                  : test.patient?._id || "",

              patientName,

              email: patientEmail,

              testType: test.testType || "drawing",

              result: normalizeResult(test.result),

              createdAt: formatDate(test.createdAt),

              confidence: test.confidence || 0,
            };
          }),
        );

        setTests(formattedTests);
      } catch (err) {
        console.error(err);

        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTests();
  }, []);

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchesSearch =
        test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesResult =
        resultFilter === "all" || test.result === resultFilter;

      const matchesType = typeTest === "all" || test.testType === typeTest;

      return matchesSearch && matchesResult && matchesType;
    });
  }, [tests, searchQuery, resultFilter, typeTest]);

  if (isLoading) return <Loading />;

  if (error) return <ErrorAlert message={error} />;

  return (
    <>
      <div className={styles.section}>
        <TestsFiltersSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultFilter={resultFilter}
          onResultChange={setResultFilter}
          typeTest={typeTest}
          onTypeChange={setTypeTest}
        />
      </div>

      <TestsStats tests={tests} />

      <TestsTable tests={filteredTests} />
    </>
  );
}

export default AdminResults;
