"use client"

import { useState, useEffect } from "react"
import api from "../../Services/AxiosInstance/AxiosInstance"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { RoleBasedComponent } from "../../Components/RoleBasedComponent/RoleBasedComponent"
import { HabitacionCarrusel } from "../../Components/HabitacionCarrusel/HabitacionCarrusel"

const StarRating = ({ value, onChange, editable = true, uniqueId = "" }) => {
  const [hovered, setHovered] = useState(null)
  const displayValue = hovered || value
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        let percent = 0
        if (displayValue >= star) {
          percent = 100
        } else if (displayValue > star - 1) {
          percent = (displayValue - (star - 1)) * 100
        }
        const gradId = `star-gradient-${uniqueId}-${star}`
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
            style={{ padding: 0, background: "none", border: "none" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              className="w-7 h-7 transition-colors duration-150"
            >
              <defs>
                <linearGradient id={gradId}>
                  <stop offset={`${percent}%`} stopColor="#fbbf24" />
                  <stop offset={`${percent}%`} stopColor="#e5e7eb" />
                </linearGradient>
              </defs>
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z"
                fill={`url(#${gradId})`}
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
  const [verHabitacionesId, setVerHabitacionesId] = useState(null)
  const [hotelSeleccionado, setHotelSeleccionado] = useState(null)
  const [calificados, setCalificados] = useState(() => {
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
        ubicacion: hotel.ubicacion,
      }
      await api.put(`/packages/EditarHotel/${hotel.id_hotel}`, data)
      Swal.fire("Éxito", "Hotel actualizado exitosamente", "success")
      setEditandoId(null)
      obtenerHoteles()
      if (hotelSeleccionado?.id_hotel === hotel.id_hotel) {
        setHotelSeleccionado({ ...hotelSeleccionado, ...data })
      }
    } catch (error) {
      Swal.fire("Error", error?.response?.data?.error || "No se pudo actualizar el hotel", "error")
    }
  }

  const handleStarChange = async (index, estrellas) => {
    const hotel = hoteles[index]
    if (!estrellas || !hotel?.id_hotel) {
      Swal.fire("Error", "Faltan datos para calificar.", "error")
      return
    }
    if (calificados.includes(hotel.id_hotel)) {
      Swal.fire("Ya calificaste", "Solo puedes calificar una vez este hotel.", "info")
      return
    }
    try {
      const response = await api.post("/Auth/Report/Calificar", {
        estrellas,
        id_hotel: hotel.id_hotel,
      })
      const nuevoPromedio = Number.parseFloat(response.data.promedio)

      if (!isNaN(nuevoPromedio)) {
        const nuevosHoteles = [...hoteles]
        nuevosHoteles[index] = {
          ...nuevosHoteles[index],
          estrellas: nuevoPromedio,
        }
        setHoteles(nuevosHoteles)

        if (hotelSeleccionado?.id_hotel === hotel.id_hotel) {
          setHotelSeleccionado({ ...hotelSeleccionado, estrellas: nuevoPromedio })
        }
      }
      setCalificados([...calificados, hotel.id_hotel])
      Swal.fire("¡Gracias!", `Calificaste este hotel con ${estrellas} estrella${estrellas > 1 ? "s" : ""}.`, "success")
    } catch (error) {
      Swal.fire("Error", error?.response?.data?.error || "No se pudo guardar la calificación", "error")
    }
  }

  const handleEliminar = async (id_hotel) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el hotel permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/admin/deleteHotel/${id_hotel}`)
        Swal.fire("Eliminado", "El hotel ha sido eliminado.", "success")
        obtenerHoteles()
        if (hotelSeleccionado?.id_hotel === id_hotel) {
          setHotelSeleccionado(null)
        }
      } catch (error) {
        Swal.fire("Error", error?.response?.data?.error || "No se pudo eliminar el hotel", "error")
      }
    }
  }

  const handleAgregarHotel = () => {
    try {
      navigate("/CrearHoteles")
    } catch (error) {
      console.error("Error al navegar:", error)
      Swal.fire("Error", "No se pudo navegar a la página de crear hotel", "error")
    }
  }

  const handleCrearPaquete = (hotel) => {
    try {
      navigate(`/CrearPaquete/${hotel.id_hotel}`, {
        state: {
          hotel: hotel,
          nombre: hotel.nombre,
          ubicacion: hotel.ubicacion,
        },
      })
    } catch (error) {
      console.error("Error al navegar:", error)
      Swal.fire("Error", "No se pudo navegar a la página de crear paquete", "error")
    }
  }

  const handleHacerReserva = (hotel) => {
    try {
      navigate(`/ReservarHotel/${hotel.id_hotel}`, {
        state: {
          hotel: hotel,
          nombre: hotel.nombre,
          ubicacion: hotel.ubicacion,
          estrellas: hotel.estrellas,
          descripcion: hotel.descripcion,
          imagenes: hotel.imagenes,
        },
      })
    } catch (error) {
      console.error("Error al navegar:", error)
      Swal.fire("Error", "No se pudo navegar a la página de reserva", "error")
    }
  }

  if (loading) return <p className="text-center mt-8 text-slate-600">Cargando hoteles...</p>

  return (

    <div className="flex flex-col items-center pt-16 gap-8">
      <RoleBasedComponent allowedRoles={["admin", "Empleado"]}>
        <button
          onClick={handleAgregarHotel}
          className="px-6 py-3 rounded-2xl text-lg bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          + Agregar Hotel
        </button>
      </RoleBasedComponent>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl">
        {hoteles.map((hotel, index) => {
          const enEdicion = editandoId === hotel.id_hotel
          const yaCalificado = calificados.includes(hotel.id_hotel)
          return (
            <div
              key={hotel.id_hotel || index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 transform hover:-translate-y-1 border border-slate-100"
            >
              {(() => {
                let imagenUrl = null
                if (hotel.imagenes) {
                  try {
                    const arr = typeof hotel.imagenes === "string" ? JSON.parse(hotel.imagenes) : hotel.imagenes
                    if (Array.isArray(arr) && arr.length > 0) imagenUrl = arr[0]
                  } catch (e) { }
                }
                return imagenUrl ? (
                  <img
                    src={imagenUrl || "/placeholder.svg"}
                    alt={hotel.nombre}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded-xl text-slate-500">
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 mx-auto mb-2 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm">Sin imagen</p>
                    </div>
                  </div>
                )
              })()}

              <h2 className="text-xl font-bold mt-3 text-slate-800">{hotel.nombre}</h2>
              <p className="text-slate-600 text-sm mb-3 line-clamp-2">{hotel.descripcion}</p>

              <div className="flex items-center text-slate-500 text-sm mb-3">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {hotel.ubicacion || "No especificada"}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <StarRating
                    value={Number(hotel.estrellas) || 0}
                    onChange={(val) => handleStarChange(index, val)}
                    editable={!enEdicion && !yaCalificado}
                    uniqueId={hotel.id_hotel || index}
                  />
                  <span className="text-sm font-semibold text-slate-700">
                    {!isNaN(hotel.estrellas) ? Number(hotel.estrellas).toFixed(1) : "0.0"}
                  </span>
                </div>
                {yaCalificado && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                    ¡Ya calificaste!
                  </span>
                )}
              </div>

              <button
                onClick={() => setHotelSeleccionado(hotel)}
                className="w-full px-4 py-2 mt-auto text-lg bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl "
              >
                Ver Hotel
              </button>
            </div>
          )
        })}
      </div>

      {hotelSeleccionado && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="relative bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 text-white p-6">
              <button
                onClick={() => {
                  setHotelSeleccionado(null)
                  setEditandoId(null)
                  setVerHabitacionesId(null)
                }}
                className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="pr-12">
                {editandoId === hotelSeleccionado.id_hotel ? (
                  <input
                    name="nombre"
                    value={hotelSeleccionado.nombre}
                    onChange={(e) => {
                      const index = hoteles.findIndex((h) => h.id_hotel === hotelSeleccionado.id_hotel)
                      handleChange(index, e)
                      setHotelSeleccionado({ ...hotelSeleccionado, nombre: e.target.value })
                    }}
                    className="text-3xl font-bold bg-transparent border-b-2 border-white border-opacity-50 text-white placeholder-white placeholder-opacity-70 w-full focus:outline-none focus:border-opacity-100"
                    placeholder="Nombre del hotel"
                  />
                ) : (
                  <h2 className="text-3xl font-bold mb-2">{hotelSeleccionado.nombre}</h2>
                )}

                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-amber-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                    <span className="text-lg font-semibold">
                      {Number(hotelSeleccionado.estrellas || 0).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-white text-opacity-80">•</span>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    <span className="text-white text-opacity-90">{hotelSeleccionado.ubicacion}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Imagen del Hotel
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      {(() => {
                        let imagenUrl = null
                        if (hotelSeleccionado.imagenes) {
                          try {
                            const arr =
                              typeof hotelSeleccionado.imagenes === "string"
                                ? JSON.parse(hotelSeleccionado.imagenes)
                                : hotelSeleccionado.imagenes
                            if (Array.isArray(arr) && arr.length > 0) imagenUrl = arr[0]
                          } catch (e) { }
                        }
                        return imagenUrl ? (
                          <img
                            src={imagenUrl || "/placeholder.svg"}
                            alt={hotelSeleccionado.nombre}
                            className="w-full h-48 object-cover rounded-lg shadow-md"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center rounded-lg">
                            <div className="text-center">
                              <svg
                                className="w-16 h-16 mx-auto mb-4 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <p className="text-slate-500 text-lg">No hay imagen disponible</p>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-emerald-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Descripción
                    </h3>
                    {editandoId === hotelSeleccionado.id_hotel ? (
                      <textarea
                        name="descripcion"
                        value={hotelSeleccionado.descripcion}
                        onChange={(e) => {
                          const index = hoteles.findIndex((h) => h.id_hotel === hotelSeleccionado.id_hotel)
                          handleChange(index, e)
                          setHotelSeleccionado({ ...hotelSeleccionado, descripcion: e.target.value })
                        }}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none min-h-[120px]"
                        placeholder="Descripción del hotel"
                      />
                    ) : (
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg">
                        {hotelSeleccionado.descripcion}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-teal-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      Ubicación
                    </h3>
                    {editandoId === hotelSeleccionado.id_hotel ? (
                      <input
                        name="ubicacion"
                        value={hotelSeleccionado.ubicacion}
                        onChange={(e) => {
                          const index = hoteles.findIndex((h) => h.id_hotel === hotelSeleccionado.id_hotel)
                          handleChange(index, e)
                          setHotelSeleccionado({ ...hotelSeleccionado, ubicacion: e.target.value })
                        }}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        placeholder="Ubicación del hotel"
                      />
                    ) : (
                      <p className="text-slate-600 bg-slate-50 p-4 rounded-lg">
                        {hotelSeleccionado.ubicacion || "No especificada"}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                      </svg>
                      Calificación
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <StarRating
                          value={Number(hotelSeleccionado.estrellas) || 0}
                          onChange={(val) => {
                            const index = hoteles.findIndex((h) => h.id_hotel === hotelSeleccionado.id_hotel)
                            if (index !== -1) handleStarChange(index, val)
                          }}
                          editable={!calificados.includes(hotelSeleccionado.id_hotel)}
                          uniqueId={`modal-${hotelSeleccionado.id_hotel}`}
                        />
                        <span className="text-lg font-semibold text-slate-700">
                          ({Number(hotelSeleccionado.estrellas || 0).toFixed(1)})
                        </span>
                        {calificados.includes(hotelSeleccionado.id_hotel) && (
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                            ¡Ya calificaste!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a 2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Habitaciones
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <button
                        onClick={() =>
                          setVerHabitacionesId(
                            verHabitacionesId === hotelSeleccionado.id_hotel ? null : hotelSeleccionado.id_hotel,
                          )
                        }
                        className="w-full px-4 py-3 bg-gradient-to-r bg-emerald-300 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                      >
                        {verHabitacionesId === hotelSeleccionado.id_hotel
                          ? "Ocultar Habitaciones"
                          : "Ver Habitaciones"}
                      </button>

                      {verHabitacionesId === hotelSeleccionado.id_hotel && (
                        <div className="mt-4 space-y-6">
                          {(() => {
                            let imagenes = []
                            try {
                              const imgs =
                                typeof hotelSeleccionado.imageneshabitaciones === "string"
                                  ? JSON.parse(hotelSeleccionado.imageneshabitaciones)
                                  : hotelSeleccionado.imageneshabitaciones
                              imagenes = Array.isArray(imgs) ? imgs : []
                            } catch (e) { }

                            return imagenes.length ? (
                              <HabitacionCarrusel imagenes={imagenes} />
                            ) : (
                              <div className="text-center py-8">
                                <svg
                                  className="w-16 h-16 mx-auto text-slate-400 mb-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                <p className="text-slate-500 text-lg">No hay imágenes de habitaciones disponibles</p>
                              </div>
                            )
                          })()}

                          {/* Botón solo para admin/empleado */}
                          <RoleBasedComponent allowedRoles={["admin", "Empleado"]}>
                            <div className="pt-2">
                              <button
                                onClick={() => document.getElementById("inputHabitacionesModal").click()}
                                className="w-full px-4 py-3 bg-gradient-to-r bg-emerald-300 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                              >
                                + Agregar imágenes de habitaciones
                              </button>

                              {/* Input oculto */}
                              <input
                                type="file"
                                id="inputHabitacionesModal"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const nuevas = Array.from(e.target.files || [])
                                  if (!nuevas.length) return

                                  const index = hoteles.findIndex((h) => h.id_hotel === hotelSeleccionado.id_hotel)
                                  if (index !== -1) {
                                    const hotelActual = hoteles[index]
                                    let actuales = []
                                    try {
                                      actuales = typeof hotelActual.imageneshabitaciones === "string"
                                        ? JSON.parse(hotelActual.imageneshabitaciones)
                                        : hotelActual.imageneshabitaciones || []
                                    } catch (e) { }

                                    const nuevasUrls = nuevas.map(img => URL.createObjectURL(img)) // temporal preview
                                    const todas = [...actuales, ...nuevasUrls]

                                    const nuevosHoteles = [...hoteles]
                                    nuevosHoteles[index].imageneshabitaciones = todas
                                    setHoteles(nuevosHoteles)

                                    setHotelSeleccionado({ ...hotelSeleccionado, imageneshabitaciones: todas })

                                    // ⚠️ Aquí podrías hacer un PATCH si ya quieres subir al backend
                                  }
                                }}
                              />
                            </div>
                          </RoleBasedComponent>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer con botones de acción */}
            <div className="border-t bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                    ID: {hotelSeleccionado.id_hotel}
                  </div>

                  <button
                    onClick={() => handleCrearPaquete(hotelSeleccionado)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Crear Paquete
                  </button>

                  <button
                    onClick={() => handleHacerReserva(hotelSeleccionado)}
                    className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v6a2 2 0 01-2-2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z"
                      />
                    </svg>
                    Hacer Reserva
                  </button>
                </div>

                {/* Botones de Editar y Eliminar - SOLO PARA ADMIN */}
                <RoleBasedComponent allowedRoles={["admin"]}>
                  <div className="flex gap-3">
                    {editandoId === hotelSeleccionado.id_hotel ? (
                      <>
                        <button
                          onClick={() => setEditandoId(null)}
                          className="px-6 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleGuardar(hotelSeleccionado)}
                          className="px-6 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                        >
                          Guardar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditandoId(hotelSeleccionado.id_hotel)}
                          className="px-6 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(hotelSeleccionado.id_hotel)}
                          className="px-6 py-2 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </RoleBasedComponent>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}
