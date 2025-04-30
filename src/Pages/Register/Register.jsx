import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert('Las contraseñas no coinciden');
    }

    try {
      const res = await axios.post('http://localhost:20101/Auth/register', {
        nombre,
        email,
        telefono,
        password
      });

      console.log('Registro exitoso:', res.data);
      navigate('/login'); // redirige al login tras registrarse
    } catch (err) {
      console.error('Error de registro:', err.response?.data || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-[50%]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Regístrate</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Teléfono"
            className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirma tu contraseña"
            className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#F0FA39] text-black font-bold py-3 px-6 rounded-full hover:bg-[#D4E02E] transition-colors"
          >
            Registrarse
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="text-[#F0FA39] hover:underline hover:text-black">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};
