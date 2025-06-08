import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Shield,
} from "lucide-react"
import api from "../../Services/AxiosInstance/AxiosInstance"

export const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validación nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres"
    }

    // Validación email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Ingresa un email válido"
    }

    // Validación teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido"
    } else if (!/^\d{10}$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener exactamente 10 dígitos"
    }

    // Validación contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 8 || formData.password.length > 15) {
      newErrors.password = "La contraseña debe tener entre 8 y 15 caracteres"
    }

    // Validación confirmar contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    return newErrors
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await api.post("Auth/Register", {
        nombre: formData.nombre.trim(),
        email: formData.email.trim().toLowerCase(),
        telefono: formData.telefono.trim(),
        password: formData.password,
      })

      console.log("✅ Registro exitoso:", response.data)

      await Swal.fire({
        title: "¡Registro exitoso!",
        text: "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
        icon: "success",
        confirmButtonColor: "#10b981",
        confirmButtonText: "Continuar",
      })

      navigate("/")
    } catch (err) {
      console.error("❌ Error en registro:", err)

      if (err.response?.status === 422) {
        // Errores de validación del backend
        const backendErrors = err.response.data.errors || []
        const formattedErrors = {}

        backendErrors.forEach((error) => {
          formattedErrors[error.path] = error.msg
        })

        setErrors(formattedErrors)
      } else if (err.response?.status === 409) {
        // Usuario ya existe
        setErrors({ email: "Este email ya está registrado" })
      } else {
        // Error general
        setErrors({ general: "Ocurrió un error inesperado. Intenta nuevamente." })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = () => {
    const password = formData.password
    if (!password) return { strength: 0, text: "", color: "" }

    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    const levels = [
      { text: "Muy débil", color: "bg-red-500" },
      { text: "Débil", color: "bg-orange-500" },
      { text: "Regular", color: "bg-yellow-500" },
      { text: "Buena", color: "bg-blue-500" },
      { text: "Excelente", color: "bg-green-500" },
    ]

    return { strength, ...levels[Math.min(strength, 4)] }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-6 shadow-lg">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Únete a
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {" "}
              ZenTravel
            </span>
          </h1>
          <p className="text-gray-600">Crea tu cuenta y comienza a explorar el mundo</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Error general */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Nombre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white ${
                    errors.nombre ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-emerald-500"
                  }`}
                  placeholder="Tu nombre completo"
                />
              </div>
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.nombre}</span>
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white ${
                    errors.email ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-emerald-500"
                  }`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white ${
                    errors.telefono ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-emerald-500"
                  }`}
                  placeholder="3001234567"
                  maxLength="10"
                />
              </div>
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.telefono}</span>
                </p>
              )}
              {!errors.telefono && formData.telefono && (
                <p className="mt-1 text-sm text-gray-500">Formato: 10 dígitos sin espacios</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white ${
                    errors.password ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-emerald-500"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Indicador de fortaleza de contraseña */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{passwordStrength.text}</span>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </p>
              )}
              {!errors.password && <p className="mt-1 text-sm text-gray-500">Entre 8 y 15 caracteres</p>}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar contraseña *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-300 focus:border-emerald-500"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
              {!errors.confirmPassword &&
                formData.confirmPassword &&
                formData.password === formData.confirmPassword && (
                  <p className="mt-1 text-sm text-green-600 flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Las contraseñas coinciden</span>
                  </p>
                )}
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Crear Cuenta</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 px-4 border-2 border-emerald-500 text-emerald-600 rounded-xl hover:bg-emerald-50 font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Al registrarte, aceptas nuestros{" "}
            <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Términos de Servicio
            </a>{" "}
            y{" "}
            <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
