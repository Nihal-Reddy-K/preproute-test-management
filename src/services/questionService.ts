import axiosInstance from "../api/axios";

export const bulkCreateQuestions = async (questions: any) => {
  const response = await axiosInstance.post("/questions/bulk", questions);

  return response.data;
};

export const fetchBulkQuestions = async (ids: string[]) => {
  const response = await axiosInstance.post("/questions/fetchBulk", {
    ids,
  });

  return response.data;
};
