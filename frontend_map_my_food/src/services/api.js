const BASE = import.meta.env.VITE_REACT_BACKEND_URL;

const getHeaders = (isFormData = false) => {
  const personalDetails = localStorage.getItem("PersonalDetails");
  let token = "";
  if (personalDetails) {
    try {
      token = JSON.parse(personalDetails)?.token ?? "";
    } catch (e) {
      console.error("Failed to parse PersonalDetails", e);
    }
  }
  const headers = {
    AuthToken: token,
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

export const api = {
  get: (path) =>
    fetch(`${BASE}${path}`, { headers: getHeaders() }).then((r) => r.json()),
  post: (path, body) => {
    const isFormData = body instanceof FormData;
    return fetch(`${BASE}${path}`, {
      method: "POST",
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    }).then((r) => r.json());
  },
  put: (path, body) => {
    const isFormData = body instanceof FormData;
    return fetch(`${BASE}${path}`, {
      method: "PUT",
      headers: getHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    }).then((r) => r.json());
  },
  delete: (path) =>
    fetch(`${BASE}${path}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then((r) => r.json()),
};
