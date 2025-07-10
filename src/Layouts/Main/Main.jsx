"use client"

import { useNavigate } from "react-router-dom"
import { ArrowRight, MapPin, Star, Users, Shield } from "lucide-react"
import bg from "../../assets/Images/bg-image3.jpg"

export const Main = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Destinos Únicos",
      description: "Descubre los lugares más hermosos de Colombia",
    },
    {
      icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Experiencias Premium",
      description: "Viajes de alta calidad con atención personalizada",
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Grupos Pequeños",
      description: "Experiencias íntimas con grupos reducidos",
    },
    {
      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Viajes Seguros",
      description: "Tu seguridad es nuestra prioridad",
    },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background con overlay mejorado */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-teal-800/60 to-cyan-900/70 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: `url(${bg})`,
          }}
        ></div>

        {/* Contenido principal */}
        <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight">
              <span className="block bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                ZenTravel
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light leading-relaxed max-w-4xl mx-auto text-gray-100 px-4">
              Explora los rincones más hermosos de Colombia.
              <span className="block mt-2 text-emerald-200">
                Viajes únicos que conectan con la naturaleza, cultura y aventura.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 sm:pt-6 px-4">
              <button
                onClick={() => navigate("/servicios")}
                className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full font-semibold text-base sm:text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Descubre Colombia</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <button
                onClick={() => navigate("/ZenIA")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 hover:border-white/60 text-white hover:bg-white/10 rounded-full font-semibold text-base sm:text-lg backdrop-blur-sm transition-all duration-300"
              >
                Habla con ZenIA
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-2 sm:h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              ¿Por qué elegir
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {" "}
                ZenTravel
              </span>
              ?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto px-4">
              Ofrecemos experiencias de viaje únicas con la mejor calidad y atención personalizada
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-4 sm:p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            ¿Listo para tu próxima aventura?
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-emerald-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Únete a miles de viajeros que han descubierto la magia de Colombia con nosotros
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/paquetes")}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-emerald-600 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Ver Paquetes
            </button>
            <button
              onClick={() => navigate("/contacto")}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white hover:bg-white hover:text-emerald-600 rounded-full font-semibold text-base sm:text-lg transition-all duration-300"
            >
              Contactar Asesor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
