import { useState } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Globe,
  Users,
  Star,
  CheckCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react"

export const Contacto = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    serviceType: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Teléfono",
      description: "Habla directamente con nuestros expertos",
      contact: "601 743 6620",
      subtext: "Línea nacional",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      description: "Envíanos tu consulta detallada",
      contact: "info@zentravel.com",
      subtext: "Respuesta en 24h",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "WhatsApp",
      description: "Chatea con nosotros al instante",
      contact: "+57 300 123 4567",
      subtext: "Disponible 24/7",
      color: "from-green-500 to-green-600",
    },
  ]

  const officeInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Oficina Principal",
      details: ["Carrera 15 #93-47, Oficina 501", "Chapinero, Bogotá", "Colombia"],
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Horarios de Atención",
      details: ["Lunes a Viernes: 8:00 AM - 6:00 PM", "Sábados: 9:00 AM - 4:00 PM", "Domingos: 10:00 AM - 2:00 PM"],
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Cobertura",
      details: ["Todo el territorio colombiano", "Destinos internacionales", "Asesoría personalizada"],
    },
  ]

  const stats = [
    { icon: <Users className="w-6 h-6" />, number: "10,000+", label: "Viajeros felices" },
    { icon: <Star className="w-6 h-6" />, number: "4.9", label: "Calificación promedio" },
    { icon: <MapPin className="w-6 h-6" />, number: "50+", label: "Destinos disponibles" },
    { icon: <CheckCircle className="w-6 h-6" />, number: "99%", label: "Satisfacción del cliente" },
  ]

  const socialLinks = [
    { icon: <Instagram className="w-5 h-5" />, name: "Instagram", url: "#", color: "hover:text-pink-500" },
    { icon: <Facebook className="w-5 h-5" />, name: "Facebook", url: "#", color: "hover:text-blue-600" },
    { icon: <Twitter className="w-5 h-5" />, name: "Twitter", url: "#", color: "hover:text-blue-400" },
    { icon: <Youtube className="w-5 h-5" />, name: "YouTube", url: "#", color: "hover:text-red-500" },
  ]

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío del formulario
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        serviceType: "",
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contáctanos
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Hoy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Estamos aquí para hacer realidad tu próximo viaje. Nuestro equipo de expertos está listo para asesorarte y
            crear la experiencia perfecta para ti.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl mb-4 text-white">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group"
            >
              <div className={`h-2 bg-gradient-to-r ${method.color}`}></div>
              <div className="p-8">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-white">{method.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{method.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{method.description}</p>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-900">{method.contact}</p>
                  <p className="text-sm text-gray-500">{method.subtext}</p>
                </div>
                <button
                  className={`mt-6 w-full py-3 px-4 bg-gradient-to-r ${method.color} text-white rounded-xl hover:opacity-90 transition-opacity duration-200 font-semibold`}
                >
                  Contactar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Envíanos un Mensaje</h2>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">¡Mensaje enviado exitosamente!</h3>
                    <p className="text-green-700 text-sm">Te contactaremos pronto para ayudarte con tu consulta.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                      placeholder="300 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de servicio</label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    >
                      <option value="">Selecciona un servicio</option>
                      <option value="paquetes">Paquetes turísticos</option>
                      <option value="hoteles">Reserva de hoteles</option>
                      <option value="vuelos">Vuelos</option>
                      <option value="tours">Tours y excursiones</option>
                      <option value="corporativo">Viajes corporativos</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Asunto *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mensaje *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white resize-none"
                    placeholder="Cuéntanos sobre tu viaje ideal, fechas, destinos de interés, número de personas, presupuesto aproximado..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Office Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Información de Contacto</h2>

            <div className="space-y-6 mb-8">
              {officeInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-3">{info.title}</h3>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Síguenos en Redes Sociales</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={`w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 ${social.color} transition-colors duration-200 hover:bg-gray-200`}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Mantente al día con nuestras ofertas especiales, destinos destacados y consejos de viaje.
              </p>
            </div>

            {/* Map placeholder */}
            <div className="mt-6 bg-gray-200 rounded-2xl h-64 flex items-center justify-center border border-gray-300">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p className="font-semibold">Mapa de Ubicación</p>
                <p className="text-sm">Carrera 15 #93-47, Bogotá</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
