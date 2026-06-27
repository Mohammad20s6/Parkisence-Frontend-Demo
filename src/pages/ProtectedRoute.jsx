import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/ui/Loading";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // 🔄 لسا عم نتحقق من المستخدم (/me)
  if (isLoading) {
    return <Loading />;
  }

  // ❌ غير مسجل دخول
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ مسجل دخول
  return children;
}

export default ProtectedRoute;
