import { Route, Routes } from "react-router-dom"
import { AppHeader } from "./Layouts/AppHeader/AppHeader"
import { Main } from "./Layouts/Main/Main"
import { Login } from "./Pages/Login/Login"
import { SophIA } from "./Pages/SophIA/SophIA"
import { Nosotros } from "./Pages/Nosotros/Nosotros"
import { Servicios } from "./Pages/Servicios/Servicios"
import { Contacto } from "./Pages/Contacto/Contacto"
import { ButtonHelp } from "./Components/ButtonHelp/ButtonHelp"
import { Soporte } from "./Pages/Soporte/Soporte"
import { Register } from "./Pages/Register/Register"
import { ResetPassword } from "./Pages/ResetPassword/ResetPassword"
import { NewPassword } from "./Pages/NewPassword/NewPassword"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Paquetes } from "./Pages/Paquetes/Paquetes"
import { CrearPaquetes } from "./Pages/CrearPaquetes/CrearPaquetes"
import { Hoteles } from "./Pages/Hoteles/Hoteles"
import { CrearHoteles } from "./Pages/CrearHoteles/CrearHoteles"
import TokenRefresher from "./Services/TokenRefresher/TokenRefresher"
import { ProtectedRoute } from "./Components/ProtectedRoute/ProtectedRoute"
import { AdminPanel } from "./Components/AdminPanel/AdminPanel"
import { EmployeePanel } from "./Components/EmployeePanel/EmployeePanel"
import { TestPermissions } from "./Components/TestPermissions/TestPermissions"
import { useAuth } from "./Hooks/useAuth"

export const App = () => {
  const { isAuthenticated, userRole, login, logout } = useAuth()
  const location = useLocation() // Obtén la ubicación actual

  const hideHeaderPaths = ["/", "/register"]
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname)

  useEffect(() => {
    // Verifica el token cada vez que cambie la ruta
    if (!localStorage.getItem("accessToken")) {
      //setIsAuthenticated(false);
    }
  }, [location]) // Ejecuta el efecto al cambiar la ruta

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      {!shouldHideHeader && <AppHeader isAuthenticated={isAuthenticated} onLogout={handleLogout} />}

      <ButtonHelp />
      <TokenRefresher />
      <Routes>
        <Route path="/index" element={<Main />} />

        {/* Ruta para probar permisos */}
        <Route
          path="/test-permissions"
          element={
            <ProtectedRoute>
              <TestPermissions />
            </ProtectedRoute>
          }
        />

        {/* Rutas de Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Rutas de Empleado */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute requiredRoles={["Empleado"]}>
              <EmployeePanel />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas para usuarios autenticados */}
        <Route
          path="/paquetes"
          element={
            <ProtectedRoute>
              <Paquetes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crearPaquete"
          element={
            <ProtectedRoute requiredRoles={["Admin", "Empleado"]}>
              <CrearPaquetes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Hoteles"
          element={
            <ProtectedRoute>
              <Hoteles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crearHotel"
          element={
            <ProtectedRoute requiredRoles={["Admin", "Empleado"]}>
              <CrearHoteles />
            </ProtectedRoute>
          }
        />

        {/* Rutas públicas y de autenticación */}
        <Route path="/" element={<Login onLoginSuccess={login} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<NewPassword />} />

        {/* Rutas públicas */}
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/soporte" element={<Soporte />} />

        {/* Rutas protegidas */}
        <Route
          path="/sophIA"
          element={
            <ProtectedRoute>
              <SophIA />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  )
}
