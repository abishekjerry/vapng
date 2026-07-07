import { labelRoutes } from "../../navigations/labelRoutes";
import { API_HEADERS } from "../commonFunction/common";

export const PostApi = (url, data = "", isDashboard = false) => {
  const isFormData = data instanceof FormData;
  const token = localStorage.getItem("token");

  return fetch(url.toString(), {
    method: "POST",
    withCredentials: true,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...API_HEADERS
    },
    body: isFormData ? data : JSON.stringify(data),
  })
    .then(async (response) => {
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.setItem("unAuthorized", true);

        if (isDashboard) return;
        window.location.href = labelRoutes.dashboard;
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        return { status: "F", message: "Unexpected response format" };
      }
    })
    .catch((error) => {
      return {
        status: "F",
        message: error.message || "No response from server",
      };
    });
};


export const GetApi = (url, headers = {}, isDashboard = false) => {
  const token = localStorage.getItem("token");

  return fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...API_HEADERS
    },
  })
    .then(async (response) => {
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.setItem("unAuthorized", true)
        if (isDashboard) return
        window.location.href = labelRoutes.userDashboard;
        return;
      }
      const raw = await response.text();
      if (!raw) return { status: "S", data: null };
      try {
        return { status: "S", data: JSON.parse(raw) };
      } catch (err) {
        return { status: "F", message: "Invalid JSON from server" };
      }
    })
    .catch((error) => {
      return {
        status: "F",
        message: error.message || "Network request failed",
      };
    });
};


