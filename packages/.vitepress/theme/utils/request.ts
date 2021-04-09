import axios from 'axios';

const service = axios.create({
  timeout: 500000,
});

service.interceptors.request.use(
  config => {
    config.headers.common['Authorization'] = localStorage.getItem('AUTH_TOKEN');

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

service.interceptors.response.use(response => {
  return response.data;
});

export default service;
