// src/pages/RequestReset.jsx
import React, { useState } from 'react';
import axios from 'axios';

export const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    try {
      const res = await axios.post('http://localhost:10101/Password/validar-password', { email });
      setMsg(res.data.message);
    } catch (err) {
      console.error('❌ Error:', err);
      setError('No se pudo enviar el enlace. Verifica el correo e intenta nuevamente.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: `url('/fondo.jpg')` }}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Recuperar Contraseña</h2>
        <p className="mb-6 text-gray-600">Ingresa tu correo electrónico para recibir un enlace de recuperación.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-lg outline-none bg-gray-100 text-black"
          />
          <button type="submit" className="bg-[#F0FA39] text-black font-bold py-3 rounded-full hover:bg-[#e2f528]">
            Enviar Enlace
          </button>
        </form>
        {msg && <p className="text-green-500 mt-4">{msg}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};
