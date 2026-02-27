import adminClient from "./client";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface MeResponse {
  data: User;
}

export const authApi = {

  login: async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    const { data } = await adminClient.post<LoginResponse>("/admin/login", {
      email,
      password,
    });
    localStorage.setItem("auth_token", data.token);
    return data;
  },

  logout: async (): Promise<void> => {
    await adminClient.post("/admin/logout");
    localStorage.removeItem("auth_token");
  },

  getMe: async (): Promise<User> => {
    const { data } = await adminClient.get<MeResponse>("/admin/me");
    return data.data;
  }
};