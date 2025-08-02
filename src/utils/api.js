import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? process.env.REACT_APP_LOCAL_BACKEND // http://localhost:5000/api
      : "/api", // Netlify 프록시 규칙을 거쳐 Beanstalk으로 전달
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (request) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      request.headers.authorization = `Bearer ${token}`;
    }
    console.log("Starting Request", request);
    return request;
  },
  (error) => {
    console.log("REQUEST ERROR", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errData = error?.response?.data || { message: "Unknown error" };
    console.log("RESPONSE ERROR", errData);
    return Promise.reject(errData);
  }
);

export default api;
