import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data.token;
  } catch (error) {
    // Handling AxiosError
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new Error(error.response.data.message || "Login failed");
      } else {
        throw new Error("Network error occurred. Please try again.");
      }
    } else {
      // General error handling if the error isn't an AxiosError
      throw new Error(
        "Login failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }
};

export const signup = async (email: string, password: string) => {
  try {
    console.log("Sending signup data:", { email, password });
    const response = await axios.post(`${API_URL}/signup`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.error("Response error:", error.response.data);
        throw new Error(error.response.data.message || "Sign-up failed");
      } else {
        throw new Error("Network error occurred. Please try again.");
      }
    } else {
      throw new Error(
        "Sign-up failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }
};

export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    await axios.get(`${API_URL}/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    return false;
  }
};
