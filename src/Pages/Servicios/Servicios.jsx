import { useEffect, useState } from "react";

const imagenesColombia = [
  {
    url: "https://images.pexels.com/photos/12470916/pexels-photo-12470916.jpeg",
    frase: "Descubre la magia de cada rincón de Colombia",
  },
  {
    url: "https://images.pexels.com/photos/2884864/pexels-photo-2884864.jpeg",
    frase: "Caminos ancestrales, paisajes de leyenda",
  },
  {
    url: "https://images.pexels.com/photos/1559699/pexels-photo-1559699.jpeg",
    frase: "Colombia: tradición, color y alegría en un solo lugar",
  },
  {
    url: "https://images.pexels.com/photos/8264573/pexels-photo-8264573.jpeg",
    frase: "Colombia: tu próximo destino soñado",
  },
  {
    url: "https://images.pexels.com/photos/5715020/pexels-photo-5715020.jpeg",
    frase: "Explora, vive y siente Colombia como nunca antes",
  },
  
  
];

export const Servicios = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const servicios = [
  {
    titulo: "Viajes con Propósito",
    descripcion:
      "Explora destinos únicos mientras conectas con culturas, apoyas comunidades locales y transformas cada aventura en una experiencia significativa.",
  },
  {
    titulo: "Tecnología que Inspira Confianza",
    descripcion:
      "Nuestra plataforma, impulsada por inteligencia artificial, hace que planear tu viaje sea fácil, rápido e intuitivo.",
  },
  {
    titulo: "Acompañamiento 24/7",
    descripcion:
      "Estés donde estés, nuestro equipo te acompaña antes, durante y después del viaje para que solo te ocupes de disfrutar.",
  },
  {
    titulo: "Experiencias Personalizadas",
    descripcion:
      "Diseñamos viajes a tu medida. Tú eliges el destino, el ritmo y el estilo... nosotros lo hacemos posible.",
  },
  {
    titulo: "Compromiso con la Naturaleza y Contigo",
    descripcion:
      "Promovemos un turismo consciente y sostenible, cuidando tanto los paisajes que visitas como la experiencia que vives.",
  },
];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imagenesColombia.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[100%] overflow-hidden text-white">
      {/* Fondo dinámico */}
      <div className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out">
        {imagenesColombia.map((img, index) => (
          <img
            key={index}
            src={img.url}
            alt={`Colombia fondo ${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${currentIndex === index ? "opacity-100" : "opacity-0"
              }`}
          />
        ))}
        
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-[#10B981] drop-shadow-lg">
          Bienvenido a la Experiencia Zentravel 🌍
        </h1>

        <p className="text-xl md:text-2xl max-w-2xl mb-10 text-white font-semibold drop-shadow-md">
          {imagenesColombia[currentIndex].frase}
        </p>

        {/* Caja de servicios */}
        <div className="bg-[#052e25cc] backdrop-blur-sm border border-[#10B981] rounded-2xl shadow-2xl p-8 w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-[#10B981] mb-4">
            ¿Por qué viajar con nosotros?
          </h2>

          <div className="transition-all duration-700 ease-in-out text-white">
            <h3 className="text-xl font-semibold mb-2">
              {servicios[currentIndex].titulo}
            </h3>
            <p className="text-md leading-relaxed text-white">
              {servicios[currentIndex].descripcion}
            </p>
          </div>
        </div>

        {/* Llamado de acción */}
        <p className="mt-12 text-2xl text-white font-medium max-w-xl drop-shadow">
          ✈️ Vive Colombia como nunca antes... ¡El viaje empieza aquí!
        </p>
      </div>
    </div>
  );
};