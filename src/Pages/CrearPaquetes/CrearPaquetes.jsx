import { useState } from 'react';
import api from '../../Services/AxiosInstance/AxiosInstance';
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
      const errMsg = err.response
        ? `Error ${err.response.status}: ${err.response.data.error || 'No autorizado'}`
        : 'Hubo un error al crear el paquete';
      setError(errMsg);
      Swal.fire('Error', errMsg, 'error');
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-2xl mt-5 w-full mx-auto bg-white rounded-xl shadow-md space-y-6 box-border overflow-x-hidden">
      <h1 className="text-3xl font-bold text-center text-gray-800">Crear Paquete Turístico</h1>

      <div className="space-y-4">
        {/* Datos del paquete */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del paquete</label>
          <input
            name="nombrePaquete"
            value={formData.nombrePaquete}
            onChange={handleChange}
            placeholder="Ej: Aventura en Cancún"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe el paquete..."
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">URL de imagen</label>
          <input
            name="imagenUrl"
            value={formData.imagenUrl}
            onChange={handleChange}
            placeholder="https://imagen.com"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Duración (días)</label>
            <input
              type="number"
              name="duracionDias"
              value={formData.duracionDias}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de inicio</label>
            <input
              type="date"
              name="fechaInicioDisponible"
              value={formData.fechaInicioDisponible}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Descuento */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Descuento (%)</label>
          <input
            type="number"
            name="descuento"
            value={formData.descuento}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Información adicional */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del hotel</label>
          <input
            name="nombreHotel"
            value={formData.nombreHotel}
            onChange={handleChange}
            placeholder="Hotel Sol y Mar"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Transporte incluido</label>
          <input
            name="nombreTransporte"
            value={formData.nombreTransporte}
            onChange={handleChange}
            placeholder="Avión, Bus, etc."
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Destino</label>
          <input
            name="nombreDestino"
            value={formData.nombreDestino}
            onChange={handleChange}
            placeholder="Ej: Cartagena"
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Botón */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Crear Paquete
        </button>

        {/* Mensajes */}
        {mensaje && <p className="text-green-600">{mensaje}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
};
