import { useState } from 'react';
import axios from 'axios';
import api  from '../../Services/AxiosInstance/AxiosInstance'; // usa tu instancia personalizada con el interceptor
import Swal from 'sweetalert2';

export const CrearPaquetes = () => {
  const [formData, setFormData] = useState({
    nombrePaquete: '',
    descripcion: '',
    imagenUrl: '',
    duracionDias: '',
    fechaInicioDisponible: '',
    descuento: '',
    nombreHotel: '',
    nombreTransporte: '',
    nombreDestino: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleSubmit = async () => {
    try {
      setMensaje('');
      setError('');

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Token no encontrado. Por favor inicia sesión.');
        return;
      }

      const response = await api.post('/packages/create', formData);

      setMensaje('Paquete creado con éxito');
      console.log('✅ Respuesta del servidor:', response.data);
      Swal.fire('Éxito', 'Paquete creado correctamente', 'success');
    } catch (err) {
      console.error('Error al crear el paquete:', err);
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data.error || 'No autorizado'}`);
      } else {
        setError('Hubo un error al crear el paquete');
      }
      Swal.fire('Error', error, 'error');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">Crear Paquete Turístico</h1>

      {Object.entries(formData).map(([key, value]) => (
        <input
          key={key}
          type={
            key.includes('fecha') ? 'date' :
            ['precioTotal', 'descuento', 'duracionDias'].includes(key) ? 'number' :
            'text'
          }
          name={key}
          value={value}
          onChange={handleChange}
          placeholder={key}
          className="w-full p-2 border rounded-md"
        />
      ))}

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
      >
        Crear Paquete
      </button>

      {mensaje && <p className="text-green-600">{mensaje}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};
