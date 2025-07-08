import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Users,
  Package,
  BarChart3,
  Settings,
  Shield,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  Star,
  MapPin,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react"
import api from "../../Services/AxiosInstance/AxiosInstance"
import Swal from "sweetalert2"

const NewUserModal = ({ open, onClose, onCreate }) => {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", rol: "Empleado" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onCreate(form)
    setLoading(false)
    setForm({ nombre: "", email: "", telefono: "", rol: "Empleado" })
  }

  if (!open) return null
  return (
    <div className="fixed inset-0 bg-emerald-100 bg-opacity-80 flex items-center justify-center z-50 transition-all">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-emerald-700">Crear Nuevo Empleado</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            placeholder="Nombre"
            className="w-full border rounded p-2 focus:ring-2 focus:ring-emerald-300"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email"
            type="email"
            className="w-full border rounded p-2 focus:ring-2 focus:ring-emerald-300"
          />
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            required
            placeholder="Teléfono"
            className="w-full border rounded p-2 focus:ring-2 focus:ring-emerald-300"
          />
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-emerald-300"
          >
            <option value="Empleado">Empleado</option>
            <option value="admin">admin</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white rounded p-2 hover:bg-emerald-600 transition"
          >
            {loading ? "Creando..." : "Crear Usuario"}
          </button>
        </form>
      </div>
    </div>
  )
}

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [infoDashBoard, setInfoDashBoard] = useState(null)
  const [infoUser, setInfoUser] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [filterRol, setFilterRol] = useState("")
  const [infoPaquetes, setInfoPaquetes] = useState(null)
  const [loadingPaquetes, setLoadingPaquetes] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    handleGetInfo()
    handleGetInfoUser()
  }, [])

  // Cambia la consulta al backend según el filtro de rol
  const handleFilterUserByRol = async (rol) => {
    try {
      let endpoint = "admin/Users/cliente"
      if (rol === "admin") endpoint = "admin/Users/admin"
      else if (rol === "Empleado") endpoint = "admin/Users/empleado"
      // Si es "Todos" o vacío, usa cliente (o podrías crear un endpoint para todos)
      const response = await api.get(endpoint)
      setInfoUser(response.data)
    } catch (error) {
      setInfoUser({ user: [] })
      Swal.fire("Error", "Error al filtrar usuarios por rol", "error")
    }
  }

  // useEffect para filtrar usuarios por rol SOLO cuando cambia el filtro y el tab activo es "users"
  useEffect(() => {
    if (activeTab === "users") {
      handleFilterUserByRol(filterRol || "cliente")
    }
    // eslint-disable-next-line
  }, [filterRol, activeTab])

  const adminTabs = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "users", label: "Usuarios", icon: <Users className="w-5 h-5" /> },
    { id: "packages", label: "Paquetes", icon: <Package className="w-5 h-5" /> },
    { id: "reports", label: "Reportes", icon: <FileText className="w-5 h-5" /> },
    { id: "settings", label: "Configuración", icon: <Settings className="w-5 h-5" /> },
  ]

  const handleNewUser = async (data) => {
    try {
      const response = await api.post("admin/CreateUsers", data)
      console.log("Nuevo usuario creado con éxito:", response.data)
      setModalOpen(false)
      handleGetInfoUser() // refresca la lista
      // Mostrar la contraseña generada si viene en la respuesta
      if (response.data && response.data.password) {
        Swal.fire({
          title: "Usuario creado exitosamente",
          html: `<b>Contraseña generada:</b> <span style='font-family:monospace'>${response.data.password}</span>`,
          icon: "success",
          confirmButtonColor: "#10b981",
        })
      } else {
        Swal.fire("Usuario creado exitosamente", "", "success")
      }
    } catch (error) {
      Swal.fire("Error", "Error al crear usuario", "error")
      console.error(error)
    }
  }

  const handleGetInfo = async () => {
    try {
      const response = await api.get("admin/Info/Dashboard")
      console.log("informacion traida con exito✅")
      console.log("informacion del dashboard", response.data)
      setInfoDashBoard(response.data)
    } catch (error) {
      console.error("Error al obtener la información del dashboard:", error)
      Swal.fire("Error", "Error al obtener la información del dashboard", "error")
    }
  }

  const handleGetInfoUser = async () => {
    try {
      const response = await api.get("admin/Users/cliente")
      console.log("informacion de usuario traida con exito✅")
      console.log("informacion del usuario", response.data)
      setInfoUser(response.data)
      // Aquí podrías hacer algo con la información del usuario si es necesario
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error)
      Swal.fire("Error", "Error al obtener la información del usuario", "error")
    }
  }

  const handleGetPaquetes = async () => {
    try {
      setLoadingPaquetes(true)
      const response = await api.get("packages")
      console.log("Paquetes obtenidos con éxito✅", response.data)
      setInfoPaquetes(response.data)
    } catch (error) {
      console.error("Error al obtener paquetes:", error)
      Swal.fire("Error", "Error al obtener los paquetes", "error")
    } finally {
      setLoadingPaquetes(false)
    }
  }

  useEffect(() => {
    if (activeTab === "packages") {
      handleGetPaquetes()
    }
  }, [activeTab])

  // Actualiza los valores de stats con la info del backend si está disponible
  const stats = [
    {
      title: "Total Usuarios",
      value: infoDashBoard?.totalUsuarios?.toString() || "0",
      change: "+12%",
      icon: <Users className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Paquetes Activos",
      value: infoDashBoard?.paquetesActivos?.toString() || "0",
      change: "+5%",
      icon: <Package className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      title: "Ventas del Mes",
      value: infoDashBoard?.ventasDelMes
        ? `$${Number(infoDashBoard.ventasDelMes).toLocaleString("es-CO", { minimumFractionDigits: 2 })}`
        : "$0.00",
      change: "+18%",
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-purple-500",
    },
    {
      title: "Reservas Pendientes",
      value: infoDashBoard?.reservasPendientes?.toString() || "0",
      change: "-3%",
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-orange-500",
    },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className={`text-sm mt-1 ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                        {stat.change} vs mes anterior
                      </p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg text-white`}>{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
              <div className="space-y-4">
                {(infoDashBoard?.actividadReciente || []).map((activity, index) => {
                  // Formatear fecha
                  const fecha = activity.created_at
                    ? new Date(activity.created_at).toLocaleString("es-CO", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : ""
                  return (
                    <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Se creó el paquete: <span className="font-semibold">{activity.nombrePaquete}</span>
                        </p>
                        <p className="text-xs text-gray-500">{fecha}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )

      case "users":
        const usuariosFiltrados = infoUser?.user || []
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <NewUserModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleNewUser} />
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Nuevo Usuario
              </button>
            </div>
            <div className="flex items-center mb-4 gap-2">
              <label className="text-sm font-medium text-gray-700">Filtrar por rol:</label>
              <select value={filterRol} onChange={(e) => setFilterRol(e.target.value)} className="border rounded p-1">
                <option value="">Clientes</option>
                <option value="Empleado">Empleado</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Usuario</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-gray-400">
                        No hay usuarios para este rol.
                      </td>
                    </tr>
                  ) : (
                    usuariosFiltrados.map((user, index) => (
                      <tr key={user.id_usuario || index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">{user.id_usuario}</td>
                        <td className="py-3 px-4">{user.nombre}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">{user.rol || "Empleado"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )

      case "packages":
        const paquetes = infoPaquetes?.paquetes || []
        return (
          <div className="space-y-6">
            {/* Packages Management Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Paquetes</h3>
                  <p className="text-gray-600">Administra todos los paquetes turísticos de la plataforma</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate("/crearPaquete")}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                  >
                    <Package className="w-5 h-5" />
                    <span>Crear Paquete</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Package Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Paquetes</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{paquetes.length}</p>
                    <p className="text-sm text-green-600 mt-1">+{Math.floor(paquetes.length * 0.1)} este mes</p>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Paquetes Activos</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {paquetes.filter((p) => p.estado !== "inactivo").length}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {Math.round((paquetes.filter((p) => p.estado !== "inactivo").length / paquetes.length) * 100) ||
                        0}
                      % del total
                    </p>
                  </div>
                  <div className="bg-green-500 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Más Popular</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{paquetes[0]?.nombrePaquete || "N/A"}</p>
                    <p className="text-sm text-blue-600 mt-1">Destacado</p>
                  </div>
                  <div className="bg-purple-500 p-3 rounded-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Promedio Duración</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {paquetes.length > 0
                        ? Math.round(paquetes.reduce((acc, p) => acc + (p.duracionDias || 0), 0) / paquetes.length)
                        : 0}{" "}
                      días
                    </p>
                    <p className="text-sm text-green-600 mt-1">Duración media</p>
                  </div>
                  <div className="bg-orange-500 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Packages Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">Lista de Paquetes</h4>
              </div>

              {loadingPaquetes ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">Cargando paquetes...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Paquete</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Destino</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Categoría</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Duración</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Descuento</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Hotel</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paquetes.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-gray-500">
                            No hay paquetes disponibles
                          </td>
                        </tr>
                      ) : (
                        paquetes.map((paquete, index) => (
                          <tr
                            key={paquete.id_paquete || index}
                            className="hover:bg-gray-50 transition-colors duration-200"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-4">
                                <img
                                  src={paquete.imagenUrl || "/placeholder.svg?height=60&width=80"}
                                  alt={paquete.nombrePaquete}
                                  className="w-16 h-12 object-cover rounded-lg"
                                />
                                <div>
                                  <p className="font-semibold text-gray-900">{paquete.nombrePaquete}</p>
                                  <p className="text-sm text-gray-500">ID: {paquete.id_paquete}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">
                                  {paquete.nombre_destino || paquete.nombreDestino || "No especificado"}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  paquete.categoria === "cultural"
                                    ? "bg-purple-100 text-purple-800"
                                    : paquete.categoria === "aventura"
                                      ? "bg-orange-100 text-orange-800"
                                      : paquete.categoria === "playa"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-green-100 text-green-800"
                                }`}
                              >
                                {paquete.categoria || "Sin categoría"}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">{paquete.duracionDias} días</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className="font-semibold text-emerald-600">{paquete.descuento || 0}%</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-gray-900">
                                {paquete.nombreHotel || paquete.numero_habitacion || "No especificado"}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => navigate(`/paquetes`)}
                                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                                  title="Ver detalles"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                  title="Editar paquete"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                  title="Eliminar paquete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {adminTabs.find((tab) => tab.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600">Contenido de {activeTab} en desarrollo...</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600">Gestiona tu plataforma ZenTravel</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {adminTabs.map((tab) => (
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
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  )
}
