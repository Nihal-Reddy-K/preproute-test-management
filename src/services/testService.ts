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

export const deleteTest = async (id: string) => {
  const response = await axiosInstance.delete(`/tests/${id}`);
  return response.data;
};

export const publishTest = async (id: string) => {
  const response = await axiosInstance.put(`/tests/${id}`, {
    status: "live",
  });
  return response.data;
};

export const getSubjects = async () => {
  const response = await axiosInstance.get("/subjects");
  return response.data;
};

export const getTopicsBySubject = async (subjectId: string) => {
  const response = await axiosInstance.get(`/topics/subject/${subjectId}`);
  return response.data;
};

export const getSubtopicsByTopics = async (topicIds: string[]) => {
  const response = await axiosInstance.post("/sub-topics/multi-topics", {
    topicIds,
  });
  return response.data;
};
