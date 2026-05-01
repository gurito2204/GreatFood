const BASE = import.meta.env.VITE_REACT_BACKEND_URL;

const getHeaders = () => {
  const personalDetails = localStorage.getItem("PersonalDetails");
  let token = "";
  if (personalDetails) {
    try {
      token = JSON.parse(personalDetails)?.token ?? "";
    } catch (e) {
      console.error("Failed to parse PersonalDetails", e);
    }
  }
  return {
    "Content-Type": "application/json",
    AuthToken: token,
  };
};

export const api = {
  get: (path) =>
    fetch(`${BASE}${path}`, { headers: getHeaders() }).then((r) => r.json()),
  post: (path, body) =>
    fetch(`${BASE}${path}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  put: (path, body) =>
    fetch(`${BASE}${path}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  delete: (path) =>
    fetch(`${BASE}${path}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then((r) => r.json()),
};
