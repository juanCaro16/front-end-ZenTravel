import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Limpiar mensaje anterior
    try {
      const res = await axios.post('http://localhost:20101/Auth/login', {
        email,
        password
      });

      console.log('Login exitoso:', res.data);
      navigate('/');
    } catch (err) {
      console.error('Error de login:', err.response?.data || err.message);
      setErrorMsg('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="flex items-center justify-center w-[40%] h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#F0FA39] text-black font-bold py-3 px-6 rounded-full hover:bg-[#D4E02E] transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>
        {errorMsg && (
          <p className="text-red-500 text-sm text-center mt-4">
            {errorMsg}
          </p>
        )}
        <p className="text-center text-sm text-gray-600 mt-4">
          ¿No tienes una cuenta?{' '}
          <a href="/register" className="text-black hover:underline hover:text-sky-600">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};
