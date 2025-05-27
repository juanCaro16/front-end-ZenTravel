import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export const Paquetes = () => {
  const navigate = useNavigate();
  const [paquetes, setPaquetes] = useState([]);
  const userId = localStorage.getItem("userId"); // Asegúrate de guardar el ID del usuario al iniciar sesión

  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        const response = await axios.get(`http://localhost:10101/api/paquetes/${userId}`);
        setPaquetes(response.data.paquetes);
      } catch (error) {
        console.error("Error al obtener los paquetes:", error);
      }
    };

    if (userId) {
      fetchPaquetes();
    }
  }, [userId]);

  const handleComprar = async (nombre) => {
    try {
      const response = await axios.post("http://localhost:10101/api/payments/create", {
        price: 10.0,
        name: nombre,
        quantity: 1,
      });

      const approvalUrl = response.data.approval_url;

      if (approvalUrl) {
        window.location.href = approvalUrl;
      } else {
        alert("No se pudo obtener la URL de aprobación");
      }
    } catch (error) {
      console.error("Error al crear el pago:", error);
      alert("Error al procesar el pago");
    }
  };

  return (
    <div className="flex flex-col items-center mt-16 gap-8">
      <button
        onClick={() => navigate("/crearPaquete")}
        className="w-max p-3 rounded-full bg-white text-black"
      >
        Agregar Paquete
      </button>

      {paquetes.length === 0 ? (
        <p>No hay paquetes disponibles.</p>
      ) : (
        paquetes.map((paquete) => (
          <div
            key={paquete.id}
            className="w-[90%] max-w-md bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:scale-[1.02]"
          >
            <img
              className="w-full h-60 object-cover rounded-xl shadow-md"
              src={paquete.imagenUrl}
              alt={paquete.nombrePaquete}
            />
            <h1 className="text-2xl font-bold text-gray-800">{paquete.nombrePaquete}</h1>
            <p className="text-gray-600 text-center text-sm px-2">
              {paquete.descripcion}
            </p>
            <button
              onClick={() => handleComprar(paquete.nombrePaquete)}
              className="bg-[#28A745] cursor-pointer text-white font-semibold px-6 py-2 rounded-full hover:bg-[#218838] transition duration-300"
            >
              Comprar Paquete
            </button>
          </div>
        ))
      )}
    </div>
  );
};
