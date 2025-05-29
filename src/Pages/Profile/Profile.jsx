import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../../Services/AxiosInstance/AxiosInstance';


export const Profile = ({ onLogout }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    onLogout?.();

    await Swal.fire({
      title: '¡Cerraste sesión!',
      text: 'Esperamos verte pronto.',
      icon: 'success',
      confirmButtonColor: '#28A745'
    });

    navigate('/login');
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
  try {
    const response = await api.get('https://proyecto-zentravel.onrender.com/Auth/infoUserDTO');
    setUserInfo(response.data);
    setFormData(response.data);
  } catch (error) {
    console.error("❌ Error al cargar perfil:", error);
  } finally {
    setLoading(false);
  }
};

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch('https://proyecto-zentravel.onrender.com/Auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserInfo(formData);
      setEditable(false);
      Swal.fire('¡Perfil actualizado!', '', 'success');
    } catch (error) {
      console.error("❌ Error al guardar perfil:", error);
      Swal.fire('Error al guardar cambios', '', 'error');
    }
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (!userInfo) return <p>Error al cargar datos del perfil.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-lg font-bold">
          {userInfo.nombre?.slice(0, 2).toUpperCase()}
        </div>
        <div>
          {editable ? (
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="text-lg font-semibold border px-2 py-1 rounded w-full"
            />
          ) : (
            <h2 className="text-lg font-semibold">{userInfo.nombre}</h2>
          )}
          <p className="text-gray-500 text-sm">{userInfo.email}</p>
        </div>
      </div>

      <div>
        <h3 className="text-md font-semibold mb-1 text-neutral-800">Información general</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li><span className="font-semibold">ID:</span> {userInfo.id_usuario}</li>
          <li>
            <span className="font-semibold">Teléfono:</span>{' '}
            {editable ? (
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              userInfo.telefono
            )}
          </li>
          <li>
            <span className="font-semibold">Estilo de vida:</span>{' '}
            {editable ? (
              <input
                type="text"
                name="estiloVida"
                value={formData.estiloVida || ''}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full"
              />
            ) : (
              userInfo.estiloVida
            )}
          </li>
          <li><span className="font-semibold">Presupuesto:</span> ${userInfo.presupuesto}</li>
        </ul>
      </div>

      {/* Botones */}
      <div className="flex gap-3 justify-end">
        {editable ? (
          <>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Guardar
            </button>
            <button
              onClick={() => {
                setEditable(false);
                setFormData(userInfo); // Revertir cambios
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => setEditable(true)}
            >
              Editar perfil
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}