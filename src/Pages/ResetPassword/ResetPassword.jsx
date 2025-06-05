import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle, Clock } from "lucide-react"
import api from "../../Services/AxiosInstance/AxiosInstance"


export const ResetPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsLoading(true)

    // Validación básica del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un correo electrónico válido")
      setIsLoading(false)
      return
    }

    try {
      const response = await api.post("/Password/validar-password", { email })

      setMessage(response.data.message || "Enlace de recuperación enviado exitosamente")
      setEmailSent(true)

      // Limpiar el formulario
      setEmail("")
    } catch (err) { 
      console.error("❌ Error:", err)

      if (err.response?.status === 404) {
        setError("No se encontró una cuenta asociada a este correo electrónico")
      } else if (err.response?.status === 429) {
        setError("Demasiados intentos. Por favor espera unos minutos antes de intentar nuevamente")
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError("No se pudo enviar el enlace. Verifica el correo e intenta nuevamente")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate("/login")
  }

  const handleResendEmail = () => {
    setEmailSent(false)
    setMessage("")
    setError("")
  }

  return (
    <div className="min-h-screen  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-6 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {emailSent ? "Revisa tu correo" : "Recuperar Contraseña"}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {emailSent
              ? "Te hemos enviado un enlace para restablecer tu contraseña"
              : "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña"}
          </p>
        </div>

        {/* Formulario o mensaje de éxito */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    placeholder="tu@email.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Enviando enlace...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Enlace de Recuperación
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              {/* Success Message */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900">¡Enlace enviado!</h3>
                <p className="text-gray-600 leading-relaxed">
                  Hemos enviado un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada y sigue
                  las instrucciones.
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="font-semibold text-blue-900 mb-1">Instrucciones:</h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      <li>• Revisa tu bandeja de entrada</li>
                      <li>• Si no lo encuentras, revisa la carpeta de spam</li>
                      <li>• El enlace expira en 1 hora</li>
                      <li>• Haz clic en el enlace para restablecer tu contraseña</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Resend Button */}
              <button
                onClick={handleResendEmail}
                className="w-full py-3 px-4 border-2 border-emerald-500 text-emerald-600 rounded-xl hover:bg-emerald-50 font-semibold transition-all duration-200"
              >
                Enviar otro enlace
              </button>
            </div>
          )}

          {/* Success Message */}
          {message && !emailSent && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-green-700 text-sm">{message}</p>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleBackToLogin}
              className="w-full flex items-center justify-center py-3 px-4 text-gray-600 hover:text-emerald-600 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio de sesión
            </button>
          </div>
        </div>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda?{" "}
            <button
              onClick={() => navigate("/soporte")}
              className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
            >
              Contacta soporte
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
