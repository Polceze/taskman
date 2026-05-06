import axios from "axios";
import type { TokenResponse, RegisterPayload, LoginPayload } from "../types/auth.ts";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      return Promise.reject(
        new Error("Server may have spun down. Give it a minute then try again.")
      );
    }
    const message = err.response?.data?.detail ?? "An unexpected error occurred.";
    return Promise.reject(new Error(String(message)));
  }
);

export const authApi = {
  register: (payload: RegisterPayload) =>
    client.post<TokenResponse>("/api/auth/register", payload).then((r) => r.data),

  login: (payload: LoginPayload) =>
    client.post<TokenResponse>("/api/auth/login", payload).then((r) => r.data),
};