"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  Heart,
  Package,
  Plane,
  Hotel,
  Eye,
  Trash2,
  Filter,
  Search,
} from "lucide-react"
import api from "../../Services/AxiosInstance/AxiosInstance"
import Swal from "sweetalert2"

export const MisViajes = () => {
  const navigate = useNavigate()
  const [reservas, setReservas] = useState([])
  const [reservasLocales, setReservasLocales] = useState([])
  const [paquetesFavoritos, setPaquetesFavoritos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      await Promise.all([cargarReservas(), cargarReservasLocales(), cargarPaquetesFavoritos()])
    } catch (error) {
      console.error("Error al cargar datos:", error)
    } finally {
      setLoading(false)
    }
  }

  const cargarReservas = async () => {
    try {
      const response = await api.get("reservas/Historial")
      let fetchedReservas = []

      if (response.data && response.data.historial) {
        if (Array.isArray(response.data.historial)) {
          fetchedReservas = response.data.historial
        } else if (typeof response.data.historial === "object" && response.data.historial !== null) {
          // Si es un objeto individual (como se ve en el error), lo envolvemos en un array
          fetchedReservas = [response.data.historial]
          console.warn(
            "API devolvió un objeto individual para historial, envolviéndolo en un array:",
            response.data.historial,
          )
        } else {
          console.warn("API devolvió un tipo inesperado para historial:", response.data.historial)
        }
      } else {
        console.warn("La estructura de la respuesta de la API no es la esperada:", response.data)
      }

      setReservas(fetchedReservas)
    } catch (error) {
      console.error("Error al cargar reservas:", error)
      setReservas([]) // Asegurarse de que siempre sea un array vacío en caso de error
    }
  }

  const cargarReservasLocales = () => {
    try {
      const reservasGuardadas = localStorage.getItem("reservasLocales")
      if (reservasGuardadas) {
        setReservasLocales(JSON.parse(reservasGuardadas))
      }
    } catch (error) {
      console.error("Error al cargar reservas locales:", error)
      setReservasLocales([])
    }
  }

  const cargarPaquetesFavoritos = () => {
    try {
      const favoritos = localStorage.getItem("paquetesFavoritos")
      if (favoritos) {
        setPaquetesFavoritos(JSON.parse(favoritos))
      }
    } catch (error) {
      console.error("Error al cargar paquetes favoritos:", error)
      setPaquetesFavoritos([])
    }
  }

  const eliminarDeFavoritos = (idPaquete) => {
    Swal.fire({
      title: "¿Eliminar de favoritos?",
      text: "Este paquete se eliminará de tu lista de favoritos",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevosFavoritos = paquetesFavoritos.filter((paquete) => paquete.id_paquete !== idPaquete)
        setPaquetesFavoritos(nuevosFavoritos)
        localStorage.setItem("paquetesFavoritos", JSON.stringify(nuevosFavoritos))

        Swal.fire({
          title: "Eliminado",
          text: "El paquete ha sido eliminado de tus favoritos",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    })
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible"
    try {
      const date = new Date(fecha)
      if (isNaN(date.getTime())) {
        return "Fecha inválida"
      }
      return date.toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return "Fecha inválida"
    }
  }

  const formatearPrecio = (precio) => {
    if (typeof precio !== "number" && typeof precio !== "string") return "Precio no disponible"
    const numPrecio = Number(precio)
    if (isNaN(numPrecio)) return "Precio no disponible"
    return `$${numPrecio.toLocaleString("es-CO")} COP`
  }

  const totalReservas = reservas.length + reservasLocales.length
  const totalFavoritos = paquetesFavoritos.length

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <Package className="w-5 h-5" /> },
    { id: "reservas", label: "Mis Reservas", icon: <Calendar className="w-5 h-5" /> },
    { id: "favoritos", label: "Favoritos", icon: <Heart className="w-5 h-5" /> },
  ]

  const renderDashboard = () => (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">Total Reservas</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">{totalReservas}</p>
            </div>
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs sm:text-sm font-medium">Del Sistema</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">{reservas.length}</p>
            </div>
            <Plane className="w-6 h-6 sm:w-8 sm:h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs sm:text-sm font-medium">Locales</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">{reservasLocales.length}</p>
            </div>
            <Hotel className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-xs sm:text-sm font-medium">Favoritos</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">{totalFavoritos}</p>
            </div>
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-200" />
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/paquetes")}
            className="flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-lg sm:rounded-xl border border-emerald-200 transition-all duration-200 group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Explorar Paquetes</p>
              <p className="text-xs sm:text-sm text-gray-600">Descubre nuevos destinos</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/hoteles")}
            className="flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg sm:rounded-xl border border-blue-200 transition-all duration-200 group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Hotel className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Reservar Hotel</p>
              <p className="text-xs sm:text-sm text-gray-600">Encuentra alojamiento</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("favoritos")}
            className="flex items-center space-x-3 p-3 sm:p-4 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 rounded-lg sm:rounded-xl border border-pink-200 transition-all duration-200 group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Ver Favoritos</p>
              <p className="text-xs sm:text-sm text-gray-600">{totalFavoritos} paquetes guardados</p>
            </div>
          </button>
        </div>
      </div>

      {/* Resumen de Actividad */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Actividad Reciente</h3>
        <div className="space-y-3 sm:space-y-4">
          {totalReservas === 0 && totalFavoritos === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-500 text-sm sm:text-base">No tienes actividad reciente</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">¡Comienza explorando nuestros paquetes!</p>
            </div>
          ) : (
            <>
              {/* Mostrar las últimas 3 reservas del sistema */}
              {reservas.slice(0, 3).map((reserva, index) => (
                <div
                  key={`reserva-actividad-${index}`}
                  className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      Reserva confirmada: {reserva.nombreHotel || "Hotel"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {formatearFecha(reserva.fecha_inicio)} • {formatearPrecio(reserva.precioTotal || 0)}
                    </p>
                  </div>
                </div>
              ))}
              {/* Mostrar los últimos 2 paquetes favoritos */}
              {paquetesFavoritos.slice(0, 2).map((paquete, index) => (
                <div
                  key={`favorito-actividad-${index}`}
                  className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      Agregado a favoritos: {paquete.nombrePaquete}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {paquete.nombre_destino} • {formatearPrecio(paquete.precioTotal)}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )

  const renderReservas = () => (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Mis Reservas</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Gestiona todas tus reservas de viaje en un solo lugar
          </p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtrar</span>
          </button>
          <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">Buscar</span>
          </button>
        </div>
      </div>

      {/* Reservas del Sistema */}
      {reservas.length > 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Plane className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Reservas del Sistema</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              {reservas.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {reservas.map((reserva, index) => (
              <div
                key={`reserva-sistema-${index}`}
                className="border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
                      {reserva.nombreHotel || "Reserva de Hotel"}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{reserva.destino || reserva.nombreHotel || "Destino no especificado"}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Confirmada
                  </span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Fecha Inicio: {formatearFecha(reserva.fecha_inicio)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Fecha Fin: {formatearFecha(reserva.fecha_fin)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Cédula: {reserva.cedula || "N/A"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Hotel className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>ID Habitación: {reserva.id_habitacion || "N/A"}</span>
                  </div>
                  {reserva.observacion && (
                    <div className="flex items-center space-x-2">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Observación: {reserva.observacion}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <span className="font-bold text-emerald-600 text-sm sm:text-base">
                    {formatearPrecio(reserva.precioTotal || 0)}
                  </span>
                  <button className="flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-xs sm:text-sm">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Ver Detalles</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reservas Locales */}
      {reservasLocales.length > 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Hotel className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Reservas Locales</h3>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
              {reservasLocales.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {reservasLocales.map((reserva, index) => (
              <div
                key={`reserva-local-${index}`}
                className="border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
                      {reserva.nombrePaquete || "Reserva Local"}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{reserva.destino || "Destino local"}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                    Local
                  </span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Fecha: {formatearFecha(reserva.fechaReserva)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Personas: {reserva.cantidadPersonas || 1}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <span className="font-bold text-purple-600 text-sm sm:text-base">
                    {formatearPrecio(reserva.precioTotal)}
                  </span>
                  <button className="flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-xs sm:text-sm">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Ver Detalles</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {reservas.length === 0 && reservasLocales.length === 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-12 text-center">
          <Calendar className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No tienes reservas aún</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            ¡Explora nuestros increíbles paquetes de viaje y haz tu primera reserva!
          </p>
          <button
            onClick={() => navigate("/paquetes")}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors"
          >
            <Package className="w-5 h-5" />
            <span>Explorar Paquetes</span>
          </button>
        </div>
      )}
    </div>
  )

  const renderFavoritos = () => (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Paquetes Favoritos</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Tus paquetes de viaje guardados para más tarde</p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <span className="px-3 py-1.5 bg-pink-100 text-pink-800 text-sm font-medium rounded-full">
            {totalFavoritos} favoritos
          </span>
        </div>
      </div>

      {/* Lista de Favoritos */}
      {paquetesFavoritos.length > 0 ? (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {paquetesFavoritos.map((paquete, index) => (
              <div
                key={`favorito-${index}`}
                className="border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={paquete.imagenUrl || "/placeholder.svg?height=200&width=300"}
                    alt={paquete.nombrePaquete}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => eliminarDeFavoritos(paquete.id_paquete)}
                      className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                  {paquete.descuento > 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        -{paquete.descuento}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2">
                      {paquete.nombrePaquete}
                    </h3>
                    <div className="flex items-center space-x-1 ml-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">4.8</span>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{paquete.nombre_destino || paquete.nombreDestino}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{paquete.duracionDias} días</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <Package className="w-3 h-3 sm:w-4" />
                      <span className="capitalize">{paquete.categoria || "Aventura"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg sm:text-xl font-bold text-emerald-600">
                        {formatearPrecio(paquete.precioTotal || paquete.precio)}
                      </span>
                      <p className="text-xs text-gray-500">por persona</p>
                    </div>
                    <button
                      onClick={() => navigate(`/paquetes/${paquete.id_paquete}`)}
                      className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Ver Detalles</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-8 sm:p-12 text-center">
          <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4 sm:mb-6" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No tienes favoritos aún</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Guarda tus paquetes favoritos para encontrarlos fácilmente más tarde
          </p>
          <button
            onClick={() => navigate("/paquetes")}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold transition-colors"
          >
            <Heart className="w-5 h-5" />
            <span>Explorar Paquetes</span>
          </button>
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus viajes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mis Viajes</h1>
              <p className="text-sm sm:text-base text-gray-600">Gestiona tus reservas y paquetes favoritos</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6 sm:mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 sm:px-6 py-3 sm:py-4 border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
                  activeTab === tab.id
                    ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                    : "border-transparent text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "reservas" && renderReservas()}
        {activeTab === "favoritos" && renderFavoritos()}
      </div>
    </div>
  )
}
