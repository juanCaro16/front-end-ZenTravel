import React from 'react';

export const Contacto = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white px-4">
      {/* Título y descripción */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Contacto</h1>
        <p className="text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a enim nec nisl ullamcorper
          eleifend. Praesent risus leo, fringilla et nulla at, egestas euismod orci.
        </p>
      </div>

      {/* Información de contacto y formulario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Información de contacto */}
        <div className="text-left">
          <h2 className="text-xl font-semibold mb-4">Utiliza las siguientes vías de contacto, o rellena el formulario.</h2>
          <p className="mb-2">
            <span className="font-bold">Vía E-mail:</span>{' '}
            <a href="mailto:hola@unsitiogenial.es" className="text-[#F0FA39] hover:underline">
              hola@unsitiogenial.es
            </a>
          </p>
          <p className="mb-2">
            <span className="font-bold">En nuestras redes sociales:</span>{' '}
            <a href="https://twitter.com/unsitiogenial" target="_blank" rel="noopener noreferrer" className="text-[#F0FA39] hover:underline">
              @unsitiogenial
            </a>
          </p>
          <p className="mb-2">
            <span className="font-bold">Por teléfono:</span>{' '}
            <a href="tel:911234567" className="text-[#F0FA39] hover:underline">
              91-1234-567
            </a>
          </p>
        </div>

        {/* Formulario */}
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Escribe tu nombre"
            className="w-full p-3 rounded-lg outline-none text-black bg-white"
          />
          <input
            type="email"
            placeholder="Escribe tu e-mail"
            className="w-full p-3 rounded-lg outline-none text-black bg-white"
          />
          <input
            type="tel"
            placeholder="Escribe tu teléfono (Opcional)"
            className="w-full p-3 rounded-lg outline-none text-black bg-white"
          />
          <textarea
            placeholder="Escribe tu mensaje"
            rows="4"
            className="w-full p-3 rounded-lg outline-none text-black bg-white"
          ></textarea>
          <button
            type="submit"
            className="bg-[#F0FA39] text-black font-bold py-3 px-6 rounded-full hover:bg-[#D4E02E] transition-colors"
          >
            ENVIAR MENSAJE
          </button>
        </form>
      </div>
    </div>
  );
};