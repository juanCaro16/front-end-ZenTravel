import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await axios.post('http://localhost:10101/Auth/login', {
        email,
        password
      });
  
      console.log('Login exitoso:', res.data);
      
  
      // 🔐 Guardar el token en localStorage
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken); // opcional
  
      onLoginSuccess(); // Notifica el éxito
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
            className="bg-[#28A745] text-black font-bold py-3 px-6 rounded-full hover:bg-[#218838] transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>
        {errorMsg && (
          <p className="text-red-500 text-sm text-center mt-4">
            {errorMsg}
          </p>
        )}

        <p className='text-center text-[14px] mt-5'>¿Ya Tienes Una Cuenta? <a className="text-[#28A745] hover:underline hover:text-black" href="/login">Iniciar Sesion</a></p>
        <p className='text-center text-[14px] mt-5'>¿Olvidaste Tu Contraseña? <a className="text-[#28A745] hover:underline hover:text-black" href="/reset-password">Recuperar Contraseña</a></p>
      </div>
    </div>
  );
};