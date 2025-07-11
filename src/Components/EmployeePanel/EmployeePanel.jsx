"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Users,
  Package,
  Calendar,
  MessageCircle,
  DollarSign,
  CheckCircle,
  Star,
  MapPin,
  Eye,
  Edit2,
  TrendingUp,
  Clock,
  UserCheck,
} from "lucide-react"
import api from "../../Services/AxiosInstance/AxiosInstance"
import Swal from "sweetalert2"

const EditarPaqueteModal = ({ open, onClose, paquete, onSave }) => {
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(false)
  const [precioOriginal, setPrecioOriginal] = useState(0)
  const [duracionOriginal, setDuracionOriginal] = useState(0)

  useEffect(() => {
    if (open && paquete) {
      const formData = {
        id_paquete: paquete.id_paquete,
        nombrePaquete: paquete.nombrePaquete || "",
        descripcion: paquete.descripcion || "",
        duracionDias: paquete.duracionDias || "",
        descuento: paquete.descuento || 0,
        imagenUrl: paquete.imagenUrl || "",
        estado: paquete.estado || "activo",
        nombre_destino: paquete.nombre_destino || paquete.nombreDestino || "",
        categoria: paquete.categoria || "",
        nombreHotel: paquete.nombreHotel || "",
        numero_habitacion: paquete.numero_habitacion || "",
        precio: paquete.precio || 0,
        precioTotal: paquete.precioTotal || 0,
      }

      setForm(formData)
      setPrecioOriginal(paquete.precio || 0)
      setDuracionOriginal(paquete.duracionDias || 1)
    }
  }, [open, paquete])

  const calcularPrecioAutomatico = (nuevaDuracion) => {
    if (!precioOriginal || !duracionOriginal || nuevaDuracion <= 0) return precioOriginal

    // Calcular precio base por día
    const precioPorDia = precioOriginal / duracionOriginal

    // Calcular nuevo precio base
    const nuevoPrecioBase = precioPorDia * nuevaDuracion

    // Aplicar descuento si existe
    const descuentoDecimal = (form?.descuento || 0) / 100
    const precioConDescuento = nuevoPrecioBase * (1 - descuentoDecimal)

    return Math.round(precioConDescuento)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "duracionDias") {
      const nuevaDuracion = Number.parseInt(value) || 0
      const nuevoPrecio = calcularPrecioAutomatico(nuevaDuracion)

      setForm((prev) => ({
        ...prev,
        [name]: value,
        precio: nuevoPrecio,
        precioTotal: nuevoPrecio,
      }))
    } else if (name === "descuento") {
      const nuevoDescuento = Number.parseFloat(value) || 0
      const precioPorDia = precioOriginal / duracionOriginal
      const precioBase = precioPorDia * (form?.duracionDias || duracionOriginal)
      const descuentoDecimal = nuevoDescuento / 100
      const precioConDescuento = precioBase * (1 - descuentoDecimal)

      setForm((prev) => ({
        ...prev,
        [name]: value,
        precio: Math.round(precioConDescuento),
        precioTotal: Math.round(precioConDescuento),
      }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onSave(form)
    setLoading(false)
  }

  if (!open || !form) return null

  return (
    <div className="fixed inset-0 bg-emerald-100 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Editar Paquete</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Paquete</label>
            <input
              name="nombrePaquete"
              value={form.nombrePaquete}
              onChange={handleChange}
              required
              placeholder="Nombre del paquete"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción del paquete"
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (días)
                <span className="text-xs text-blue-600 ml-1">- El precio se recalcula automáticamente</span>
              </label>
              <input
                name="duracionDias"
                value={form.duracionDias}
                onChange={handleChange}
                required
                placeholder="Duración en días"
                type="number"
                min="1"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descuento (%)
                <span className="text-xs text-blue-600 ml-1">- Afecta el precio final</span>
              </label>
              <input
                name="descuento"
                value={form.descuento}
                onChange={handleChange}
                placeholder="Descuento"
                type="number"
                min="0"
                max="100"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
            <input
              name="imagenUrl"
              value={form.imagenUrl}
              onChange={handleChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              type="url"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
              <input
                name="nombre_destino"
                value={form.nombre_destino}
                onChange={handleChange}
                placeholder="Destino del paquete"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
              >
                <option value="">Seleccionar categoría</option>
                <option value="playa">Playa</option>
                <option value="aventura">Aventura</option>
                <option value="cultural">Cultural</option>
                <option value="naturaleza">Naturaleza</option>
                <option value="ciudad">Ciudad</option>
              </select>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-emerald-600" />
              Información de Precio (Calculado automáticamente)
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded-lg border">
                <span className="text-gray-600 block">Precio original ({duracionOriginal} días):</span>
                <span className="text-lg font-bold text-gray-800">
                  ${precioOriginal ? Number(precioOriginal).toLocaleString("es-CO") : "0"} COP
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <span className="text-gray-600 block">Precio recalculado ({form.duracionDias} días):</span>
                <span className="text-lg font-bold text-emerald-600">
                  ${form.precio ? Number(form.precio).toLocaleString("es-CO") : "0"} COP
                </span>
              </div>
            </div>
            {form.descuento > 0 && (
              <div className="mt-2 text-xs text-blue-600 bg-blue-100 p-2 rounded">
                💡 Descuento del {form.descuento}% aplicado al precio recalculado
              </div>
            )}
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-500 text-white rounded-lg p-3 hover:bg-emerald-600 transition font-medium"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white rounded-lg p-3 hover:bg-gray-600 transition font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const EmployeePanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [infoDashBoard, setInfoDashBoard] = useState(null)
  const [infoUser, setInfoUser] = useState(null)
  const [infoPaquetes, setInfoPaquetes] = useState(null)
  const [loadingPaquetes, setLoadingPaquetes] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editPaquete, setEditPaquete] = useState(null)
  const navigate = useNavigate()

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

  const handleSavePaquete = async (paqueteData) => {
    try {
      const id = paqueteData.id_paquete
      await api.put(`packages/IDPackage/${id}`, paqueteData)
      Swal.fire({
        title: "¡Éxito!",
        text: "Paquete actualizado exitosamente",
        icon: "success",
        confirmButtonColor: "#10b981",
        timer: 2000,
        showConfirmButton: false,
      })
      setEditModalOpen(false)
      setEditPaquete(null)
      handleGetPaquetes()
    } catch (error) {
      console.error("❌ Error al actualizar paquete:", error)
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el paquete",
        icon: "error",
        confirmButtonColor: "#10b981",
      })
    }
  }

  const employeeTabs = [
    { id: "dashboard", label: "Mi Dashboard", icon: <TrendingUp className="w-5 h-5" /> },
    { id: "packages", label: "Paquetes", icon: <Package className="w-5 h-5" /> },
    { id: "customers", label: "Clientes", icon: <Users className="w-5 h-5" /> },
    

  ]

  const myStats = [
    
    
    {
      title: "Ventas del Mes",
      value: infoDashBoard?.ventasDelMes
        ? `$${Number(infoDashBoard.ventasDelMes).toLocaleString("es-CO", { minimumFractionDigits: 2 })}`
        : "$0.00",
      change: "+18%",
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-purple-500",
    }
    
    
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {myStats.map((stat, index) => (
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

            {/* Tareas Pendientes */}
            

            {/* Actividad Reciente */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mi Actividad Reciente</h3>
              <div className="space-y-4">
                {(infoDashBoard?.actividadReciente || []).slice(0, 5).map((activity, index) => {
                  const fecha = activity.created_at
                    ? new Date(activity.created_at).toLocaleString("es-CO", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : ""
                  return (
                    <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Gestioné el paquete: <span className="font-semibold">{activity.nombrePaquete}</span>
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

      case "packages":
        const paquetes = infoPaquetes?.paquetes || []
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Paquetes</h3>
                  <p className="text-gray-600">Administra los paquetes turísticos asignados</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate("/crearPaquete")}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                  >
                    <Package className="w-5 h-5" />
                    <span>Crear Paquete</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stats de paquetes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mis Paquetes</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{paquetes.length}</p>
                    <p className="text-sm text-green-600 mt-1">Total gestionados</p>
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
                    <p className="text-sm text-green-600 mt-1">Disponibles</p>
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
                    <p className="text-sm text-purple-600 mt-1">Destacado</p>
                  </div>
                  <div className="bg-purple-500 p-3 rounded-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de paquetes */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900">Mis Paquetes</h4>
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
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Duración</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Estado</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Precio</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paquetes.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-500">
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
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-900">{paquete.duracionDias} días</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  paquete.estado === "activo"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {paquete.estado || "activo"}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="font-semibold text-emerald-600">
                                ${Number(paquete.precioTotal || 0).toLocaleString()} COP
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => navigate(`/paquetes/${paquete.id_paquete}`)}
                                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200"
                                  title="Ver detalles"
                                >
                                  <Eye className="w-4 h-4" />
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

            {editModalOpen && (
              <EditarPaqueteModal
                open={editModalOpen}
                onClose={() => {
                  setEditModalOpen(false)
                  setEditPaquete(null)
                }}
                paquete={editPaquete}
                onSave={handleSavePaquete}
              />
            )}
          </div>
        )

      case "customers":
        const clientes = infoUser?.user || []
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Mis Clientes</h3>
                <p className="text-gray-600">Lista de clientes que he atendido</p>
              </div>
              <div className="bg-emerald-100 px-4 py-2 rounded-lg">
                <span className="text-emerald-800 font-semibold">{clientes.length} clientes</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Teléfono</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Última Actividad</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">
                        No hay clientes registrados
                      </td>
                    </tr>
                  ) : (
                    clientes.slice(0, 20).map((cliente, index) => (
                      <tr key={cliente.id_usuario || index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 font-semibold text-sm">
                                {cliente.nombre?.charAt(0)?.toUpperCase() || "?"}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{cliente.nombre}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{cliente.email}</td>
                        <td className="py-3 px-4 text-gray-600">{cliente.telefono || "No disponible"}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Activo
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-sm">
                          {cliente.created_at
                            ? new Date(cliente.created_at).toLocaleDateString("es-CO")
                            : "No disponible"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )

      case "reservations":
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Reservas</h3>
                <p className="text-gray-600">Administra las reservas de tus clientes</p>
              </div>
            </div>

            {/* Stats de reservas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Pendientes</p>
                    <p className="text-2xl font-bold text-blue-900">12</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Confirmadas</p>
                    <p className="text-2xl font-bold text-green-900">28</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">En Proceso</p>
                    <p className="text-2xl font-bold text-yellow-900">8</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Completadas</p>
                    <p className="text-2xl font-bold text-purple-900">156</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Lista de reservas simulada */}
            <div className="space-y-4">
              {[
                {
                  id: "R001",
                  cliente: "Juan Pérez",
                  paquete: "Cartagena Mágica",
                  fecha: "2024-02-15",
                  estado: "Pendiente",
                  valor: "$1,200,000",
                },
                {
                  id: "R002",
                  cliente: "María González",
                  paquete: "Santa Marta Aventura",
                  fecha: "2024-02-20",
                  estado: "Confirmada",
                  valor: "$980,000",
                },
                {
                  id: "R003",
                  cliente: "Carlos Rodríguez",
                  paquete: "Medellín Cultural",
                  fecha: "2024-02-25",
                  estado: "En Proceso",
                  valor: "$750,000",
                },
              ].map((reserva, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-gray-900">#{reserva.id}</p>
                          <p className="text-sm text-gray-500">{reserva.cliente}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{reserva.paquete}</p>
                          <p className="text-sm text-gray-500">Fecha: {reserva.fecha}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-emerald-600">{reserva.valor}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          reserva.estado === "Confirmada"
                            ? "bg-green-100 text-green-800"
                            : reserva.estado === "Pendiente"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {reserva.estado}
                      </span>
                      <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                        Gestionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "support":
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Centro de Soporte</h3>
                <p className="text-gray-600">Gestiona tickets y consultas de clientes</p>
              </div>
            </div>

            {/* Stats de soporte */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Tickets Abiertos</p>
                    <p className="text-2xl font-bold text-red-900">5</p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Resueltos Hoy</p>
                    <p className="text-2xl font-bold text-green-900">12</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Tiempo Promedio</p>
                    <p className="text-2xl font-bold text-blue-900">2.5h</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Lista de tickets simulada */}
            <div className="space-y-4">
              {[
                {
                  id: "T001",
                  cliente: "Ana Martínez",
                  asunto: "Problema con reserva",
                  prioridad: "Alta",
                  estado: "Abierto",
                  tiempo: "Hace 2 horas",
                },
                {
                  id: "T002",
                  cliente: "Pedro López",
                  asunto: "Consulta sobre paquete",
                  prioridad: "Media",
                  estado: "En Proceso",
                  tiempo: "Hace 4 horas",
                },
                {
                  id: "T003",
                  cliente: "Laura Sánchez",
                  asunto: "Cambio de fecha",
                  prioridad: "Baja",
                  estado: "Resuelto",
                  tiempo: "Hace 1 día",
                },
              ].map((ticket, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-gray-900">#{ticket.id}</p>
                          <p className="text-sm text-gray-500">{ticket.cliente}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{ticket.asunto}</p>
                          <p className="text-sm text-gray-500">{ticket.tiempo}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.prioridad === "Alta"
                            ? "bg-red-100 text-red-800"
                            : ticket.prioridad === "Media"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {ticket.prioridad}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ticket.estado === "Resuelto"
                            ? "bg-green-100 text-green-800"
                            : ticket.estado === "En Proceso"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {ticket.estado}
                      </span>
                      <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                        Atender
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {employeeTabs.find((tab) => tab.id === activeTab)?.label}
            </h3>
            <p className="text-gray-600">Contenido de {activeTab} en desarrollo...</p>
          </div>
        )
    }
  }

  useEffect(() => {
    handleGetInfo()
    handleGetInfoUser()
  }, [])

  useEffect(() => {
    if (activeTab === "packages") {
      handleGetPaquetes()
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Empleado</h1>
              <p className="text-gray-600">Gestiona tus tareas y clientes de ZenTravel</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {employeeTabs.map((tab) => (
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
