import api from "./axios";

export const login = async (payload: {
  username: string;
  password: string;
}) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};
