import { NavLink, Route, useNavigate } from "react-router-dom";
import img from "../../Images/logofull_sin_fondo-Photoroom.png";
import { Login } from "../../Pages/Login/Login";
import { ItemNavLink } from "../../Components/ItemNavLink/ItemNavLink";
import { ProfileButton } from "../../Components/ProfileButton/ProfileButton";


export const Header = ({ route }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-row justify-start gap-2 pt-2 items-center">
      <img className="w-20" src={img} />
      <h1 className="text-[#3C525D]">ZenTravel</h1>

      <ul className="flex flex-row gap-10 ml-35 mr-10 text-[#3C525D] font-semibold">
        <ItemNavLink myStyles="text-sky-500 hover:underline font-semibold" content="Inicio" route="/" />
        <ItemNavLink myStyles="text-sky-500 hover:underline font-semibold" content="Nosotros" route="/nosotros" />
        <ItemNavLink myStyles="text-sky-500 hover:underline font-semibold" content="Contacto" route="/contacto" />
        <ItemNavLink myStyles="text-sky-500 hover:underline font-semibold" content="Servicios" route="/servicios" />
        <ItemNavLink myStyles="text-sky-500 hover:underline font-semibold" content="SophIA" route="/sophIA" />
       <ProfileButton/>
      </ul>

      <button
        onClick={() => navigate("/login")}
        className="bg-[#F0FA39] text-black ml-[30rem] rounded-3xl px-4 py-2 hover:bg-[#D4E02E]"
      >
        Iniciar Sesión
      </button>
      <button
      onClick={() => navigate("/register")} 
      className="bg-[#F0FA39] text-black rounded-3xl px-4 py-2 hover:bg-[#D4E02E]">
        Registrarse
      </button>
    </div>  
  );
};