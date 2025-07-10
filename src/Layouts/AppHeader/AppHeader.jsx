import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, X, Phone, Globe, Luggage, HelpCircle, TestTube } from "lucide-react"
import { IoHome } from "react-icons/io5";
import { FaSuitcaseRolling,FaHeadSideVirus } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa";
import img from "../../Images/logofull_sin_fondo-Photoroom.png"
import { ItemNavLink } from "../../Components/ItemNavLink/ItemNavLink"
import { ProfileButton } from "../../Components/ProfileButton/ProfileButton"
import { RoleBasedComponent } from "../../Components/RoleBasedComponent/RoleBasedComponent"

export const AppHeader = ({ isAuthenticated, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("Rol")
    onLogout()
    navigate("/")
  }

  

  return (
    <header className="w-[100%] bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50  ">
      <div className=" mx-auto sm:px-6 lg:px-8">
        <div className="w-full flex items-center h-16 ">
          {/* Logo y navegación principal */}
          <div className="flex items-center w-[60%] gap-5">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/index")}>
              <img className="w-12 h-12 object-contain" src={img || "/placeholder.svg"} alt="ZenTravel Logo" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ZenTravel
              </span>
            </div>

            <nav className="hidden lg:flex items-center space-x-1">
              <ItemNavLink
                route="/index"
                myStyles="px-2 py-2 rounded-lg text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 font-medium"
                content={({ isActive }) =>
                  isActive ? (
                    <span className="flex items-center gap-1">
                      <IoHome size={15} />
                      inicio
                    </span>
                  ) : "inicio"
                }
          
              />
              <ItemNavLink
                route="/paquetes"
                myStyles="px-2 py-2 rounded-lg text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 font-medium"
                content = {({ isActive }) =>
                  isActive ? (
                    <span className="flex items-center gap-1 ">
                      <FaSuitcaseRolling size={15} />
                      Paquetes
                    </span>
                  ) : "Paquetes"
                }
               
              />
              <ItemNavLink
                route="/Hoteles"
                myStyles="px-4 py-2 rounded-lg text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 font-medium"
                content={({ isActive }) =>
                  isActive ? (
                    <span className="flex items-center gap-1 ">
                      <FaBuilding size={15} />
                      Hoteles
                    </span>
                  ) : "Hoteles"
                }
              />
              <ItemNavLink
                
                route="/ZenIA"
                myStyles="px-4 py-2 rounded-lg text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 font-medium"
                content={({ isActive }) =>
                  isActive ? (
                    <span className="flex items-center gap-1 ">
                      <FaHeadSideVirus size={15} />
                      Asistente IA
                    </span>
                  ) : "Asistente IA"
                }
              />

              {/* Enlace para probar permisos - solo visible cuando está autenticado */}
              

              <RoleBasedComponent allowedRoles={["admin"]}>
                <ItemNavLink
                  content="Admin Panel"
                  route="/admin"
                  myStyles="px-4 py-2 rounded-lg text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 font-medium"
                />
              </RoleBasedComponent>

              <RoleBasedComponent allowedRoles={["empleado"]}>
                <ItemNavLink
                  content="Panel Empleado"
                  route="/employee"
                  myStyles="px-4 py-2 rounded-lg text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200 font-medium"
                />
              </RoleBasedComponent>

            </nav>
          </div>

          {/* Controles adicionales */}
          <div className="flex items-center ml-auto">
            {/* Info adicional - Desktop */}
            <div className="hidden xl:flex items-center w-full  space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <img src="https://flagcdn.com/w20/co.png" alt="Colombia" className="w-5 h-3 rounded-sm" />
                <span className="font-medium">ES - COP</span>
              </div>

              <div className="w-px h-4 bg-gray-300"></div>

              <ItemNavLink
                content={
                  <div className="flex items-center space-x-1">
                    <HelpCircle className="w-4 h-4" />
                    <span>Ayuda</span>
                  </div>
                } 
                route="/soporte"
                myStyles="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              />

              <div className="w-px h-4 bg-gray-300"></div>

              <div className="flex items-center space-x-2 text-emerald-600 font-semibold">
                <Phone className="w-4 h-4" />
                <span>601 743 6620</span>
              </div>

              <div className="w-px h-4 bg-gray-300"></div>

              <ItemNavLink
              content="Mis viajes"
              route="/mis-viajes"
              myStyles="block px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 font-medium"
            />
            </div>

            {/* Autenticación */}
            {isAuthenticated ? (
              <ProfileButton />
            ) : (
              <div className="hidden md:flex items-center ">
                <button
                  onClick={() => navigate("/")}
                  className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 font-medium shadow-lg"
                >
                  Registrarse
                </button>
              </div>
            )}

            {/* Menú móvil */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <ItemNavLink
              content="Inicio"
              route="/index"
              myStyles="block px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 font-medium"
            />
            <ItemNavLink
              content="Paquetes"
              route="/paquetes"
              myStyles="block px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 font-medium"
            />
            <ItemNavLink
              content="Hotel"
              route="/hoteles"
              myStyles="block px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 font-medium"
            />
            <ItemNavLink
              content="Asistente IA"
              route="/ZenIA"
              myStyles="block px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 font-medium"
            />
            <ItemNavLink
              content="Ayuda"
              route="/soporte"
              myStyles="block px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 font-medium"
            />

            {/* Enlace de testing en móvil */}
            {isAuthenticated && (
              <ItemNavLink
                content="🧪 Test Permisos"
                route="/test-permissions"
                myStyles="block px-4 py-3 rounded-lg text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-all duration-200 font-medium border border-orange-200"
              />
            )}

            <RoleBasedComponent allowedRoles={["admin"]}>
              <ItemNavLink
                content="Admin Panel"
                route="/admin"
                myStyles="block px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 font-medium"
              />
            </RoleBasedComponent>

            <RoleBasedComponent allowedRoles={["empleado"]}>
              <ItemNavLink
                content="Panel Empleado"
                route="/employee"
                myStyles="block px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 font-medium"
              />
            </RoleBasedComponent>

            <RoleBasedComponent allowedRoles={["admin", "empleado"]}>
              <ItemNavLink
                content="Crear Paquete"
                route="/crearPaquete"
                myStyles="block px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 font-medium"
              />
            </RoleBasedComponent>

            <div className="pt-4 border-t border-gray-200">
              {!isAuthenticated ? (
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/")}
                    className="w-screen px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 font-medium"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="w-screen px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 font-medium"
                  >
                    Registrarse
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-screen px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}