import { AuthProvider } from "./contexts/AuthContext.jsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Articles from "./pages/Articles.jsx";
import FAQ from "./pages/FAQ.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PatientLayout from "./components/layout/PatientLayout.jsx";
import PatientDashboard from "./pages/PatientDashboard.jsx";
// import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import VoiceTest from "./pages/VoiceTest.jsx";
import DrawingTest from "./pages/DrawingTest .jsx";
import CombinedTest from "./pages/CombinedTest .jsx";
import TestsHistory from "./components/dashboard/patient/TestsHistory.jsx";

import { PatientDashboardProvider } from "./contexts/PatientDashboardContext.jsx";
import PatientProfile from "./pages/PatientProfile.jsx";
import TestDetails from "./pages/TestDetails.jsx";

import AdminLayout from "./components/layout/AdminLayout.jsx";
import AdminDashboard from "./components/dashboard/admin/AdminDashboard.jsx";
import AdminPatients from "./components/dashboard/admin/AdminPatients.jsx";
import AdminResults from "./components/dashboard/admin/AdminResults.jsx";
import AdminArticles from "./components/dashboard/admin/AdminArticles.jsx";

import AdminFAQ from "./components/dashboard/admin/FAQAdmin.jsx";

import AdminFeedback from "./components/dashboard/admin/AdminFeedback.jsx";
import Feedback from "./pages/Feedback.jsx";

import { initializeData } from "./data/initializeData.js";

initializeData();

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="articles" element={<Articles />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route
              path="patient"
              element={
                <ProtectedRoute>
                  <PatientDashboardProvider>
                    <PatientLayout />
                  </PatientDashboardProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<PatientDashboard />} />

              <Route path="voice-test" element={<VoiceTest />} />
              <Route path="drawing-test" element={<DrawingTest />} />
              <Route path="combined-test" element={<CombinedTest />} />

              <Route path="history" element={<TestsHistory />} />
              <Route path="history/:testId" element={<TestDetails />} />

              <Route path="profile" element={<PatientProfile />} />
            </Route>
            <Route
              path="admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="results" element={<AdminResults />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="faq" element={<AdminFAQ />} />
              <Route path="feedback" element={<AdminFeedback />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
