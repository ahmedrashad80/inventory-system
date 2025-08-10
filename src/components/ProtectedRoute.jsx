import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}api/user/verify`, {
        withCredentials: true,
      })
      .then((res) => {
        setAuthenticated(true);
        console.log("User is authenticated:", res.data);
        setUserRole(res.data.user.role);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  if (!authenticated) return <Navigate to="/login" replace />;
  // if (userRole === "admin") return <Navigate to="/orders" replace />;
  if (userRole === "admin") {
    const currentPath = window.location.pathname;
    if (currentPath !== "/orders") {
      return <Navigate to="/orders" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
