export const SophIA = () => {
    return (
      <div className="flex flex-col items-start justify-center h-screen w-screen gap-5 pl-[5rem] text-white">
        <h1 className="text-7xl w-[30rem] font-bold mb-4">Inteligencia Artificial De Ayuda</h1>
        <p className="text-lg w-[30rem] text-justify mb-6 text-black">
          ¿No sabes a dónde viajar o qué hacer en tus vacaciones? Ven, conoce nuestra asistente
          virtual Sophia, que te podrá ayudar a solucionar tus dudas.
        </p>
        <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
          <input
            type="text"
            placeholder="Escribe tu consulta"
            className="flex-grow outline-none text-black px-2 w-[20rem]"
          />
          <button className="text-blue-500 hover:text-blue-700">
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
                d="M12 19l9-7-9-7-9 7 9 7z"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  };