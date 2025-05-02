import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await axios.post('http://localhost:20101/Auth/reset-password', {
        email,
      });

      console.log('Enlace enviado:', res.data);
      setSuccessMsg('Se ha enviado un enlace de recuperación a tu correo.');
    } catch (err) {
      console.error('Error al enviar enlace:', err.response?.data || err.message);
      setErrorMsg('No se pudo enviar el enlace. Verifica el correo e intenta nuevamente.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Recuperar Contraseña</h2>
        <form onSubmit={handleResetRequest} className="flex flex-col gap-4">
          <p className="text-sm text-gray-600 text-center mb-2">
            Ingresa tu correo electrónico para recibir un enlace de recuperación.
          </p>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-[#F0FA39] text-black font-bold py-3 px-6 rounded-full hover:bg-[#D4E02E] transition-colors"
          >
            Enviar Enlace
          </button>
        </form>
        {errorMsg && <p className="text-red-500 text-sm text-center mt-4">{errorMsg}</p>}
        {successMsg && <p className="text-green-500 text-sm text-center mt-4">{successMsg}</p>}
        <p className="text-center text-sm text-gray-600 mt-4">
          ¿Ya recuerdas tu contraseña?{' '}
          <a href="/login" className="text-[#F0FA39] hover:underline">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
};
