import { Navigate, useLocation } from "react-router-dom"
import { AlertTriangle, Lock } from "lucide-react"

export const ProtectedRoute = ({ children, requiredRoles = [], requireAuth = true }) => {
  const location = useLocation()
  const token = localStorage.getItem("accessToken")
  const userRole = localStorage.getItem("Rol")

  // Si requiere autenticación y no hay token
  if (requireAuth && !token) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // Si se requieren roles específicos
  if (requiredRoles.length > 0) {
    if (!userRole) {
      return <UnauthorizedAccess message="No se pudo verificar tu rol de usuario" />
    }

    if (!requiredRoles.includes(userRole)) {
      return <UnauthorizedAccess message="No tienes permisos para acceder a esta sección" />
    }
  }

  return children
}

const UnauthorizedAccess = ({ message }) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <Lock className="w-10 h-10 text-red-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Restringido</h2>

          <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <p className="text-amber-800 text-sm font-medium">
                Si crees que esto es un error, contacta al administrador
              </p>
            </div>
          </div>

          <button
            onClick={() => window.history.back()}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Volver Atrás
          </button>
        </div>
      </div>
    </div>
  )
}
