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
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Paquetes } from "./Pages/Paquetes/Paquetes";
import { CrearPaquetes } from "./Pages/CrearPaquetes/CrearPaquetes";
import  TokenRefresher from "./Services/TokenRefresher/TokenRefresher";
import { VerPaquetes } from "./Pages/VerPaquetes/VerPaquetes";




export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );
  const location = useLocation(); // Obtén la ubicación actual

  useEffect(() => {
    // Verifica el token cada vez que cambie la ruta
    if (!localStorage.getItem("accessToken")) {
      setIsAuthenticated(false);
    }
  }, [location]); // Ejecuta el efecto al cambiar la ruta

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false); // Actualiza el estado global correctamente
  };

  return (
    <>
 

      <AppHeader isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      
      <ButtonHelp />
      <TokenRefresher />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route
          path="/login"
          element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />}
          />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<NewPassword />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/sophIA" element={<SophIA />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/paquetes" element={<Paquetes />} />
        <Route path="/verPaquetes" element={<VerPaquetes />} />
        <Route path="/crearPaquete" element={<CrearPaquetes />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/soporte" element={<Soporte />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
         
    </>
  );
};