import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import api from "../../Services/AxiosInstance/AxiosInstance";

export const Paquetes = () => {
  const navigate = useNavigate();
  const [paquetes, setPaquetes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);


  useEffect(() => {
    obtenerPaquetes();
  }, []);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const nuevosPaquetes = [...paquetes];
    nuevosPaquetes[index][name] = value;
    setPaquetes(nuevosPaquetes);
  };

  const handleGuardar = async (paquete) => {
    try {
      const id = paquete.id_paquete;
      await api.put(`packages/IDPackage/${id}`, paquete);
      Swal.fire("Éxito", "Paquete actualizado exitosamente", "success");
      setEditandoId(null);
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      Swal.fire("Error", "No se pudo actualizar el paquete", "error");
    }
  };

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

  if (paquetes.length === 0) {
  <p className="text-center mt-8">No hay paquetes disponibles.</p> ;
        <button
        onClick={() => navigate("/crearPaquete")}
        className="w-max p-3 rounded-full bg-white text-black"
      >
        Agregar Paquete
      </button>
  }

  return (
    <div className="flex flex-col items-center mt-16 gap-8">
      <button
        onClick={() => navigate("/crearPaquete")}
        className="w-max p-3 rounded-full bg-white text-black"
      >
        Agregar Paquete
      </button>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paquetes.map((paquete, index) => {
          const enEdicion = editandoId === paquete.id_paquete;

          return (
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

              {enEdicion ? (
                <input
                  name="nombrePaquete"
                  value={paquete.nombrePaquete}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full mt-2 border p-1 rounded"
                />
              ) : (
                <h2 className="text-xl font-semibold mt-2">{paquete.nombrePaquete}</h2>
              )}

              {enEdicion ? (
                <textarea
                  name="descripcion"
                  value={paquete.descripcion}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full mt-2 border p-1 rounded text-sm resize-none"
                />
              ) : (
                <p className="text-gray-600 text-sm mb-2">{paquete.descripcion}</p>
              )}

              {enEdicion ? (
                <input
                  name="duracionDias"
                  type="number"
                  value={paquete.duracionDias}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full mt-1 border p-1 rounded text-sm"
                />
              ) : (
                <p className="text-sm"><strong>Duración:</strong> {paquete.duracionDias} días</p>
              )}

              <ul className="text-sm space-y-1 mt-2">
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

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => handleComprar(paquete.nombrePaquete)}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 hover:scale-105"
                >
                  Comprar
                </button>

                {enEdicion ? (
                  <>
                    <button
                      onClick={() => handleGuardar(paquete)}
                      className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditandoId(null)}
                      className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-xl transition-all duration-200"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditandoId(paquete.id_paquete)}
                    className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200"
                  >
                    Editar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
