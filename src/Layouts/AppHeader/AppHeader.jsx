import { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../../Images/logofull_sin_fondo-Photoroom.png";
import { ItemNavLink } from "../../Components/ItemNavLink/ItemNavLink";
import { ProfileButton } from "../../Components/ProfileButton/ProfileButton";

export const AppHeader = ({ isAuthenticated, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    onLogout();
    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow-md py-3 px-6 flex items-center justify-between">
      {/* Logo y navegación principal */}
      <div className="flex items-center gap-6">
        <img className="w-14 h-auto" src={img} alt="ZenTravel Logo" />
        <nav className="hidden md:flex gap-4">
          <ItemNavLink  content="Inicio" route="/" />
          <ItemNavLink  content="Paquetes" route="/hoteles" />
          <ItemNavLink  content="Hotel + Vuelo" route="/paquetes" />
          <ItemNavLink  content="Ofertas" route="/ofertas" />
          <ItemNavLink  content="IA" route="/SophIA" />
        </nav>
      </div>

      {/* Controles adicionales */}
      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center gap-3 text-sm text-gray-700">
          <span className="flex items-center gap-1">
            <img src="https://flagcdn.com/w40/co.png" alt="Colombia" className="w-5 h-5 rounded-full" />
            Español - COP
          </span>
          <span className="border-l h-5"></span>
          <ItemNavLink content="Ayuda" route="/soporte"/>
          
          <span className="border-l h-5"></span>
          <span>📞 <strong>601 743 6620</strong></span>
          <span className="border-l h-5"></span>
          <span>🧳 Mis viajes</span>
        </div>

        {isAuthenticated ? (
          <ProfileButton />
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Iniciar Sesión
          </button>
        )}

        {/* Menú móvil */}
        <div className="relative md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          {/* Menú lateral flotante para móvil */}
          
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-md z-50">
              <ItemNavLink content="Vuelos" route="/" myStyles="block px-4 py-2 hover:bg-gray-100" />
              <ItemNavLink content="Hoteles" route="/hoteles" myStyles="block px-4 py-2 hover:bg-gray-100" />
              <ItemNavLink content="Hotel + Vuelo" route="/paquetes" myStyles="block px-4 py-2 hover:bg-gray-100" />
              <ItemNavLink content="Disney" route="/disney" myStyles="block px-4 py-2 hover:bg-gray-100" />
              <ItemNavLink content="Ofertas" route="/ofertas" myStyles="block px-4 py-2 hover:bg-gray-100" />
              <ItemNavLink content="IA" route="/sophIA" myStyles="block px-4 py-2 hover:bg-gray-100" />
              {!isAuthenticated && (
                <>
                  <ItemNavLink content="Iniciar Sesión" route="/login" myStyles="block px-4 py-2 hover:bg-gray-100" />
                  <ItemNavLink content="Registrarse" route="/register" myStyles="block px-4 py-2 hover:bg-gray-100" />
                </>
              )}
              {isAuthenticated && (
                <>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
    </header>
  );
};
