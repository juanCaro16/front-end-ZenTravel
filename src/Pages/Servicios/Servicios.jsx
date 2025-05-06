import { useEffect, useState } from "react";

export const Servicios = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const servicios = [
    {
      titulo: "Seguridad",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a enim nec nisl ullamcorper eleifend. Praesent risus leo, fringilla et nulla at, egestas euismod orci.",
    },
    {
      titulo: "Precios Bajos",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a enim nec nisl ullamcorper eleifend. Praesent risus leo, fringilla et nulla at, egestas euismod orci.",
    },
    {
      titulo: "Excelentes Paquetes Familiares",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a enim nec nisl ullamcorper eleifend. Praesent risus leo, fringilla et nulla at, egestas euismod orci.",
    },
    {
      titulo: "Realidad Aumentada",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a enim nec nisl ullamcorper eleifend. Praesent risus leo, fringilla et nulla at, egestas euismod orci.",
    },
    {
      titulo: "Implementación de IA",
      descripcion:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a enim nec nisl ullamcorper eleifend. Praesent risus leo, fringilla et nulla at, egestas euismod orci.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % servicios.length);
    }, 3000); // Cambia cada 3 segundos
    return () => clearInterval(interval);
  }, [servicios.length]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-[30%] text-white ">
      <div className="relative w-full max-w-4xl overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {servicios.map((servicio, index) => (
            <div
              key={index}
              className="min-w-full flex-shrink-0 p-6 flex flex-col items-center bg-[#2d2b2b6c] shadow-lg"
            >
              <h2 className="text-xl font-bold mb-2">{servicio.titulo}</h2>
              <p className="text-sm text-justify mx-auto w-[15rem]">
                {servicio.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Botón de registro */}
      <button className="mt-8 bg-[#28A745] text-black font-bold py-2 px-6 rounded-full hover:bg-[#218838]">
        REGÍSTRATE AHORA
      </button>
    </div>
  );
};