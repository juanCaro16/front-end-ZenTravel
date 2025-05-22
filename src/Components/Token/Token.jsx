import axios from 'axios';

export const refreshToken = async () => {
  try {
    const token = localStorage.getItem('refreshToken');
    const response = await axios.post(
      'http://localhost:10101/Auth/refresToken',
      null, // o formData si necesitas enviar datos
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Token renovado:', response.data);
    // Guarda el nuevo token
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data;
  } catch (error) {
    console.error('Error al refrescar el token:', error);
    throw error;
  }
};
