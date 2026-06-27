import Navbar from "../components/layout/Navbar";
import { useAuth } from "../contexts/AuthContext";
function AdminDashboard() {
  const { isAuthenticated, user } = useAuth();
  console.log("is it :", isAuthenticated);
  console.log("user is : ", user);
  return (
    <div>
      <Navbar />
      this place for admin dashboard page....
      <div>Authenticated: {String(isAuthenticated)}</div>
      <div>User name: {user?.name}</div>
      <div>User email: {user?.email}</div>
      <div>User role: {user?.role}</div>
    </div>
  );
}

export default AdminDashboard;
