import { useEffect, useState } from "react"
import { Users, Package, BarChart3, Settings, Shield, FileText, Calendar, DollarSign } from "lucide-react"
import api from "../../Services/AxiosInstance/AxiosInstance"


export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [infoDashBoard, setInfoDashBoard] = useState(null)
  const [infoUser, setInfoUser] = useState(null)

  useEffect(() => {
    handleGetInfo()
    handleGetInfoUser()
  }, [])

  const adminTabs = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "users", label: "Usuarios", icon: <Users className="w-5 h-5" /> },
    { id: "packages", label: "Paquetes", icon: <Package className="w-5 h-5" /> },
    { id: "reports", label: "Reportes", icon: <FileText className="w-5 h-5" /> },
    { id: "settings", label: "Configuración", icon: <Settings className="w-5 h-5" /> },
  ]

  const handleGetInfo = async () => {

    try {
      const response = await api.get("admin/Info/Dashboard")
      console.log("informacion traida con exito✅");
      console.log("informacion del dashboard", response.data);
      setInfoDashBoard(response.data)

    } catch (error) {
      console.error("Error al obtener la información del dashboard:", error)
      alert("Error al obtener la información del dashboard")
    }
  }

  const handleGetInfoUser = async () => {
    try {
      const response = await api.get("admin/Users/cliente")
      console.log("informacion de usuario traida con exito✅");
      console.log("informacion del usuario", response.data);
      setInfoUser(response.data)
      // Aquí podrías hacer algo con la información del usuario si es necesario
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error)
      alert("Error al obtener la información del usuario")
    }

  }


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
      value: infoDashBoard?.ventasDelMes ? `$${Number(infoDashBoard.ventasDelMes).toLocaleString('es-CO', { minimumFractionDigits: 2 })}` : "$0.00",
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
                    ? new Date(activity.created_at).toLocaleString('es-CO', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                    : '';
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
                  );
                })}
              </div>
            </div>
          </div>
        )

      case "users":
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                Nuevo Usuario
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Usuario</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {(infoUser?.user || []).map((user, index) => (
                    <tr key={user.id_usuario || index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{user.id_usuario}</td>
                      <td className="py-3 px-4">{user.nombre}</td>
                      <td className="py-3 px-4">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
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
