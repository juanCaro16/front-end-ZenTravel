"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Shield, User, Package, AlertTriangle, Eye } from "lucide-react"

export const TestPermissions = () => {
  const navigate = useNavigate()
  const [currentRole, setCurrentRole] = useState(localStorage.getItem("Rol") || "Cliente")

  // Simular cambio de rol para testing
  const changeRole = (newRole) => {
    localStorage.setItem("Rol", newRole)
    setCurrentRole(newRole)
    window.location.reload() // Recargar para aplicar cambios
  }

  const testRoutes = [
    {
      path: "/admin",
      name: "Panel de Administración",
      requiredRoles: ["Admin"],
      icon: <Shield className="w-5 h-5" />,
      color: "bg-red-500",
    },
    {
      path: "/employee",
      name: "Panel de Empleado",
      requiredRoles: ["Empleado"],
      icon: <User className="w-5 h-5" />,
      color: "bg-blue-500",
    },
    {
      path: "/crearPaquete",
      name: "Crear Paquetes",
      requiredRoles: ["Admin", "Empleado"],
      icon: <Package className="w-5 h-5" />,
      color: "bg-green-500",
    },
    {
      path: "/paquetes",
      name: "Ver Paquetes",
      requiredRoles: [], // Cualquier usuario autenticado
      icon: <Eye className="w-5 h-5" />,
      color: "bg-purple-500",
    },
  ]

  const hasAccess = (requiredRoles) => {
    if (requiredRoles.length === 0) return true // Ruta pública para autenticados
    return requiredRoles.includes(currentRole)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Probador de Permisos</h1>
          <p className="text-gray-600">Prueba el sistema de roles y permisos de la aplicación</p>
        </div>

        {/* Current Role Display */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Rol Actual</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  currentRole === "Admin"
                    ? "bg-red-100 text-red-600"
                    : currentRole === "Empleado"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {currentRole === "Admin" ? (
                  <Shield className="w-6 h-6" />
                ) : currentRole === "Empleado" ? (
                  <User className="w-6 h-6" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{currentRole}</p>
                <p className="text-sm text-gray-500">
                  {currentRole === "Admin"
                    ? "Acceso completo al sistema"
                    : currentRole === "Empleado"
                      ? "Acceso a funciones de empleado"
                      : "Acceso básico de cliente"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cambiar Rol (Solo para Testing)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["Cliente", "Empleado", "Admin"].map((role) => (
              <button
                key={role}
                onClick={() => changeRole(role)}
                className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                  currentRole === role
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-300 hover:border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{role === "Admin" ? "👑" : role === "Empleado" ? "👨‍💼" : "👤"}</div>
                  <div className="font-medium">{role}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>Nota:</strong> Este cambio de rol es solo para testing. En producción, los roles se asignan
              desde el backend.
            </p>
          </div>
        </div>

        {/* Test Routes */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Probar Acceso a Rutas</h2>
          <div className="space-y-4">
            {testRoutes.map((route, index) => {
              const access = hasAccess(route.requiredRoles)
              return (
                <div
                  key={index}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                    access ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`${route.color} p-2 rounded-lg text-white`}>{route.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{route.name}</h3>
                        <p className="text-sm text-gray-600">
                          Ruta: <code className="bg-gray-100 px-2 py-1 rounded">{route.path}</code>
                        </p>
                        <p className="text-sm text-gray-600">
                          Roles requeridos:{" "}
                          {route.requiredRoles.length > 0 ? route.requiredRoles.join(", ") : "Cualquier usuario"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          access ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {access ? "✅ Permitido" : "❌ Denegado"}
                      </div>
                      <button
                        onClick={() => navigate(route.path)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          access
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                            : "bg-gray-300 hover:bg-gray-400 text-gray-700"
                        }`}
                      >
                        {access ? "Ir a la ruta" : "Intentar acceso"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">📋 Instrucciones para Testing:</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-2">
            <li>
              <strong>Cambiar rol:</strong> Usa los botones arriba para cambiar tu rol actual
            </li>
            <li>
              <strong>Probar acceso:</strong> Haz clic en "Intentar acceso" para rutas denegadas
            </li>
            <li>
              <strong>Verificar redirección:</strong> Las rutas denegadas te mostrarán una página de error
            </li>
            <li>
              <strong>Comprobar navegación:</strong> Verifica que los enlaces del header cambien según el rol
            </li>
            <li>
              <strong>Probar componentes:</strong> Algunos botones/secciones solo aparecen para ciertos roles
            </li>
          </ol>
        </div>

        {/* Reset Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              localStorage.setItem("Rol", "Cliente")
              window.location.reload()
            }}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Resetear a Cliente
          </button>
        </div>
      </div>
    </div>
  )
}
