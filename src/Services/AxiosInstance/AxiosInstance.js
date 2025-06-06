import axios from 'axios';

const api = axios.create({
  baseURL: 'https://proyecto-zentravel.onrender.com/',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.warn("⚠️ No hay refreshToken disponible");
          return Promise.reject(error);
        }

        const response = await api.post('Auth/RefreshToken', { refreshToken });

        const newToken = response.data.accessToken;
        localStorage.setItem('accessToken', newToken);

        // Actualiza encabezados
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        console.log("🔁 Token refrescado automáticamente");
        return api(originalRequest); // reintenta la solicitud original
      } catch (refreshError) {
        console.error("❌ Error al refrescar token:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
