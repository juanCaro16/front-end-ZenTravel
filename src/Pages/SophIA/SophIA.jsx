import React, { useState } from 'react';
import axios from 'axios';

export const SophIA = () => {
  const [inputValue, setInputValue] = useState('');
  const [respuestaIA, setRespuestaIA] = useState('');
  const [respuestaVisible, setRespuestaVisible] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setError('');
      setRespuestaIA('');
      setRespuestaVisible('');

      const response = await axios.post('http://localhost:10101/Preguntar', {
        Preguntar: inputValue
      });

      const fullText = response.data.respuesta;
      setRespuestaIA(fullText);

      let i = 0;
      let visible = '';
      const interval = setInterval(() => {
        if (i < fullText.length) {
          visible += fullText.charAt(i);
          setRespuestaVisible(visible);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 20);
    } catch (err) {
      console.error('Error al consultar la IA:', err);
      setError('Hubo un error al consultar a SophIA.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-50 px-4 py-12">
  <div className="bg-white rounded-2xl shadow-md p-8 max-w-3xl w-full space-y-6 border border-gray-200">
    <h1 className="text-4xl md:text-5xl font-black text-center text-gray-900">
      Inteligencia Artificial De Ayuda
    </h1>
    <p className="text-lg text-gray-600 text-center">
      ¿No sabes a dónde viajar o qué hacer en tus vacaciones? Conoce a nuestra asistente virtual <span className="font-semibold text-blue-800">SophIA</span>.
    </p>

    <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-inner">
      <input
        type="text"
        placeholder="Escribe tu consulta..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-grow bg-transparent outline-none text-gray-900 px-2 py-2 placeholder-gray-500"
      />
      <button
        onClick={handleSubmit}
        className="text-blue-800 hover:text-blue-900 transition-colors duration-200"
        title="Enviar"
      >
        ✈️
      </button>
    </div>

    <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 max-h-60 overflow-y-auto whitespace-pre-line text-gray-700">
      {error && <p className="text-red-500">{error}</p>}
      {respuestaVisible && (
        <p><strong className="text-blue-800">SophIA: </strong> {respuestaVisible}</p>
      )}
    </div>
  </div>
</div>

  );
};
