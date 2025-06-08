import { useNavigate } from "react-router-dom"
import { ArrowRight, MapPin, Star, Users, Shield } from "lucide-react"
import bg from "../../assets/Images/bg-image3.jpg"
export const Main = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Destinos Únicos",
      description: "Descubre los lugares más hermosos de Colombia",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Experiencias Premium",
      description: "Viajes de alta calidad con atención personalizada",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Grupos Pequeños",
      description: "Experiencias íntimas con grupos reducidos",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Viajes Seguros",
      description: "Tu seguridad es nuestra prioridad",
    },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background con overlay mejorado */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-teal-800/60 to-cyan-900/70 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: `url(${bg})`,
          }}
        ></div>

        {/* Contenido principal */}
        <div className="relative z-20 text-center text-white px-6 max-w-5xl mx-auto">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="block bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
                ZenTravel
              </span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed max-w-3xl mx-auto text-gray-100">
              Explora los rincones más hermosos de Colombia.
              <span className="block mt-2 text-emerald-200">
                Viajes únicos que conectan con la naturaleza, cultura y aventura.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <button
                onClick={() => navigate("/servicios")}
                className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full font-semibold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Descubre Colombia</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <button
                onClick={() => navigate("/SophIA")}
                className="px-8 py-4 border-2 border-white/30 hover:border-white/60 text-white hover:bg-white/10 rounded-full font-semibold text-lg backdrop-blur-sm transition-all duration-300"
              >
                Habla con SophIA
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ¿Por qué elegir
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {" "}
                ZenTravel
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos experiencias de viaje únicas con la mejor calidad y atención personalizada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">¿Listo para tu próxima aventura?</h2>
          <p className="text-xl text-emerald-100 mb-6 max-w-2xl mx-auto">
            Únete a miles de viajeros que han descubierto la magia de Colombia con nosotros
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/paquetes")}
              className="px-8 py-4 bg-white text-emerald-600 rounded-full font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Ver Paquetes
            </button>
            <button
              onClick={() => navigate("/contacto")}
              className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-emerald-600 rounded-full font-semibold text-lg transition-all duration-300"
            >
              Contactar Asesor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
