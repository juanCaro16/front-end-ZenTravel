import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export const Profile = ({ onLogout }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    onLogout(); // Llama a la función para actualizar el estado global
    navigate('/login');
  };

  const handleEditProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');

        const response = await axios.patch('http://localhost:10101/Auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    } catch (error) {
      
    }

      console.log("Editar perfil");
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

        console.log("✅ Datos del usuario:", response.data);
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
           
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-6">
    
      {/* Información del usuario */}
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-bold">
          {userInfo.nombre?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{userInfo.nombre}</h2>
          <p className="text-gray-500">{userInfo.email}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Información general</h3>
        <ul className="text-gray-700 space-y-1">
          <li><span className="font-semibold">Id:</span> {userInfo.id_usuario}</li>
          <li><span className="font-semibold">Teléfono:</span> {userInfo.telefono}</li>
          <li><span className="font-semibold">Estilo de vida:</span> {userInfo.estiloVida}</li>
          <li><span className="font-semibold">Presupuesto:</span> ${userInfo.presupuesto}</li>
        </ul>
      </div>

      {/* Acciones */}
      <div className="w-full flex justify-between">
        <button className="w-[40%] py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Editar perfil
        </button>
        <button onClick={handleLogout} className="w-[50%] py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};
