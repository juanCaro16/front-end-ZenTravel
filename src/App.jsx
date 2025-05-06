import { Route, Routes } from "react-router-dom";
import { AppHeader } from "./Layouts/AppHeader/AppHeader";
import { Main } from "./Layouts/Main/Main";
import { Login } from "./Pages/Login/Login";
import { SophIA } from "./Pages/SophIA/SophIA";
import { Nosotros } from "./Pages/Nosotros/Nosotros";
import { Servicios } from "./Pages/Servicios/Servicios";
import { Contacto } from "./Pages/Contacto/Contacto";
import { ButtonHelp } from "./Components/ButtonHelp/ButtonHelp";
import { Soporte } from "./Pages/Soporte/Soporte";
import { Register } from "./Pages/Register/Register";
import { ResetPassword } from "./Pages/ResetPassword/ResetPassword";
import { NewPassword } from "./Pages/NewPassword/NewPassword";
import { ProfileButton } from "./Components/ProfileButton/ProfileButton";
import { Profile } from "./Pages/Profile/Profile";
import { useState } from "react";





export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <>
      <AppHeader>
        
        {/* Renderiza dinámicamente los botones o el ProfileButton */}
        {!isAuthenticated ? (
          <>
            <button
              onClick={() => window.location.href = "/login"}
              className="bg-[#28A745] text-black rounded-3xl px-4 py-2 hover:bg-[#218838]"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => window.location.href = "/register"}
              className="bg-[#28A745] text-black rounded-3xl px-4 py-2 hover:bg-[#218838]"
            >
              Registrarse
            </button>
          </>
        ) : (
          <ProfileButton />
        )}
      </AppHeader>


      <ButtonHelp />
      <Routes>
        {/* Ruta para la página principal */}
        <Route path="/" element={<Main />} />

        {/* Ruta para la página de inicio de sesión */}
        <Route
          path="/login"
          element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />}
        />

        {/* Ruta para la página de restablecimiento de contraseña */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Ruta para la página de nueva contraseña */}
        <Route path="/reset-password/:token" element={<NewPassword />} />

        {/* Ruta para la página de registro */}
        <Route path="/register" element={<Register />} />

        {/*ruta para la página de perfil */}
        <Route path="/profile" element={<Profile />} />

        {/* Ruta para la página de inicio */}

        {/* Ruta para la página de nosotros */}
        <Route path="/nosotros" element={<Nosotros />} />
       
        {/* Ruta para la página de sophIA */}
        <Route path="/sophIA" element={<SophIA />}/>

        {/* Ruta para la página de servicios */}
        <Route path="/servicios" element={<Servicios />} />

        {/* Ruta para la página de contacto */}
        <Route path="/contacto" element={<Contacto />} />

        {/* Ruta para la página de soporte */}
        <Route path="/soporte" element={<Soporte />} />

        {/* Ruta para la página de error 404 */}
        <Route path="*" element={<h1>404 Not Found</h1>} />

        
      </Routes>
    </>
  );
};