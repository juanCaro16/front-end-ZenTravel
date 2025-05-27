import { useNavigate } from "react-router-dom";

export const Main = () => {
  const navigate = useNavigate();

  return (
<<<<<<< HEAD
    <>
      <div className="w-full flex pl-20 flex-col justify-center items-start mt-30 gap-8">
        <h2 className="text-black text-6xl font-black">ZenTravel</h2>
        <p className="text-black w-[40rem]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, autem. Fuga sequi saepe minus pariatur earum commodi quaerat praesentium ea dignissimos facere nulla reprehenderit hic assumenda aut facilis, aspernatur dicta.</p>
        <button onClick={() => navigate("/servicios")} className="bg-[#28A745] hover:bg-[#218838] cursor-pointer  rounded-2xl w-40 h-10 font-bold ml-15">Descúbrelo</button>
     </div>
    </>
  )
}
=======
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
>>>>>>> 7c1a376be30c6438a1151a084dee52158e36353b
