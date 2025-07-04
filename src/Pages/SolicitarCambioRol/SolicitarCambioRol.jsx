import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  User,
  Mail,
  Phone,
  FileText,
  Shield,
  Send,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  UserCheck,
  Briefcase,
} from "lucide-react"
import api from "../../Services/AxiosInstance/AxiosInstance"

export const SolicitarCambioRol = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    rol: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const rolesDisponibles = [
    {
      value: "Empleado",
      label: "Empleado",
      description: "Acceso a gestión de paquetes y clientes",
      icon: <Briefcase className="w-5 h-5" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      value: "Admin",
      label: "Administrador",
      description: "Acceso completo al sistema",
      icon: <Shield className="w-5 h-5" />,
      color: "from-red-500 to-red-600",
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleRoleSelect = (rol) => {
    setFormData((prev) => ({
      ...prev,
      rol,
      asunto: `Solicitud de cambio de rol a ${rol}`,
    }))
  }

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre es requerido")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Por favor ingresa un correo electrónico válido")
      return false
    }

    if (!formData.telefono.trim()) {
      setError("El teléfono es requerido")
      return false
    }

    if (!/^\d{10}$/.test(formData.telefono)) {
      setError("El teléfono debe tener exactamente 10 dígitos")
      return false
    }

    if (!formData.rol) {
      setError("Debes seleccionar un rol")
      return false
    }

    if (!formData.asunto.trim()) {
      setError("El asunto es requerido")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await api.post("Auth/cambio_rol", {
        nombre: formData.nombre.trim(),
        email: formData.email.trim().toLowerCase(),
        telefono: formData.telefono.trim(),
        asunto: formData.asunto.trim(),
        rol: formData.rol,
      })

      setMessage(response.data.message || "Solicitud enviada exitosamente")
      setIsSubmitted(true)

      // Limpiar formulario
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        rol: "",
      })
    } catch (err) {
      console.error("❌ Error:", err)

      if (err.response?.status === 400) {
        setError("Datos inválidos. Verifica que todos los campos estén correctos.")
      } else if (err.response?.status === 500) {
        setError("Error interno del servidor. Intenta nuevamente.")
      } else if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError("No se pudo enviar la solicitud. Intenta nuevamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToProfile = () => {
    navigate(-1) // Volver a la página anterior
  }

  const handleNewRequest = () => {
    setIsSubmitted(false)
    setMessage("")
    setError("")
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Solicitud Enviada!</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Tu solicitud de cambio de rol ha sido enviada exitosamente. Nuestro equipo la revisará y te contactará
              pronto.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">¿Qué sigue?</h3>
              <ul className="text-blue-800 text-sm space-y-1 text-left">
                <li>• Revisaremos tu solicitud en 24-48 horas</li>
                <li>• Te contactaremos por email o teléfono</li>
                <li>• Podrías necesitar una entrevista breve</li>
                <li>• Te notificaremos la decisión final</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleNewRequest}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Hacer otra solicitud
              </button>
              <button
                onClick={handleBackToProfile}
                className="w-full py-3 px-4 text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200"
              >
                Volver al perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header mejorado */}
        <div className="mb-8">
          {/* Botón de volver mejorado */}
          <div className="mb-6">
            <button
              onClick={handleBackToProfile}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-emerald-600 hover:border-emerald-300 transition-all duration-200 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="font-medium">Volver</span>
            </button>
          </div>

          {/* Título centrado */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-6 shadow-lg">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Solicitar Cambio de
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Rol</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              ¿Quieres acceder a más funcionalidades? Solicita un cambio de rol y nuestro equipo evaluará tu petición.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Tu nombre completo"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="tu@email.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                placeholder="3001234567"
                maxLength="10"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">Formato: 10 dígitos sin espacios</p>
            </div>

            {/* Selección de rol */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                <Shield className="w-4 h-4 inline mr-2" />
                Rol solicitado *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rolesDisponibles.map((rol) => (
                  <button
                    key={rol.value}
                    type="button"
                    onClick={() => handleRoleSelect(rol.value)}
                    className={`p-6 border-2 rounded-xl transition-all duration-200 text-left ${
                      formData.rol === rol.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-300 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                    disabled={isLoading}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${rol.color} text-white`}>{rol.icon}</div>
                      <h3 className="font-semibold text-gray-900">{rol.label}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{rol.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Asunto */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Asunto de la solicitud *
              </label>
              <input
                type="text"
                name="asunto"
                value={formData.asunto}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                placeholder="Describe brevemente tu solicitud"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {message && !isSubmitted && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Enviando solicitud...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Solicitud
                </>
              )}
            </button>
          </form>

          {/* Información adicional */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-3">📋 Requisitos para el cambio de rol:</h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>
                <strong>Empleado:</strong> Experiencia en turismo, conocimiento de destinos colombianos, habilidades de
                atención al cliente
              </li>
              <li>
                <strong>Administrador:</strong> Experiencia previa como empleado, conocimientos técnicos, liderazgo
              </li>
              <li>• Todos los cambios están sujetos a aprobación del equipo administrativo</li>
              <li>• El proceso de evaluación puede tomar entre 3-5 días hábiles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
