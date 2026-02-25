import api from "./api";

export const loginAdmin = async (payload) => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

export const generateCertificates = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/certificates/generate", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const fetchCertificates = async (search = "") => {
  const response = await api.get("/certificates", { params: { search } });
  return response.data;
};

export const verifyCertificate = async (certificateId) => {
  const response = await api.get(`/certificates/${certificateId}`);
  return response.data;
};

export const sendCertificateEmail = async (payload) => {
  const response = await api.post("/certificates/send-email", payload);
  return response.data;
};

export const deleteCertificate = async (certificateId) => {
  const response = await api.delete(`/certificates/${certificateId}`);
  return response.data;
};
