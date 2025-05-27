import { useNavigate } from "react-router-dom";

export const Main = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-[90vh] bg-cover bg-center"
      style={{
        backgroundImage: `url('/img/valle-cocora.webp')`, // Cambia por tu ruta real
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-20 max-w-screen-xl mx-auto text-white space-y-6">
        <h2 className="text-4xl md:text-6xl font-black font-serif">
          ZenTravel
        </h2>

        <p className="max-w-2xl text-base md:text-lg font-light leading-relaxed">
          Explora los rincones más hermosos de Colombia. Viajes únicos que te
          conectan con la naturaleza, la cultura y la aventura.
        </p>

        <button
          onClick={() => navigate("/servicios")}
          className="bg-[#28A745] hover:bg-[#218838] transition-all duration-300 ease-in-out px-6 py-3 rounded-full text-white font-semibold w-fit shadow-lg"
        >
          Descúbrelo
        </button>
      </div>
    </div>
  );
};
