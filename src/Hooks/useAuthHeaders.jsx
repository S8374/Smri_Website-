import { useMemo } from "react";

const useAuthHeaders = () => {
  return useMemo(() => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);
};

export default useAuthHeaders;
