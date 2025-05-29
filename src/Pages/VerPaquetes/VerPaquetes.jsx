import React, { useEffect, useState } from 'react';
import api from '../../Services/AxiosInstance/AxiosInstance';
import Swal from 'sweetalert2';

export const VerPaquetes = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerPaquetes = async () => {
    try {
      const response = await api.get('/packages/paketes');
      console.log(response.data); // depura el error
      setPaquetes(response.data.paquetes);
    } catch (error) {
      console.error('Error al obtener paquetes:', error);
      Swal.fire('Error', 'No se pudieron cargar los paquetes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerPaquetes();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Cargando paquetes...</p>;
  }

  if (paquetes.length === 0) {
    return <p className="text-center mt-8">No hay paquetes disponibles.</p>;
  }

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {paquetes.map((paquete) => (
        <div key={paquete.id} className="bg-white rounded-2xl shadow p-4">
          <img
            src={paquete.imagenUrl}
            alt={paquete.nombrePaquete}
            className="w-screen h-40 object-cover rounded-xl"
          />
          <h2 className="text-xl font-semibold mt-2">{paquete.nombrePaquete}</h2>
          <p className="text-gray-600">{paquete.descripcion}</p>
          <p><strong>Duración:</strong> {paquete.duracionDias} días</p>
          <p><strong>Inicio:</strong> {paquete.fechaInicioDisponible}</p>
          <p><strong>Hotel:</strong> {paquete.nombreHotel}</p>
          <p><strong>Transporte:</strong> {paquete.nombreTransporte}</p>
          <p><strong>Destino:</strong> {paquete.nombreDestino}</p>
          <p><strong>Descuento:</strong> {paquete.descuento}%</p>
        </div>
      ))}
    </div>
  );
};
