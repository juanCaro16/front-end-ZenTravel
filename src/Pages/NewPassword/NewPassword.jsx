import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight, Shield } from "lucide-react"
import api from "../../Services/AxiosInstance/AxiosInstance"

export const NewPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [tokenValid, setTokenValid] = useState(true)

  // Verificar token al cargar el componente
  useEffect(() => {
    if (!token) {
      setError("Token de recuperación no válido")
      setTokenValid(false)
    }
  }, [token])

  // Calcular fortaleza de la contraseña
  useEffect(() => {
    const password = formData.newPassword
    let strength = 0

    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    setPasswordStrength(strength)
  }, [formData.newPassword])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { text: "Muy débil", color: "text-red-500", bg: "bg-red-500" }
      case 2:
        return { text: "Débil", color: "text-orange-500", bg: "bg-orange-500" }
      case 3:
        return { text: "Regular", color: "text-yellow-500", bg: "bg-yellow-500" }
      case 4:
        return { text: "Fuerte", color: "text-blue-500", bg: "bg-blue-500" }
      case 5:
        return { text: "Muy fuerte", color: "text-green-500", bg: "bg-green-500" }
      default:
        return { text: "", color: "", bg: "" }
    }
  }

  const validateForm = () => {
    if (!formData.newPassword) {
      setError("La contraseña es requerida")
      return false
    }

    if (formData.newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return false
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return false
    }

    if (passwordStrength < 3) {
      setError("La contraseña debe ser más segura. Incluye mayúsculas, minúsculas, números y símbolos")
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
      const response = await api.post(`/Password/reset-password?token=${token}`, {
        newPassword: formData.newPassword,
      })

      setMessage("Contraseña actualizada correctamente")
      setIsSuccess(true)

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err) {
      console.error("❌ Error:", err)

      if (err.response?.status === 400) {
        setError("Token expirado o inválido. Solicita un nuevo enlace de recuperación")
        setTokenValid(false)
      } else if (err.response?.status === 404) {
        setError("Token no encontrado. Verifica el enlace de recuperación")
        setTokenValid(false)
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError("Error al actualizar la contraseña. Intenta nuevamente")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate("/login")
  }

  const handleRequestNewToken = () => {
    navigate("/reset-password")
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Enlace no válido</h2>
            <p className="text-gray-600 mb-6">
              El enlace de recuperación ha expirado o no es válido. Solicita un nuevo enlace para restablecer tu
              contraseña.
            </p>
            <button
              onClick={handleRequestNewToken}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Solicitar nuevo enlace
            </button>
            <button
              onClick={handleBackToLogin}
              className="w-full mt-3 py-3 px-4 text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen  flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Contraseña actualizada!</h2>
            <p className="text-gray-600 mb-6">
              Tu contraseña ha sido restablecida exitosamente. Serás redirigido al inicio de sesión en unos segundos.
            </p>
            <button
              onClick={handleBackToLogin}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <span>Ir al inicio de sesión</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen b flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-6 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Nueva Contraseña</h2>
          <p className="text-gray-600 leading-relaxed">Crea una contraseña segura para proteger tu cuenta</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nueva Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nueva contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  required
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Ingresa tu nueva contraseña"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Indicador de fortaleza */}
              {formData.newPassword && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Fortaleza de la contraseña:</span>
                    <span className={`text-sm font-medium ${getPasswordStrengthText().color}`}>
                      {getPasswordStrengthText().text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthText().bg}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <p className={formData.newPassword.length >= 8 ? "text-green-600" : ""}>• Al menos 8 caracteres</p>
                    <p className={/[A-Z]/.test(formData.newPassword) ? "text-green-600" : ""}>• Una letra mayúscula</p>
                    <p className={/[a-z]/.test(formData.newPassword) ? "text-green-600" : ""}>• Una letra minúscula</p>
                    <p className={/[0-9]/.test(formData.newPassword) ? "text-green-600" : ""}>• Un número</p>
                    <p className={/[^A-Za-z0-9]/.test(formData.newPassword) ? "text-green-600" : ""}>
                      • Un símbolo especial
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Confirma tu nueva contraseña"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Indicador de coincidencia */}
              {formData.confirmPassword && (
                <div className="mt-2">
                  {formData.newPassword === formData.confirmPassword ? (
                    <p className="text-sm text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Las contraseñas coinciden
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Las contraseñas no coinciden
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || passwordStrength < 3 || formData.newPassword !== formData.confirmPassword}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Actualizando contraseña...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Actualizar Contraseña
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleBackToLogin}
              className="w-full flex items-center justify-center py-3 px-4 text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Consejos de seguridad:</h3>
          <ul  className="list-disc text-blue-800 text-sm space-y-1">
            <li>Usa una combinación de letras, números y símbolos</li>
            <li>No uses información personal como fechas o nombres</li>
            <li>Evita contraseñas que hayas usado antes</li>
            <li>Considera usar un gestor de contraseñas</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
