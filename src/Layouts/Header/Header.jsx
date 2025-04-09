import img from "../../Images/logofull_sin_fondo-Photoroom.png"

export const Header = () => {
  return (
    
      <div className="w-full flex flex-row justify-start gap-2 pt-2 items-center">
        <img className="w-20" src={img}/>
        <h1 className="text-[#3C525D]">ZenTravel</h1>

        <ul className="flex flex-row gap-10 ml-35 mr-10 text-[#3C525D] font-semibold">
            <li className="cursor-pointer">Inicio</li>
            <li className="cursor-pointer">Servicios</li>
            <li className="cursor-pointer">Planes</li>
            <li className="cursor-pointer">Contacto</li>
        </ul>

        <button className="bg-[#F0FA39] text-black ml-[30rem] rounded-3xl px-4 py-2">Iniciar Sesión</button>
        <button className="bg-[#F0FA39] text-black  rounded-3xl px-4 py-2 hover:bg-yellow-200">Registrarse</button>
      </div>
    
  )
}
