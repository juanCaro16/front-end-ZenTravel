"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import api from "../../Services/AxiosInstance/AxiosInstance"
import { User, Phone, LogOut, Edit2, Save, X, DollarSign, Briefcase, ExternalLink, Settings } from "lucide-react"

export const Profile = ({ onLogout }) => {
  const [userInfo, setUserInfo] = useState(null)
  const [editable, setEditable] = useState(false)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      onLogout?.()

      await Swal.fire({
        title: "¡Cerraste sesión!",
        text: "Esperamos verte pronto.",
        icon: "success",
        confirmButtonColor: "#10b981",
        showConfirmButton: false,
        timer: 1500,
      })

      navigate("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true)
        const response = await api.get("https://proyecto-zentravel.onrender.com/Auth/infoUserDTO")
        setUserInfo(response.data)
        setFormData(response.data)
      } catch (error) {
        console.error("❌ Error al cargar perfil:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await api.patch("/Auth/profile", formData)
      setUserInfo(formData)
      setEditable(false)

      Swal.fire({
        title: "¡Perfil actualizado!",
        icon: "success",
        confirmButtonColor: "#10b981",
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (error) {
      console.error("❌ Error al guardar perfil:", error)
      Swal.fire({
        title: "Error",
        text: "No se pudieron guardar los cambios",
        icon: "error",
        confirmButtonColor: "#10b981",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(userInfo)
    setEditable(false)
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-emerald-700 text-sm">Cargando perfil...</p>
      </div>
    )
  }

  if (!userInfo) {
    return (
      <div className="p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <X className="w-6 h-6 text-red-500" />
        </div>
        <p className="text-red-600 text-sm mb-3">Error al cargar datos</p>
        <button
          onClick={() => navigate("/login")}
          className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
        >
          Iniciar sesión
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      {/* Cabecera compacta */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-xl p-4">
        <div className="flex items-center gap-3">
          {/* Avatar pequeño */}
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-sm font-bold">
            {getInitials(userInfo.nombre)}
          </div>

          {/* Info básica */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">{userInfo.nombre || "Usuario"}</h3>
            <p className="text-emerald-100 text-xs truncate">{userInfo.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <User className="w-3 h-3 text-emerald-200" />
              <span className="text-emerald-200 text-xs">ID: {userInfo.id_usuario}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="bg-white border-x border-gray-200 max-h-80 overflow-y-auto">
        {/* Información personal */}
        <div className="p-4 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <User className="w-4 h-4 text-emerald-600 mr-2" />
            Información personal
          </h4>

          <div className="space-y-3">
            {/* Nombre */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nombre</label>
              {editable ? (
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={handleChange}
                  className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Tu nombre"
                />
              ) : (
                <p className="text-sm text-gray-800">{userInfo.nombre || "No especificado"}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Teléfono</label>
              {editable ? (
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono || ""}
                  onChange={handleChange}
                  className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="300 123 4567"
                />
              ) : (
                <div className="flex items-center">
                  <Phone className="w-3 h-3 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-800">{userInfo.telefono || "No especificado"}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preferencias */}
        <div className="p-4 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Briefcase className="w-4 h-4 text-emerald-600 mr-2" />
            Preferencias
          </h4>

          <div className="space-y-3">
            {/* Estilo de vida */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Estilo de vida</label>
              {editable ? (
                <select
                  name="estiloVida"
                  value={formData.estiloVida || ""}
                  onChange={handleChange}
                  className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Seleccionar</option>
                  <option value="aventurero">Aventurero</option>
                  <option value="relajado">Relajado</option>
                  <option value="cultural">Cultural</option>
                  <option value="lujo">Lujo</option>
                  <option value="familiar">Familiar</option>
                  <option value="ecologico">Ecológico</option>
                </select>
              ) : (
                <div>
                  {userInfo.estiloVida ? (
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                      {userInfo.estiloVida}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500 italic">No especificado</span>
                  )}
                </div>
              )}
            </div>

            {/* Presupuesto */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Presupuesto</label>
              {editable ? (
                <input
                  type="number"
                  name="presupuesto"
                  value={formData.presupuesto || ""}
                  onChange={handleChange}
                  className="w-full text-sm px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="1000000"
                />
              ) : (
                <div className="flex items-center">
                  <DollarSign className="w-3 h-3 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-800">
                    {userInfo.presupuesto ? `$${Number(userInfo.presupuesto).toLocaleString()} COP` : "No especificado"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enlaces rápidos */}
        <div className="p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Settings className="w-4 h-4 text-emerald-600 mr-2" />
            Acciones rápidas
          </h4>

          <div className="space-y-2">
            <button
              onClick={() => navigate("/paquetes")}
              className="w-full flex items-center justify-between text-sm text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-2 py-2 rounded transition-colors"
            >
              <span>Mis paquetes</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={() => navigate("/soporte")}
              className="w-full flex items-center justify-between text-sm text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-2 py-2 rounded transition-colors"
            >
              <span>Soporte</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="bg-gray-50 rounded-b-xl p-4 border-x border-b border-gray-200">
        {editable ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-3 h-3" />
              )}
              <span>Guardar</span>
            </button>

            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Cancelar</span>
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditable(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              <span>Editar</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Salir</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
