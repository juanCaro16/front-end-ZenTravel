import { useState } from "react";

export const HabitacionCarrusel = ({ imagenes = [] }) => {
  const [actual, setActual] = useState(0);

  const siguiente = () => {
    setActual((prev) => (prev + 1) % imagenes.length);
  };

  const anterior = () => {
    setActual((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  if (imagenes.length === 0) return <p>No hay imágenes para mostrar.</p>;

  return (
    <div className="relative w-full">
      <img
        src={imagenes[actual]}
        alt={`Habitación ${actual + 1}`}
        className="w-full h-64 object-cover rounded-xl"
      />

      {/* Botones de navegación */}
      <button
        onClick={anterior}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full px-3 py-1"
      >
        ←
      </button>
      <button
        onClick={siguiente}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white rounded-full px-3 py-1"
      >
        →
      </button>

      {/* Indicadores */}
      <div className="flex justify-center mt-2 gap-1">
        {imagenes.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i === actual ? "bg-black" : "bg-gray-400"}`}
          />
        ))}
      </div>
    </div>
  );
};