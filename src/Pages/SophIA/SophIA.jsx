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
      setRespuestaIA(fullText); // Guardamos la respuesta completa

      let i = 0;
      const interval = setInterval(() => {
        if (i < fullText.length) {
          setRespuestaVisible((prev) => prev + fullText.charAt(i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 20); // velocidad (ms) entre cada letra
    } catch (err) {
      console.error('Error al consultar la IA:', err);
      setError('Hubo un error al consultar a SophIA.');
    }
  };

  return (
    <div className="flex flex-col bg-teal-300 bg-cover  items-center justify-center h-full w-[99.9vw] pt-5">
      <div className="w-[70%] bg-white p-8 rounded-xl mb-[15rem] shadow-lg">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-4 text-black">Inteligencia Artificial De Ayuda</h1>
        <p className="text-lg sm:text-xl text-justify mb-6 text-black">
          ¿No sabes a dónde viajar o qué hacer en tus vacaciones? Ven, conoce nuestra asistente virtual Sophia, que te podrá ayudar a solucionar tus dudas.
        </p>

        <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md mb-6">
          <input
            type="text"
            placeholder="Escribe tu consulta"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow outline-none text-black px-2 py-2 w-[300px] sm:w-[350px] md:w-[400px]"
          />
          <button onClick={handleSubmit} className="text-blue-500 hover:text-blue-700 ml-3">
            <svg xmlns="http://www.w3.org/2000/svg" 
              width="24" height="24" viewBox="0 0 24 24" 
              fill="none" stroke="currentColor" strokeWidth="2" 
              strokeLinecap="round" strokeLinejoin="round" 
              className="lucide lucide-send-horizontal">
              <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/>
              <path d="M6 12h16"/>
            </svg>
          </button>
        </div>

        {/* Mostrar respuesta o error */}
        <div className="bg-white border-1 border-l-neutral-950 text-black p-4 rounded shadow mt-4 overflow-y-auto max-h-[20rem] whitespace-pre-line">
          {error && <p className="text-red-500">{error}</p>}
          {respuestaVisible && (
            <p><strong>SophIA:</strong> {respuestaVisible}</p>
          )}
        </div>
      </div>
    </div>
  );
};
