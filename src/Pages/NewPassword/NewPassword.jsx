import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export const NewPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:20101/Password/reset-password?token=${token}`,
        { newPassword }
      );
      setMessage("Contraseña actualizada correctamente.");
      setTimeout(() => {
        navigate("/login"); // o cualquier ruta que prefieras
      }, 2000);
    } catch (error) {
      setMessage("Error al actualizar la contraseña.");
    }
  };

  return (
    <div className="p-6  mt-[10%] max-w-md mx-auto bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="border w-full p-2 mb-4 rounded"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-[#F0FA39] hover:bg-[#e2f528] text-black py-2 px-4 rounded-xl"
        >
          Cambiar Contraseña
        </button>

        <p className="text-center mt-2">¿Ya Recordaste tu contraseña?<a className="text-black hover:underline hover:text-sky-600" href="/login">Iniciar Sesion</a> </p>
        
      </form>
      {message && <p className="mt-4 text-center text-green-500">{message}</p>}
    </div>
  );
};


