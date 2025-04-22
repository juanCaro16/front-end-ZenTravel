export const Soporte = () => {
    return (
      <div className="h-screen text-white px-8 py-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          
        
        </div>
  
        {/* Título principal */}
        <h2 className="text-4xl font-bold text-center mb-6">Soporte Técnico</h2>
  
        {/* Barra de búsqueda */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md w-full max-w-2xl">
            <input
              type="text"
              placeholder="¿Con qué podemos ayudarte?"
              className="flex-grow outline-none text-black px-2"
            />
            <button className="text-gray-500 hover:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24" 
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </button>
          </div>
        </div>
  
        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Preguntas comunes */}
          <div>
            <h3 className="text-2xl font-bold mb-4 ">Preguntas comunes</h3>
            <p className="text-sm mb-4 w-[80%]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a enim
              nec nisl ullamcorper eleifend. Praesent risus leo, fringilla et
              nulla at, egestas euismod orci.
            </p>
            <p className="text-sm w-[80%]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a enim
              nec nisl ullamcorper eleifend. Praesent risus leo, fringilla et
              nulla at, egestas euismod orci.
            </p>
          </div>
  
          {/* Formulario */}
          <div>
            <form className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-3 rounded-lg outline-none text-black bg-white"
                />
                <input  
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 rounded-lg outline-none text-black bg-white"
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 rounded-lg outline-none text-black bg-white"
              />
              <textarea
                placeholder="Message"
                rows="4"
                className="w-full p-3 rounded-lg outline-none text-black bg-white   "
              ></textarea>
              <button
                type="submit"
                className="bg-[#F0FA39] text-black font-bold py-3 px-6 rounded-full hover:bg-[#D4E02E] transition-colors"
              >
                ENVIAR
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };