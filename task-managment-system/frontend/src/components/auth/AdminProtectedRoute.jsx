import useAuthStore from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../../api/apiClients";
import { useEffect } from "react";
import { Spokes } from "@/components/spokes";
import { Navigate } from "react-router";

export default function AdminProtectedRoute({ children }) {
  const { user, login, logOut, token } = useAuthStore();

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["AdminDashboard"],
    queryFn: async () => {
      const response = await api.get("admin/dashboard");
      return response.data;
    },
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      logOut();
    }
  }, [error, isError, logOut]);
  useEffect(() => {
    if (data && isSuccess) {
      login(user, token);
    }
  }, [isLoading, data, isSuccess, login]);
 if (isLoading) {
   return (
     <div className="flex h-screen items-center justify-center">
       <Spokes className="size-16" />;
     </div>
   );
 }
  if (isError) {
    console.log("error here", error);
    return <Navigate to="/login" replace />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role != "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
