import { useNavigate } from "react-router-dom";
import img from "../../assets/Images/bg-image2.jpg";
import axios from "axios";

export const Paquetes = () => {
  const navigate = useNavigate();

  const handleComprar = async () => {
    try {
      const response = await axios.post('http://localhost:10101/api/payments/create', {
        price: 10.00,
        name: 'Paquete a Cancún',
        quantity: 1
      });

      const approvalUrl = response.data.approval_url; // NOTA: guión bajo

      if (approvalUrl) {
        window.location.href = approvalUrl;
      } else {
        alert('No se pudo obtener la URL de aprobación');
      }
    } catch (error) {
      console.error('Error al crear el pago:', error);
      alert('Error al procesar el pago');
    }
  };
  return (
    <div className="flex items-center justify-center mt-16">
      <button onClick={() =>(navigate("/crearPaquete"))} className="w-max p-3 rounded-full bg-white text-black absolute left-40 top-25">Agregar Paquete</button>
      <div className="w-[90%] max-w-md bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-[1.02]">
        <img 
          className="w-full h-60 object-cover rounded-xl shadow-md" 
          src={img} 
          alt="Paquete Santa Marta"
        />
        <h1 className="text-2xl font-bold text-gray-800">Santa Marta</h1>
        <p className="text-gray-600 text-center text-sm px-2">
          Descubre las playas paradisíacas y la magia del Caribe colombiano. Vive una experiencia inolvidable llena de cultura, naturaleza y aventura.
        </p>
        <button onClick={handleComprar} className="bg-[#28A745] cursor-pointer text-white font-semibold px-6 py-2 rounded-full hover:bg-[#218838] transition duration-300">
          Comprar Paquete
        </button>
      </div>
    </div>
  );
};
