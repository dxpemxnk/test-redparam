import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/",
  withCredentials: true,
});

let accessToken = "";

export function setAccessToken(token) {
  accessToken = token; // есть - пользователь авторизирован и у него есть доступ к дейтсвиям
  //console.log(accessToken);
}

// В каждый запрос добавляет HTTP заголовок Authorization
axiosInstance.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    // есть ли заголовок с названием Authorization
    config.headers.Authorization = `Bearer ${accessToken}`; // создаем заголовок
    // "Bearer fsdjknfjksdanfjdsnfkjdsfj"
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error.config;
    if (error.response.status === 403 && !prevRequest.sent) {
      const response = await axios.get("/api/auth/refresh");
      accessToken = response.data.accessToken;
      prevRequest.sent = true;
      prevRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(prevRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
