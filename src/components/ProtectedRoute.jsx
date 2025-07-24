import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}api/user/verify`, {
        withCredentials: true,
      })
      .then((res) => {
        setAuthenticated(true);
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

  return children;
};

export default ProtectedRoute;
