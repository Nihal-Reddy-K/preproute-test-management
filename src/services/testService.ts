import axiosInstance from "../api/axios";

export const getTests = async () => {
  const response = await axiosInstance.get("/tests");

  return response.data;
};

export const getTestById = async (id: string) => {
  const response = await axiosInstance.get(`/tests/${id}`);

  return response.data;
};

export const createTest = async (data: any) => {
  const response = await axiosInstance.post("/tests", data);

  return response.data;
};

export const updateTest = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/tests/${id}`, data);

  return response.data;
};

export const publishTest = async (id: string) => {
  const response = await axiosInstance.put(`/tests/${id}`, {
    status: "live",
  });

  return response.data;
};
