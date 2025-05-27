import React, { useEffect, useState } from 'react';
import api from '../../Services/AxiosInstance/AxiosInstance';
import Swal from 'sweetalert2';

const VerPaquetes = () => {
  const [paquetes, setPaquetes] = useState([]);

  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const id = user?._id;

        if (!id) {
          Swal.fire("Error", "No se encontró el ID del usuario", "error");
          return;
        }

        const response = await api.get('/paketes/${id}');
        console.log("📦 Paquetes recibidos:", response.data);

        setPaquetes(response.data.paquetes || []);
      } catch (error) {
        console.error("Error al obtener los paquetes:", error);
        Swal.fire("Error", "No se pudieron obtener los paquetes", "error");
      }
    };

    fetchPaquetes();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paquetes.length === 0 ? (
        <p className="col-span-full text-center text-gray-600">No hay paquetes disponibles</p>
      ) : (
        paquetes.map((paquete, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-4">
            <img
              src={paquete.imagenUrl || "/default.jpg"}
              alt={paquete.nombrePaquete}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{paquete.nombrePaquete}</h2>
            <p className="text-sm text-gray-600 mb-2">{paquete.descripcion}</p>
            <ul className="text-sm text-gray-800">
              <li><strong>Destino:</strong> {paquete.nombreDestino}</li>
              <li><strong>Hotel:</strong> {paquete.nombreHotel}</li>
              <li><strong>Transporte:</strong> {paquete.nombreTransporte}</li>
              <li><strong>Duración:</strong> {paquete.duracionDias} días</li>
              <li><strong>Fecha disponible:</strong> {paquete.fechaInicioDisponible}</li>
              <li><strong>Descuento:</strong> {paquete.descuento}%</li>
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default VerPaquetes;