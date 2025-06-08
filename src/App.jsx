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
import { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Paquetes } from "./Pages/Paquetes/Paquetes";
import { CrearPaquetes } from "./Pages/CrearPaquetes/CrearPaquetes";
import  TokenRefresher from "./Services/TokenRefresher/TokenRefresher";
import { Admin } from "./Pages/Administracion/Admin";




export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );
  const location = useLocation(); // Obtén la ubicación actual

  const hideHeaderPaths = [ "/", "/register"]
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname)

  useEffect(() => {
    // Verifica el token cada vez que cambie la ruta
    if (!localStorage.getItem("accessToken")) {
      setIsAuthenticated(false);
    }
  }, [location]); // Ejecuta el efecto al cambiar la ruta

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("Rol");
    setIsAuthenticated(false); // Actualiza el estado global correctamente
  };

  return (
    <>

      {!shouldHideHeader && <AppHeader isAuthenticated={isAuthenticated} onLogout={handleLogout} />}
      
      <ButtonHelp />
      <TokenRefresher />
      <Routes>
        <Route path="/index" element={<Main />} />
        <Route path="/Admin" element={<Admin/>}/>
        <Route
          path="/"
          element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />}
          />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<NewPassword />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/sophIA" element={<SophIA />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/paquetes" element={<Paquetes />} />
        <Route path="/inventario" />
        <Route path="/crearPaquete" element={<CrearPaquetes />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/soporte" element={<Soporte />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
         
    </>
  );
};