export const SophIA = () => {
    return (
      <div className="flex flex-col items-start justify-center h-screen w-screen gap-5 pl-[5rem] text-Black font-black">
        
        <h1 className="text-7xl w-[30rem] font-bold mb-4">Inteligencia Artificial De Ayuda</h1>
        <p className="text-lg w-[30rem] text-justify mb-6 text-white">
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
          <svg xmlns="http://www.w3.org/2000/svg" 
          width="24" height="24" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" stroke-width="2" 
          stroke-linecap="round" stroke-linejoin="round" 
          class="lucide lucide-send-horizontal-icon lucide-send-horizontal">
          <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/>
          <path d="M6 12h16"/></svg>
          </button>
        </div>
        <div>

        </div>
      </div>
    );
  };