"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  Eye,
  Package,
  Users,
  DollarSign,
  Filter,
  Search,
  Download,
  Share2,
} from "lucide-react"
import api from "../../Services/AxiosInstance/AxiosInstance"
import Swal from "sweetalert2"

export const MisViajes = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("favoritos")
  const [favoritos, setFavoritos] = useState([])
  const [reservas, setReservas] = useState([])
  const [filtro, setFiltro] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [loading, setLoading] = useState(false)

  // Cargar favoritos del localStorage
  useEffect(() => {
    const favoritosGuardados = localStorage.getItem("paquetesFavoritos")
    if (favoritosGuardados) {
      setFavoritos(JSON.parse(favoritosGuardados))
    }
  }, [])

  // Cargar reservas del usuario (simulado por ahora)
  useEffect(() => {
    cargarReservas()
  }, [])

  const cargarReservas = async () => {
    try {
      setLoading(true)
      // Aquí iría la llamada real a la API para obtener las reservas del usuario
      // const response = await api.get("/user/reservas")
      // setReservas(response.data)

      // Por ahora simulamos algunas reservas
      const reservasSimuladas = [
        {
          id: 1,
          nombrePaquete: "Aventura en Cartagena",
          fechaReserva: "2024-01-15",
          fechaViaje: "2024-03-20",
          estado: "confirmado",
          precio: 850000,
          destino: "Cartagena",
          duracion: 4,
          personas: 2,
        },
        {
          id: 2,
          nombrePaquete: "Escapada a San Andrés",
          fechaReserva: "2024-02-10",
          fechaViaje: "2024-04-15",
          estado: "pendiente",
          precio: 1200000,
          destino: "San Andrés",
          duracion: 5,
          personas: 1,
        },
      ]
      setReservas(reservasSimuladas)
    } catch (error) {
      console.error("Error al cargar reservas:", error)
    } finally {
      setLoading(false)
    }
  }

  const eliminarFavorito = (id) => {
    Swal.fire({
      title: "¿Eliminar de favoritos?",
      text: "Este paquete será removido de tu lista de favoritos",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevosFavoritos = favoritos.filter((fav) => fav.id_paquete !== id)
        setFavoritos(nuevosFavoritos)
        localStorage.setItem("paquetesFavoritos", JSON.stringify(nuevosFavoritos))

        Swal.fire({
          title: "Eliminado",
          text: "El paquete ha sido removido de favoritos",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    })
  }

  const comprarPaquete = async (paquete) => {
    try {
      const response = await api.post("/api/payments/create", {
        price: 10.0,
        name: paquete.nombrePaquete,
        quantity: 1,
      })

      const approvalUrl = response.data.approval_url
      if (approvalUrl) {
        window.location.href = approvalUrl
      } else {
        Swal.fire("Error", "No se pudo procesar el pago", "error")
      }
    } catch (error) {
      console.error("Error al procesar pago:", error)
      Swal.fire("Error", "Error al procesar el pago", "error")
    }
  }

  const compartirPaquete = (paquete) => {
    if (navigator.share) {
      navigator.share({
        title: paquete.nombrePaquete,
        text: paquete.descripcion,
        url: window.location.origin + "/paquetes",
      })
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.origin + "/paquetes")
      Swal.fire({
        title: "Enlace copiado",
        text: "El enlace ha sido copiado al portapapeles",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const filtrarElementos = (elementos) => {
    return elementos.filter((elemento) => {
      const coincideBusqueda =
        elemento.nombrePaquete?.toLowerCase().includes(busqueda.toLowerCase()) ||
        elemento.destino?.toLowerCase().includes(busqueda.toLowerCase()) ||
        elemento.nombre_destino?.toLowerCase().includes(busqueda.toLowerCase())

      if (activeTab === "favoritos") {
        const coincideFiltro = filtro === "" || elemento.categoria === filtro
        return coincideBusqueda && coincideFiltro
      } else {
        const coincideFiltro = filtro === "" || elemento.estado === filtro
        return coincideBusqueda && coincideFiltro
      }
    })
  }

  const tabs = [
    { id: "favoritos", label: "Favoritos", icon: <Heart className="w-5 h-5" />, count: favoritos.length },
    { id: "reservas", label: "Mis Reservas", icon: <Calendar className="w-5 h-5" />, count: reservas.length },
  ]

  const estadoColors = {
    confirmado: "bg-green-100 text-green-800",
    pendiente: "bg-yellow-100 text-yellow-800",
    cancelado: "bg-red-100 text-red-800",
    completado: "bg-blue-100 text-blue-800",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-6 shadow-lg">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mis
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Viajes</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gestiona tus paquetes favoritos y revisa el estado de tus reservas
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                    : "border-transparent text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o destino..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
              />
            </div>

            {/* Filtro */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-white"
              >
                <option value="">Todos</option>
                {activeTab === "favoritos" ? (
                  <>
                    <option value="aventura">Aventura</option>
                    <option value="playa">Playa</option>
                    <option value="cultural">Cultural</option>
                    <option value="naturaleza">Naturaleza</option>
                    <option value="urbano">Urbano</option>
                    <option value="gastronomico">Gastronómico</option>
                  </>
                ) : (
                  <>
                    <option value="confirmado">Confirmado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="cancelado">Cancelado</option>
                    <option value="completado">Completado</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Contenido */}
        {activeTab === "favoritos" ? (
          <div>
            {filtrarElementos(favoritos).length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes favoritos aún</h3>
                <p className="text-gray-600 mb-6">Explora nuestros paquetes y guarda los que más te gusten</p>
                <button
                  onClick={() => navigate("/paquetes")}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Explorar Paquetes
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtrarElementos(favoritos).map((paquete) => (
                  <div
                    key={paquete.id_paquete}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative">
                      <img
                        src={paquete.imagenUrl || "/placeholder.svg?height=200&width=300"}
                        alt={paquete.nombrePaquete}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => eliminarFavorito(paquete.id_paquete)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 transition-colors duration-200"
                        >
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                      {paquete.categoria && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                            {paquete.categoria}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{paquete.nombrePaquete}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{paquete.descripcion}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{paquete.nombre_destino || paquete.nombreDestino || "Destino no especificado"}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{paquete.duracionDias} días</span>
                        </div>
                        {paquete.precioTotal && (
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span>${Number(paquete.precioTotal).toLocaleString()} COP</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate("/paquetes")}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => compartirPaquete(paquete)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Compartir"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => comprarPaquete(paquete)}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando reservas...</p>
              </div>
            ) : filtrarElementos(reservas).length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes reservas</h3>
                <p className="text-gray-600 mb-6">Cuando realices una reserva, aparecerá aquí</p>
                <button
                  onClick={() => navigate("/paquetes")}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Explorar Paquetes
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filtrarElementos(reservas).map((reserva) => (
                  <div
                    key={reserva.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{reserva.nombrePaquete}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${estadoColors[reserva.estado]}`}
                          >
                            {reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{reserva.destino}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{new Date(reserva.fechaViaje).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{reserva.duracion} días</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            <span>
                              {reserva.personas} persona{reserva.personas > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 text-sm text-gray-500">
                          <span>Reservado el: {new Date(reserva.fechaReserva).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex flex-col lg:items-end gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${reserva.precio.toLocaleString()} COP</p>
                          <p className="text-sm text-gray-500">Total pagado</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="Descargar"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                            title="Compartir"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
