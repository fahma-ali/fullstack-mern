import useAuthStore from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "../../api/apiClients";
import { useEffect } from "react";
import { Spokes } from "@/components/spokes";
import { Navigate } from "react-router";
export const ProtectedRoute = ({ children }) => {
  const { user, login, logOut, token } = useAuthStore();

  const { isLoading, error, isSuccess, isError, data } = useQuery({
    queryKey: ["CurrentUser"],
    queryFn: async () => {
      const response = await api.get("auth/profile");
      return response;
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
      login(user,token);
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
    console.log("user not found", user);
    return <Navigate to="/login" replace />;
  }
  return children;
};
