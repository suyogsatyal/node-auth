import axios, { InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return;
  }
);

export default axiosInstance;
