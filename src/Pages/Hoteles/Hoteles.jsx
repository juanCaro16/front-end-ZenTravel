import { useState, useEffect } from "react"
import api from "../../Services/AxiosInstance/AxiosInstance"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { RoleBasedComponent } from "../../Components/RoleBasedComponent/RoleBasedComponent"

// Componente de estrellas
const StarRating = ({ value, onChange, editable = true }) => {
  const [hovered, setHovered] = useState(null)
  const displayValue = hovered || value

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        let fill = "#e5e7eb"
        let gradientId = `star-gradient-${star}`

        if (displayValue >= star) {
          fill = "#facc15" // llena
        } else if (displayValue > star - 1) {
          // Fracción realista para cada estrella
          const percent = Math.round((displayValue - (star - 1)) * 100)
          fill = `url(#${gradientId})`
          return (
            <button
              type="button"
              key={star}
              className="focus:outline-none"
              onMouseEnter={() => editable && setHovered(star)}
              onMouseLeave={() => editable && setHovered(null)}
              onClick={() => editable && onChange(star)}
              tabIndex={editable ? 0 : -1}
              aria-label={`Calificar con ${star} estrella${star > 1 ? "s" : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className="w-7 h-7 transition-colors duration-150"
              >
                <defs>
                  <linearGradient id={gradientId}>
                    <stop offset={`${percent}%`} stopColor="#facc15" />
                    <stop offset={`${percent}%`} stopColor="#e5e7eb" />
                  </linearGradient>
                </defs>
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z"
                  fill={fill}
                />
              </svg>
            </button>
          )
        }
        return (
          <button
            type="button"
            key={star}
            className="focus:outline-none"
            onMouseEnter={() => editable && setHovered(star)}
            onMouseLeave={() => editable && setHovered(null)}
            onClick={() => editable && onChange(star)}
            tabIndex={editable ? 0 : -1}
            aria-label={`Calificar con ${star} estrella${star > 1 ? "s" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              className="w-7 h-7 transition-colors duration-150"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z"
                fill={fill}
              />
            </svg>
          </button>
        )
      })}
    </div>
  )
}

export const Hoteles = () => {
  const navigate = useNavigate()
  const [hoteles, setHoteles] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [calificados, setCalificados] = useState(() => {
    // Cargar del localStorage los hoteles ya calificados
    const saved = localStorage.getItem("hotelesCalificados")
    return saved ? JSON.parse(saved) : []
  })

  const obtenerHoteles = async () => {
    try {
      const response = await api.get("/packages/Hotel")
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

  // Guardar en localStorage cuando cambie calificados
  useEffect(() => {
    localStorage.setItem("hotelesCalificados", JSON.stringify(calificados))
  }, [calificados])

  const handleChange = (index, e) => {
    const { name, value } = e.target
    const nuevosHoteles = [...hoteles]
    nuevosHoteles[index][name] = value
    setHoteles(nuevosHoteles)
  }

  const handleGuardar = async (hotel) => {
    try {
      const data = {
        nombre: hotel.nombre,
        descripcion: hotel.descripcion,
        ubicacion: hotel.ubicacion
      }
      console.log("Enviando a backend:", hotel.id_hotel, data)
      await api.put(`/packages/EditarHotel/${hotel.id_hotel}`, data)
      Swal.fire("Éxito", "Hotel actualizado exitosamente", "success")
      setEditandoId(null)
      obtenerHoteles()
    } catch (error) {
      console.error(error)
      Swal.fire("Error", error?.response?.data?.error || "No se pudo actualizar el hotel", "error")
    }
  }

  // Solo permite calificar una vez por usuario (por navegador)
  const handleStarChange = async (index, estrellas) => {
    const hotel = hoteles[index]
    if (calificados.includes(hotel.id_hotel)) {
      Swal.fire("Ya calificaste", "Solo puedes calificar una vez este hotel.", "info")
      return
    }
    const nuevosHoteles = [...hoteles]
    nuevosHoteles[index].estrellas = estrellas
    setHoteles(nuevosHoteles)
    try {
      await api.put(`/hotels/${hotel.id_hotel}`, { ...hotel, estrellas })
      setCalificados([...calificados, hotel.id_hotel])
      Swal.fire("¡Gracias!", `Calificaste este hotel con ${estrellas} estrella${estrellas > 1 ? "s" : ""}.`, "success")
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar la calificación", "error")
    }
  }

  if (loading) return <p className="text-center mt-8">Cargando hoteles...</p>


  return (
    <div className="flex flex-col items-center mt-16 gap-8">
      <RoleBasedComponent allowedRoles={["admin", "Empleado"]}>
        <button onClick={() => navigate("/CrearHoteles")} className="w-max p-3 rounded-full bg-white text-black transition-all duration-200 hover:scale-105">
          Agregar Hotel
        </button>
      </RoleBasedComponent>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {hoteles.map((hotel, index) => {
          const enEdicion = editandoId === hotel.id_hotel
          const yaCalificado = calificados.includes(hotel.id_hotel)
          return (
            <div key={hotel.id_hotel || index} className="bg-white rounded-2xl shadow p-4">
              {(() => {
                let imagenUrl = null
                if (hotel.imagenes) {
                  try {
                    const arr = typeof hotel.imagenes === "string" ? JSON.parse(hotel.imagenes) : hotel.imagenes
                    if (Array.isArray(arr) && arr.length > 0) imagenUrl = arr[0]
                  } catch (e) {}
                }
                return imagenUrl ? (
                  <img src={imagenUrl} alt={hotel.nombre} className="w-full h-40 object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-xl text-gray-500">
                    Sin imagen
                  </div>
                )
              })()}

              {enEdicion ? (
                <input
                  name="nombre"
                  value={hotel.nombre}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full mt-2 border p-1 rounded"
                />
              ) : (
                <h2 className="text-xl font-semibold mt-2">{hotel.nombre}</h2>
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
                <li>
                  <strong>Ubicación:</strong>{" "}
                  {enEdicion ? (
                    <input
                      name="ubicacion"
                      value={hotel.ubicacion}
                      onChange={(e) => handleChange(index, e)}
                      className="border p-1 rounded w-2/3"
                    />
                  ) : (
                    hotel.ubicacion || "No especificada"
                  )}
                </li>
                <li className="flex items-center gap-2">
                  <strong>Estrellas:</strong>
                  <StarRating
                    value={Number(hotel.estrellas) || 0}
                    onChange={(val) => handleStarChange(index, val)}
                    editable={!enEdicion && !yaCalificado}
                  />
                  <span className="text-xs text-gray-500 font-semibold">
                    {Number(hotel.estrellas).toFixed(1)}
                  </span>
                  {yaCalificado && (
                    <span className="ml-2 text-xs text-emerald-600 font-semibold">¡Ya calificaste!</span>
                  )}
                </li>
              </ul>

              <RoleBasedComponent allowedRoles={["admin", "Empleado"]}>
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
                    <>
                      <button
                        onClick={() => setEditandoId(hotel.id_hotel)}
                        className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200"
                      >
                        Editar
                      </button>
                      <button
                        className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200"
                        // Aquí irá la lógica de eliminar en el futuro
                      >
                        Eliminar
                      </button>
                    </>
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


