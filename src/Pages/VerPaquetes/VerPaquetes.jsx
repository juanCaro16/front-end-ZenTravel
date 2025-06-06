import React, { useEffect, useState } from 'react';
import api from '../../Services/AxiosInstance/AxiosInstance';
import Swal from 'sweetalert2';

export const VerPaquetes = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerPaquetes = async () => {
  try {
    const response = await api.get('/packages');
    console.log("📦 Respuesta completa:", response);
    console.log("Contenido:", response.data);

    setPaquetes(response.data.paquetes || []);
  } catch (error) {
    console.error('❌ Error al obtener paquetes:', error);
    Swal.fire('Error', 'No se pudieron cargar los paquetes.', 'error');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    obtenerPaquetes();
  }, []);

  if (loading) return <p className="text-center mt-8">Cargando paquetes...</p>;

  if (paquetes.length === 0) return <p className="text-center mt-8">No hay paquetes disponibles.</p>;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {paquetes.map((paquete, index) => (
        <div key={paquete.id_paquete || index} className="bg-white rounded-2xl shadow p-4">
          {paquete.imagenUrl ? (
            <img
              src={paquete.imagenUrl}
              alt={paquete.nombrePaquete}
              className="w-full h-40 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-xl text-gray-500">
              Sin imagen
            </div>
          )}

          <h2 className="text-xl font-semibold mt-2">{paquete.nombrePaquete}</h2>
          <p className="text-gray-600 text-sm mb-2">{paquete.descripcion}</p>

          <ul className="text-sm space-y-1">
            <li><strong>Duración:</strong> {paquete.duracionDias} días</li>
            <li><strong>Inicio:</strong> {paquete.fechaInicio || 'No especificado'}</li>
            <li><strong>Hotel:</strong> {paquete.numero_habitacion || 'No definido'}</li>
            <li><strong>Transporte:</strong> {paquete.nombre_transporte || 'No definido'}</li>
            <li><strong>Destino:</strong> {paquete.nombre_destino || 'No definido'}</li>
            <li><strong>Categoría:</strong> {paquete.categoria || 'Sin categoría'}</li>
            <li><strong>Descuento:</strong> {(Number(paquete.descuento) || 0).toFixed(2)}%</li>
            {paquete.precioTotal && (
              <li><strong>Precio total:</strong> ${Number(paquete.precioTotal).toLocaleString()} COP</li>
            )}
          </ul>

          {paquete.incluye && (
            <div className="mt-2">
              <strong>Incluye:</strong>
              <ul className="list-disc ml-5 text-sm text-gray-700">
                {JSON.parse(paquete.incluye).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {paquete.noIncluye && (
            <div className="mt-2">
              <strong>No incluye:</strong>
              <ul className="list-disc ml-5 text-sm text-gray-500">
                {JSON.parse(paquete.noIncluye).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
