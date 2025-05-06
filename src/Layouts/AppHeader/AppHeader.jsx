import { NavLink, Route, useNavigate } from "react-router-dom";
import img from "../../Images/logofull_sin_fondo-Photoroom.png";
import { Login } from "../../Pages/Login/Login";
import { ItemNavLink } from "../../Components/ItemNavLink/ItemNavLink";
import { ProfileButton } from "../../Components/ProfileButton/ProfileButton";


export const AppHeader = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full  flex flex-row justify-start gap-2 pt-2 items-center">
      <img className="w-20" src={img} />
      <h1 className="text-[#3C525D]">ZenTravel</h1>

      <ul className="flex flex-row gap-10 ml-35 mr-10 text-[#3C525D] font-semibold">
        <ItemNavLink myStyles="text-[#007BFF] hover:underline hover:text-[#0056b3] font-semibold" content="Inicio" route="/" />
        <ItemNavLink myStyles="text-[#007BFF] hover:underline hover:text-[#0056b3] font-semibold" content="Nosotros" route="/nosotros" />
        <ItemNavLink myStyles="text-[#007BFF] hover:underline hover:text-[#0056b3] font-semibold" content="Contacto" route="/contacto" />
        <ItemNavLink myStyles="text-[#007BFF] hover:underline hover:text-[#0056b3] font-semibold" content="Servicios" route="/servicios" />
        <ItemNavLink myStyles="text-[#007BFF] hover:underline hover:text-[#0056b3] font-semibold" content="SophIA" route="/sophIA" />
        
      </ul>

      
      {/* Renderiza dinámicamente los children */}
      <div className="ml-auto mr-5 flex items-center gap-4">
        {children}
      </div>
    </div>  
  );
};