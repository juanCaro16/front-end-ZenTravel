import { useState, useEffect } from "react"
import api from "../../Services/AxiosInstance/AxiosInstance"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { RoleBasedComponent } from "../../Components/RoleBasedComponent/RoleBasedComponent"

export const Hoteles = () => {
  const navigate = useNavigate()
  const [hoteles, setHoteles] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [loading, setLoading] = useState(true)

  const obtenerHoteles = async () => {
    try {
      const response = await api.get("/hotels")
      setHoteles(response.data.hoteles || [])
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los hoteles.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    obtenerHoteles()
  }, [])

  const handleChange = (index, e) => {
    const { name, value } = e.target
    const nuevosHoteles = [...hoteles]
    nuevosHoteles[index][name] = value
    setHoteles(nuevosHoteles)
  }

  const handleGuardar = async (hotel) => {
    try {
      await api.put(`/hotels/${hotel.id_hotel}`, hotel)
      Swal.fire("Éxito", "Hotel actualizado exitosamente", "success")
      setEditandoId(null)
      obtenerHoteles()
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el hotel", "error")
    }
  }

  if (loading) return <p className="text-center mt-8">Cargando hoteles...</p>

  return (
    <div className="flex flex-col items-center mt-16 gap-8">
      <RoleBasedComponent allowedRoles={["Admin", "Empleado"]}>
        <button onClick={() => navigate("/CrearHoteles")} className="w-max p-3 rounded-full bg-white text-black transition-all duration-200 hover:scale-105">
          Agregar Hotel
        </button>
      </RoleBasedComponent>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {hoteles.map((hotel, index) => {
          const enEdicion = editandoId === hotel.id_hotel
          return (
            <div key={hotel.id_hotel || index} className="bg-white rounded-2xl shadow p-4">
              {hotel.imagenUrl ? (
                <img src={hotel.imagenUrl} alt={hotel.nombreHotel} className="w-full h-40 object-cover rounded-xl" />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-xl text-gray-500">
                  Sin imagen
                </div>
              )}

              {enEdicion ? (
                <input
                  name="nombreHotel"
                  value={hotel.nombreHotel}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full mt-2 border p-1 rounded"
                />
              ) : (
                <h2 className="text-xl font-semibold mt-2">{hotel.nombreHotel}</h2>
              )}

              {enEdicion ? (
                <textarea
                  name="descripcion"
                  value={hotel.descripcion}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full mt-2 border p-1 rounded text-sm resize-none"
                />
              ) : (
                <p className="text-gray-600 text-sm mb-2">{hotel.descripcion}</p>
              )}

              <ul className="text-sm space-y-1 mt-2">
                <li><strong>Ubicación:</strong> {hotel.ubicacion || "No especificada"}</li>
                <li><strong>Estrellas:</strong> {hotel.estrellas || "No definido"}</li>
              </ul>

              <RoleBasedComponent allowedRoles={["Admin", "Empleado"]}>
                <div className="mt-4 flex flex-col gap-2">
                  {enEdicion ? (
                    <>
                      <button
                        onClick={() => handleGuardar(hotel)}
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
                      onClick={() => setEditandoId(hotel.id_hotel)}
                      className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200"
                    >
                      Editar
                    </button>
                  )}
                </div>
              </RoleBasedComponent>
            </div>
          )
        })}
      </div>
    </div>
  )
}


