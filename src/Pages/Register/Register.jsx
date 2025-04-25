import React from 'react';

export const Register = () => {
  return (
    <div className="flex items-center justify-center h-screen w-[50%]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Regístrate</h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
          />
          <input
            type="password"
            placeholder="Confirma tu contraseña"
            className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
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