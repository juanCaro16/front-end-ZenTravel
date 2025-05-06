import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validación de la cantidad de digitos de la contraseña
    if (password.length < 8 || password.length > 15) {
      newErrors.password = 'La contraseña debe tener entre 8 y 15 caracteres.';
    }

    // Validación de que las contraseñas son iguales
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
    }

    // Si hay errores, no continúa ^	Inicio del string.
    //\d	Un dígito (0–9).
    //{10}	Exactamente 10 dígitos.
    //$	Fin del string.
  
    // Validación teléfono
    if (!/^\d{10}$/.test(telefono)) {
      newErrors.telefono = 'El número debe tener exactamente 10 dígitos.';
    }

 
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post('http://localhost:10101/Auth/register', {
        nombre,
        email,
        telefono,
        password
      });

      console.log('Registro exitoso:', res.data);
      navigate('/login');
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        err.response?.status === 422
      ) {
        const backendErrors = err.response.data.errors;
        const formattedErrors = {};
        backendErrors.forEach((error) => {
          formattedErrors[error.path] = error.msg;
        });
        setErrors(formattedErrors);
      } else {
        setErrors({ general: 'Ocurrió un error inesperado' });
        console.error(err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-[50%] mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Regístrate</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Nombre completo"
              className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Teléfono"
              className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirma tu contraseña"
              className="w-full p-3 rounded-lg outline-none text-black bg-gray-100"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#28A745] text-black font-bold py-3 px-6 rounded-full hover:bg-[#218838] transition-colors"
          >
            Registrarse
          </button>

          {errors.general && (
            <p className="text-center text-red-500 text-sm mt-2">{errors.general}</p>
          )}
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="text-[#28A745] hover:underline hover:text-black">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};
