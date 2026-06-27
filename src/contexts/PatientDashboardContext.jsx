import { createContext, useContext, useEffect, useReducer } from "react";

import { useAuth } from "./AuthContext";

const PatientDashboardContext = createContext();

const initialState = {
  dashboardData: null,

  recentTests: [],

  allTests: [],

  stats: null,

  loading: true,

  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,

        loading: true,

        error: null,
      };

    case "FETCH_SUCCESS":
      return {
        ...state,

        loading: false,

        dashboardData: action.payload,

        recentTests: action.payload.recentTests || [],

        allTests: action.payload.allTests || [],

        stats: action.payload.stats || null,
      };

    case "FETCH_ERROR":
      return {
        ...state,

        loading: false,

        error: action.payload,
      };

    default:
      return state;
  }
}

function PatientDashboardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { user } = useAuth();

  // الفونكشن الأساسية القديمة
  async function fetchDashboardData() {
    try {
      dispatch({
        type: "FETCH_START",
      });

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Unauthorized");
      }

      const response = await fetch("http://127.0.0.1:3000/api/tests/my-tests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch dashboard");
      }

      const tests = result.data.tests || [];

      // ترتيب الأحدث أولاً
      const sortedTests = [...tests].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      // تنسيق البيانات
      const formattedTests = sortedTests.map((test) => ({
        id: test._id,

        type: test.testType,

        result: test.result || "Unknown",

        status: test.status,

        pattern: test.activePattern,

        confidence: test.confidence || null,

        createdAt: test.createdAt,

        imagePath: test.imagePath,

        isHealthy: test.result === "Healthy",

        isParkinson: test.result === "Parkinson",
      }));

      const healthyTests = formattedTests.filter(
        (test) => test.result === "Healthy",
      ).length;

      const parkinsonTests = formattedTests.filter(
        (test) => test.result === "Parkinson",
      ).length;

      dispatch({
        type: "FETCH_SUCCESS",

        payload: {
          stats: {
            totalTests: formattedTests.length,

            healthyTests,

            parkinsonTests,

            currentStatus:
              parkinsonTests > healthyTests ? "Parkinson" : "Healthy",

            lastTestDate: formattedTests[0]?.createdAt || "-",
          },

          allTests: formattedTests,

          recentTests: formattedTests.slice(0, 3),
        },
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);

      dispatch({
        type: "FETCH_ERROR",

        payload: err.message || "Something went wrong",
      });
    }
  }

  // الفونكشن الجديدة للتحديث اليدوي
  async function refreshDashboard() {
    await fetchDashboardData();
  }

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  return (
    <PatientDashboardContext.Provider
      value={{
        ...state,

        // القديمة
        fetchDashboardData,

        // الجديدة
        refreshDashboard,
      }}
    >
      {children}
    </PatientDashboardContext.Provider>
  );
}

function usePatientDashboard() {
  const context = useContext(PatientDashboardContext);

  if (context === undefined) {
    throw new Error(
      "PatientDashboardContext was used outside PatientDashboardProvider",
    );
  }

  return context;
}

export { PatientDashboardProvider, usePatientDashboard };
