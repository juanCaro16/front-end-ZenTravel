"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../../Services/AxiosInstance/AxiosInstance"
import Swal from "sweetalert2"
import { RoleBasedComponent } from "../../Components/RoleBasedComponent/RoleBasedComponent"
import { HabitacionCarrusel } from "../../Components/HabitacionCarrusel/HabitacionCarrusel"
import { MapPin, Star, Eye, Edit, Trash2, Plus, Calendar, Filter, X } from "lucide-react"

export const Hoteles = () => {
  const navigate = useNavigate()
  const [hoteles, setHoteles] = useState([])
  const [hotelesFiltrados, setHotelesFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [editandoId, setEditandoId] = useState(null)
  const [hotelSeleccionado, setHotelSeleccionado] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [verHabitacionesId, setVerHabitacionesId] = useState(null)

  // Estados para filtros
  const [filtros, setFiltros] = useState({
    ubicacion: "",
    estrellasMin: "",
    estrellasMax: "",
    nombre: "",
  })

  useEffect(() => {
    obtenerHoteles()
  }, [])

  useEffect(() => {
    aplicarFiltros()
  }, [hoteles, filtros])

  const aplicarFiltros = () => {
    let hotelesFiltrados = [...hoteles]

    // Filtro por nombre
    if (filtros.nombre) {
      hotelesFiltrados = hotelesFiltrados.filter((hotel) =>
        hotel.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase()),
      )
    }

    // Filtro por ubicación
    if (filtros.ubicacion) {
      hotelesFiltrados = hotelesFiltrados.filter((hotel) =>
        hotel.ubicacion?.toLowerCase().includes(filtros.ubicacion.toLowerCase()),
      )
    }

    // Filtro por estrellas mínimas
    if (filtros.estrellasMin) {
      hotelesFiltrados = hotelesFiltrados.filter(
        (hotel) => Number(hotel.estrellas || 0) >= Number(filtros.estrellasMin),
      )
    }

    // Filtro por estrellas máximas
    if (filtros.estrellasMax) {
      hotelesFiltrados = hotelesFiltrados.filter(
        (hotel) => Number(hotel.estrellas || 0) <= Number(filtros.estrellasMax),
      )
    }

    setHotelesFiltrados(hotelesFiltrados)
  }

  const handleFiltroChange = (e) => {
    const { name, value } = e.target
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const limpiarFiltros = () => {
    setFiltros({
      ubicacion: "",
      estrellasMin: "",
      estrellasMax: "",
      nombre: "",
    })
  }

  const obtenerHoteles = async () => {
    try {
      const response = await api.get("/packages/Hotel")
      console.log("🏨 Respuesta de hoteles:", response.data)
      setHoteles(response.data.hoteles || [])
    } catch (error) {
      console.error("❌ Error al obtener hoteles:", error)
      Swal.fire("Error", "No se pudieron cargar los hoteles.", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (index, e) => {
    const { name, value } = e.target
    const nuevosHoteles = [...hoteles]
    const hotelIndex = hoteles.findIndex((h) => h.id_hotel === hotelesFiltrados[index].id_hotel)
    nuevosHoteles[hotelIndex][name] = value
    setHoteles(nuevosHoteles)
  }

  const handleGuardar = async (hotel) => {
    try {
      const formData = new FormData()
      formData.append("nombre", hotel.nombre)
      formData.append("descripcion", hotel.descripcion || "")
      formData.append("ubicacion", hotel.ubicacion)
      formData.append("estrellas", hotel.estrellas || "")

      // Agregar imágenes nuevas si existen
      if (hotel.imageneshabitacionesNuevas && hotel.imageneshabitacionesNuevas.length) {
        for (const img of hotel.imageneshabitacionesNuevas) {
          formData.append("imageneshabitaciones", img)
        }
      }

      await api.put(`/packages/EditarHotel/${hotel.id_hotel}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      Swal.fire("Éxito", "Hotel actualizado exitosamente", "success")
      setEditandoId(null)
      obtenerHoteles()
    } catch (error) {
      console.error("❌ Error al actualizar:", error)
      Swal.fire("Error", error?.response?.data?.error || "No se pudo actualizar el hotel", "error")
    }
  }

  const handleEliminar = async (hotel) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Deseas eliminar el hotel "${hotel.nombre}"? Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      })

      if (result.isConfirmed) {
        await api.delete(`/packages/Hotel/${hotel.id_hotel}`)

        const hotelesActualizados = hoteles.filter((h) => h.id_hotel !== hotel.id_hotel)
        setHoteles(hotelesActualizados)

        Swal.fire({
          title: "¡Eliminado!",
          text: "El hotel ha sido eliminado exitosamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    } catch (error) {
      console.error("❌ Error al eliminar:", error)
      let errorMessage = "No se pudo eliminar el hotel"
      if (error.response?.status === 404) {
        errorMessage = "El hotel no fue encontrado"
      } else if (error.response?.status === 403) {
        errorMessage = "No tienes permisos para eliminar este hotel"
      }
      Swal.fire("Error", errorMessage, "error")
    }
  }

  const handleReservar = (hotel) => {
    navigate(`/reservar-hotel/${hotel.id_hotel}`, {
      state: { hotel },
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base">Cargando hoteles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16 sm:pt-20 pb-8">
      <div className="flex flex-col items-center gap-6 sm:gap-8 px-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Hoteles Disponibles</h1>
          <p className="text-slate-600 text-sm sm:text-base">Encuentra el hotel perfecto para tu estadía</p>
        </div>

        {/* Controles superiores */}
        <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center">
          <RoleBasedComponent allowedRoles={["admin", "empleado"]}>
            <button
              onClick={() => navigate("/crearHotel")}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Agregar</span> Hotel
            </button>
          </RoleBasedComponent>

          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">{mostrarFiltros ? "Ocultar" : "Mostrar"}</span> Filtros
          </button>
        </div>

        {/* Panel de Filtros */}
        {mostrarFiltros && (
          <div className="max-w-6xl w-full">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                Filtros de Búsqueda
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Nombre del Hotel</label>
                  <input
                    type="text"
                    name="nombre"
                    value={filtros.nombre}
                    onChange={handleFiltroChange}
                    placeholder="Buscar por nombre..."
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Ubicación</label>
                  <input
                    type="text"
                    name="ubicacion"
                    value={filtros.ubicacion}
                    onChange={handleFiltroChange}
                    placeholder="Ciudad, país..."
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Estrellas Mín</label>
                  <select
                    name="estrellasMin"
                    value={filtros.estrellasMin}
                    onChange={handleFiltroChange}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-xs sm:text-sm"
                  >
                    <option value="">Cualquiera</option>
                    <option value="1">1 estrella</option>
                    <option value="2">2 estrellas</option>
                    <option value="3">3 estrellas</option>
                    <option value="4">4 estrellas</option>
                    <option value="5">5 estrellas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Estrellas Máx</label>
                  <select
                    name="estrellasMax"
                    value={filtros.estrellasMax}
                    onChange={handleFiltroChange}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-xs sm:text-sm"
                  >
                    <option value="">Cualquiera</option>
                    <option value="1">1 estrella</option>
                    <option value="2">2 estrellas</option>
                    <option value="3">3 estrellas</option>
                    <option value="4">4 estrellas</option>
                    <option value="5">5 estrellas</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={limpiarFiltros}
                    className="w-full px-3 sm:px-4 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded-lg transition-colors text-xs sm:text-sm font-semibold"
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              {/* Contador de resultados */}
              <div className="mt-4 text-xs sm:text-sm text-slate-600">
                Mostrando {hotelesFiltrados.length} de {hoteles.length} hoteles
              </div>
            </div>
          </div>
        )}

        {/* Grid de Hoteles */}
        {hotelesFiltrados.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="text-4xl sm:text-6xl mb-4">🏨</div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
              {hoteles.length === 0 ? "No hay hoteles disponibles" : "No se encontraron hoteles"}
            </h3>
            <p className="text-slate-500 mb-4 text-sm sm:text-base">
              {hoteles.length === 0 ? "Aún no se han registrado hoteles." : "Intenta ajustar los filtros de búsqueda."}
            </p>
            {filtros.nombre || filtros.ubicacion || filtros.estrellasMin || filtros.estrellasMax ? (
              <button
                onClick={limpiarFiltros}
                className="px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                Limpiar Filtros
              </button>
            ) : (
              <RoleBasedComponent allowedRoles={["admin", "empleado"]}>
                <button
                  onClick={() => navigate("/crearHotel")}
                  className="px-4 sm:px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  Registrar Primer Hotel
                </button>
              </RoleBasedComponent>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl w-full px-4">
            {hotelesFiltrados.map((hotel, index) => {
              const enEdicion = editandoId === hotel.id_hotel

              return (
                <div
                  key={hotel.id_hotel || index}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-3 sm:p-5 transform hover:-translate-y-1 border border-slate-100 cursor-pointer relative"
                  onClick={() => {
                    if (!enEdicion) {
                      setHotelSeleccionado(hotel)
                      setShowPreviewModal(true)
                    }
                  }}
                >
                  {/* Imagen del hotel */}
                  {(() => {
                    let imagenUrl = null
                    if (hotel.imagenes) {
                      try {
                        const arr = typeof hotel.imagenes === "string" ? JSON.parse(hotel.imagenes) : hotel.imagenes
                        if (Array.isArray(arr) && arr.length > 0) imagenUrl = arr[0]
                      } catch (e) {}
                    }
                    return imagenUrl ? (
                      <img
                        src={imagenUrl || "/placeholder.svg"}
                        alt={hotel.nombre}
                        className="w-full h-32 sm:h-40 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-32 sm:h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded-xl text-slate-500">
                        <div className="text-center">
                          <svg
                            className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <p className="text-xs sm:text-sm">Sin imagen</p>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Nombre del hotel */}
                  {enEdicion ? (
                    <input
                      name="nombre"
                      value={hotel.nombre}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full mt-3 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-base sm:text-xl font-bold"
                      placeholder="Nombre del hotel"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h2 className="text-base sm:text-xl font-bold mt-3 text-slate-800 line-clamp-2">{hotel.nombre}</h2>
                  )}

                  {/* Ubicación */}
                  <div className="flex items-center text-slate-600 mt-2 mb-3">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {enEdicion ? (
                      <input
                        name="ubicacion"
                        value={hotel.ubicacion}
                        onChange={(e) => handleChange(index, e)}
                        className="flex-1 p-1 border border-slate-300 rounded focus:ring-1 focus:ring-blue-400 text-xs sm:text-sm"
                        placeholder="Ubicación"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-xs sm:text-sm">{hotel.ubicacion}</span>
                    )}
                  </div>

                  {/* Estrellas */}
                  <div className="flex items-center mb-3">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500 mr-1" />
                    {enEdicion ? (
                      <select
                        name="estrellas"
                        value={hotel.estrellas || ""}
                        onChange={(e) => handleChange(index, e)}
                        className="p-1 border border-slate-300 rounded focus:ring-1 focus:ring-blue-400 text-xs sm:text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="">Seleccionar</option>
                        <option value="1">1 estrella</option>
                        <option value="2">2 estrellas</option>
                        <option value="3">3 estrellas</option>
                        <option value="4">4 estrellas</option>
                        <option value="5">5 estrellas</option>
                      </select>
                    ) : (
                      <span className="text-xs sm:text-sm font-semibold">
                        {Number(hotel.estrellas || 0).toFixed(1)} estrellas
                      </span>
                    )}
                  </div>

                  {/* Descripción */}
                  {enEdicion ? (
                    <textarea
                      name="descripcion"
                      value={hotel.descripcion || ""}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full mt-2 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-xs sm:text-sm resize-none"
                      placeholder="Descripción del hotel"
                      rows="3"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <p className="text-slate-600 text-xs sm:text-sm mb-4 line-clamp-2">
                      {hotel.descripcion || "Hotel con excelentes servicios y ubicación privilegiada."}
                    </p>
                  )}

                  {/* Botones de acción */}
                  <div className="flex gap-1 sm:gap-2 mb-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReservar(hotel)
                      }}
                      className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 text-xs sm:text-sm"
                      disabled={enEdicion}
                    >
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      Reservar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setHotelSeleccionado(hotel)
                        setShowPreviewModal(true)
                      }}
                      className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center"
                      title="Ver detalles"
                      disabled={enEdicion}
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {/* Botones de edición para admin */}
                  <RoleBasedComponent allowedRoles={["admin", "empleado"]}>
                    <div>
                      {enEdicion ? (
                        <div className="flex gap-1 sm:gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleGuardar(hotel)
                            }}
                            className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 text-xs sm:text-sm"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditandoId(null)
                            }}
                            className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-xl transition-all duration-200 text-xs sm:text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-1 sm:gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditandoId(hotel.id_hotel)
                            }}
                            className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 text-xs sm:text-sm flex items-center justify-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Editar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEliminar(hotel)
                            }}
                            className="px-2 sm:px-4 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 text-xs sm:text-sm flex items-center justify-center"
                            title="Eliminar hotel"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </RoleBasedComponent>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal de Preview del Hotel */}
        {showPreviewModal && hotelSeleccionado && (
          <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              {/* Header del modal */}
              <div className="relative bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 text-white p-4 sm:p-6">
                <button
                  onClick={() => {
                    setShowPreviewModal(false)
                    setHotelSeleccionado(null)
                    setVerHabitacionesId(null)
                  }}
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="pr-12">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">{hotelSeleccionado.nombre}</h2>
                  <div className="flex text-black items-center gap-2 flex-wrap">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs sm:text-sm flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {hotelSeleccionado.ubicacion}
                    </span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs sm:text-sm flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      {Number(hotelSeleccionado.estrellas || 0).toFixed(1)} estrellas
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido del modal */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  {/* Columna izquierda - Imagen */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3">Imagen del Hotel</h3>
                    {(() => {
                      let imagenUrl = null
                      if (hotelSeleccionado.imagenes) {
                        try {
                          const arr =
                            typeof hotelSeleccionado.imagenes === "string"
                              ? JSON.parse(hotelSeleccionado.imagenes)
                              : hotelSeleccionado.imagenes
                          if (Array.isArray(arr) && arr.length > 0) imagenUrl = arr[0]
                        } catch (e) {}
                      }
                      return imagenUrl ? (
                        <img
                          src={imagenUrl || "/placeholder.svg"}
                          alt={hotelSeleccionado.nombre}
                          className="w-full h-48 sm:h-64 object-cover rounded-2xl shadow-lg"
                        />
                      ) : (
                        <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center rounded-2xl">
                          <div className="text-center">
                            <svg
                              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            <p className="text-slate-500 text-sm sm:text-base">No hay imagen disponible</p>
                          </div>
                        </div>
                      )
                    })()}

                    {/* Descripción */}
                    <div className="mt-6">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3">Descripción</h3>
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg text-sm sm:text-base">
                        {hotelSeleccionado.descripcion ||
                          "Hotel con excelentes servicios y ubicación privilegiada. Perfecto para una estadía cómoda y memorable."}
                      </p>
                    </div>
                  </div>

                  {/* Columna derecha - Información */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Información básica */}
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 rounded-xl">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">Información del Hotel</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 text-sm">Nombre:</span>
                          <span className="font-semibold text-sm">{hotelSeleccionado.nombre}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 text-sm">Ubicación:</span>
                          <span className="font-semibold text-sm">{hotelSeleccionado.ubicacion}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 text-sm">Calificación:</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-amber-500 mr-1" />
                            <span className="font-semibold text-sm">
                              {Number(hotelSeleccionado.estrellas || 0).toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 text-sm">ID:</span>
                          <span className="font-mono text-sm">{hotelSeleccionado.id_hotel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Habitaciones */}
                    <div className="space-y-4">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 flex items-center">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-500"
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
                        Habitaciones
                      </h3>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <button
                          onClick={() =>
                            setVerHabitacionesId(
                              verHabitacionesId === hotelSeleccionado.id_hotel ? null : hotelSeleccionado.id_hotel,
                            )
                          }
                          className="w-full px-4 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
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
                              } catch (e) {}
                              return imagenes.length ? (
                                <HabitacionCarrusel imagenes={imagenes} />
                              ) : (
                                <div className="text-center py-8">
                                  <svg
                                    className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-slate-400 mb-4"
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
                                  <p className="text-slate-500 text-sm sm:text-base">
                                    No hay imágenes de habitaciones disponibles
                                  </p>
                                </div>
                              )
                            })()}

                            {/* Botón solo para admin/empleado */}
                            <RoleBasedComponent allowedRoles={["admin", "empleado"]}>
                              <div className="pt-2">
                                <button
                                  onClick={() => document.getElementById("inputHabitacionesModal").click()}
                                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
                                >
                                  + Agregar imágenes de habitaciones
                                </button>
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
                                        actuales =
                                          typeof hotelActual.imageneshabitaciones === "string"
                                            ? JSON.parse(hotelActual.imageneshabitaciones)
                                            : hotelActual.imageneshabitaciones || []
                                      } catch (e) {}
                                      const nuevasUrls = nuevas.map((img) => URL.createObjectURL(img))
                                      const todas = [...actuales, ...nuevasUrls]
                                      const nuevosHoteles = [...hoteles]
                                      nuevosHoteles[index].imageneshabitaciones = todas
                                      nuevosHoteles[index].imageneshabitacionesNuevas = nuevas
                                      setHoteles(nuevosHoteles)
                                      setHotelSeleccionado({
                                        ...hotelSeleccionado,
                                        imageneshabitaciones: todas,
                                        imageneshabitacionesNuevas: nuevas,
                                      })
                                    }
                                  }}
                                />
                              </div>
                            </RoleBasedComponent>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Precios estimados */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-6 rounded-xl border border-emerald-200">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-4">Precios por Noche</h3>
                      <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span>Individual:</span>
                          <span className="font-semibold">$150,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Doble:</span>
                          <span className="font-semibold">$250,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Suite:</span>
                          <span className="font-semibold">$400,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Familiar:</span>
                          <span className="font-semibold">$350,000</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-3">
                        * Precios aproximados. Pueden variar según temporada y disponibilidad.
                      </p>
                    </div>

                    {/* Botón de reserva */}
                    <button
                      onClick={() => {
                        setShowPreviewModal(false)
                        handleReservar(hotelSeleccionado)
                      }}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 font-bold text-sm sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                      Reservar Hotel
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer del modal con botones de admin */}
              <div className="border-t bg-gradient-to-r from-slate-50 to-blue-50 px-4 sm:px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="text-xs sm:text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                      ID: {hotelSeleccionado.id_hotel}
                    </div>
                  </div>

                  <RoleBasedComponent allowedRoles={["admin", "empleado"]}>
                    <div className="flex gap-3">
                      {editandoId === hotelSeleccionado.id_hotel ? (
                        <>
                          <button
                            onClick={() => setEditandoId(null)}
                            className="px-4 sm:px-6 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleGuardar(hotelSeleccionado)}
                            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
                          >
                            Guardar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditandoId(hotelSeleccionado.id_hotel)}
                            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(hotelSeleccionado)}
                            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
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
    </div>
  )
}
