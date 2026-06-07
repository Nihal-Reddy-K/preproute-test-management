import axiosInstance from "../api/axios";

export const login = async (userId: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", {
    userId,
    password,
  });

  return response.data;
};
