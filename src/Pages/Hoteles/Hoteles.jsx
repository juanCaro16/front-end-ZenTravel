import { useState } from "react"
import api from "../../Services/AxiosInstance/AxiosInstance"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { RoleBasedComponent } from "../../Components/RoleBasedComponent/RoleBasedComponent"

export const Hoteles = () => {
    const navigate = useNavigate()
    const [hoteles, setHoteles] = useState([])

    

  return (
    <div className="flex flex-col items-center mt-16 gap-8">
      <RoleBasedComponent allowedRoles={["Admin", "Empleado"]}>
        <button onClick={() => navigate("/CrearHoteles")} className="w-max p-3 rounded-full bg-white text-black">
            Agregar Hotel
        </button>
      </RoleBasedComponent>
    </div>
  )
}


