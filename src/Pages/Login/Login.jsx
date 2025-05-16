import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Eye, EyeOff } from 'lucide-react'; // Asegúrate de tener instalada esta librería

export const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

      console.log('Login response:', res.data);

      const access = res.data.AccessToken; // ← Usa A mayúscula
      const refresh = res.data.refreshToken; // ← Aunque está vacío, no genera error

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', JSON.stringify(refresh)); // por si es un objeto

      onLoginSuccess();

      await Swal.fire({
        title: '¡Inicio de sesión exitoso!',
        icon: 'success',
        confirmButtonColor: '#28A745'
      });

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

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              className="w-full p-3 rounded-lg outline-none text-black bg-gray-100 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-black"
              aria-label="Mostrar contraseña"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="bg-[#28A745] text-black font-bold py-3 px-6 rounded-full hover:bg-[#218838] transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>

        {errorMsg && (
          <p className="text-red-500 text-sm text-center mt-4">{errorMsg}</p>
        )}

        <p className="text-center text-[14px] mt-5">
          ¿No Tienes Una Cuenta?{' '}
          <a
            className="text-[#28A745] hover:underline hover:text-black"
            href="/register"
          >
            Registrarse
          </a>
        </p>
        <p className="text-center text-[14px] mt-2">
          ¿Olvidaste Tu Contraseña?{' '}
          <a
            className="text-[#28A745] hover:underline hover:text-black"
            href="/reset-password"
          >
            Recuperar Contraseña
          </a>
        </p>
      </div>
    </div>
  );
};
