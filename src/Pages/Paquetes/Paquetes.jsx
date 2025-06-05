import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import api from "../../Services/AxiosInstance/AxiosInstance";

export const Paquetes = () => {
  const navigate = useNavigate();
  const [paquetes, setPaquetes] = useState([]);
  const userId = localStorage.getItem("userId"); // Asegúrate de guardar el ID del usuario al iniciar sesión

  useEffect(() => {
  });

  const handleComprar = async (nombre) => {
    if (typeof nombre !== 'string') {
      console.error("Nombre inválido:", nombre);
      return alert("Error interno al procesar el paquete.");
    }

    try {
      const response = await api.post("/api/payments/create", {
        price: 10.0,
        name: nombre,
        quantity: 1,
      });

      const approvalUrl = response.data.approval_url;

      if (approvalUrl) {
        window.location.href = approvalUrl;
      } else {
        alert("No se pudo obtener la URL de aprobación");
      }
    } catch (error) {
      console.error("Error al crear el pago:", error);
      alert("Error al procesar el pago");
    }
  };

  const [loading, setLoading] = useState(true);

  const obtenerPaquetes = async () => {
    try {
      const response = await api.get('/packages/paquetes');
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
    <div className="flex flex-col items-center mt-16 gap-8">
      <button
        onClick={() => navigate("/crearPaquete")}
        className="w-max p-3 rounded-full bg-white text-black"
      >
        Agregar Paquete
      </button>
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

            {paquete.incluye && (() => {
              try {
                const incluyeItems = JSON.parse(paquete.incluye);
                return Array.isArray(incluyeItems) ? (
                  <div className="mt-2">
                    <strong>Incluye:</strong>
                    <ul className="list-disc ml-5 text-sm text-gray-700">
                      {incluyeItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null;
              } catch (e) {
                console.error("Error al parsear 'incluye':", e);
                return null;
              }
            })()}

            {paquete.noIncluye && (() => {
              try {
                const noIncluyeItems = JSON.parse(paquete.noIncluye);
                return Array.isArray(noIncluyeItems) ? (
                  <div className="mt-2">
                    <strong>No incluye:</strong>
                    <ul className="list-disc ml-5 text-sm text-gray-500">
                      {noIncluyeItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null;
              } catch (e) {
                console.error("Error al parsear 'noIncluye':", e);
                return null;
              }
            })()}
            <button onClick={() => handleComprar(paquete.nombrePaquete)} className="mt-5 px-5 cursor-pointer py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center space-x-2 transform hover:scale-105">comprar</button>

          </div>
        ))}


      </div>
    </div>

  )
};
