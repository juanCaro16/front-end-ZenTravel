import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Profile = ({ onLogout }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    onLogout?.();

    await Swal.fire({
      title: '¡Cerraste sesión!',
      icon: 'success',
      draggable: true,
      confirmButtonColor: '#28A745'
    });

    navigate('/login');
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:10101/Auth/infoUserDTO', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error("❌ Error al cargar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) return <p>Cargando perfil...</p>;
  if (!userInfo) return <p>Error al cargar datos del perfil.</p>;

  return (
    <div className="space-y-6">
      {/* Información del usuario */}
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-lg font-bold">
          {userInfo.nombre?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{userInfo.nombre}</h2>
          <p className="text-gray-500 text-sm">{userInfo.email}</p>
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold mb-1 text-neutral-800">Información general</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li><span className="font-semibold">ID:</span> {userInfo.id_usuario}</li>
          <li><span className="font-semibold">Teléfono:</span> {userInfo.telefono}</li>
          <li><span className="font-semibold">Estilo de vida:</span> {userInfo.estiloVida}</li>
          <li><span className="font-semibold">Presupuesto:</span> ${userInfo.presupuesto}</li>
        </ul>
      </div>

      {/* Acciones */}
      <div className="flex gap-3">
        <button
          className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => console.log("Editar perfil")}
        >
          Editar perfil
        </button>
        <button
          className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};
