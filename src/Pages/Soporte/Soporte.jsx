import { useState } from "react"
import {
  Search,
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Send,
  AlertCircle,
  Info,
} from "lucide-react"

export const Soporte = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    priority: "normal",
  })

  const faqData = [
    {
      id: 1,
      question: "¿Cómo puedo reservar un paquete turístico?",
      answer:
        "Puedes reservar directamente desde nuestra página web seleccionando el paquete de tu preferencia, o contactando a nuestros asesores al 601 743 6620. También puedes usar nuestro asistente virtual SophIA para obtener recomendaciones personalizadas.",
    },
    {
      id: 2,
      question: "¿Qué incluyen los paquetes turísticos?",
      answer:
        "Nuestros paquetes incluyen alojamiento, transporte, algunas comidas según el plan seleccionado, guías turísticos especializados y actividades programadas. Los detalles específicos varían según el destino y tipo de paquete.",
    },
    {
      id: 3,
      question: "¿Puedo cancelar o modificar mi reserva?",
      answer:
        "Sí, puedes cancelar o modificar tu reserva hasta 48 horas antes del viaje sin costo adicional. Para cancelaciones con menos tiempo, se aplicarán las políticas de cancelación según el tipo de servicio contratado.",
    },
    {
      id: 4,
      question: "¿Qué documentos necesito para viajar?",
      answer:
        "Para viajes nacionales necesitas tu cédula de ciudadanía vigente. Para destinos internacionales, requieres pasaporte vigente y en algunos casos visa. Te asesoramos sobre los requisitos específicos según tu destino.",
    },
    {
      id: 5,
      question: "¿Ofrecen seguro de viaje?",
      answer:
        "Sí, todos nuestros paquetes incluyen seguro básico de viaje. También ofrecemos seguros premium con cobertura ampliada para actividades de aventura y asistencia médica internacional.",
    },
    {
      id: 6,
      question: "¿Cómo funciona el asistente virtual SophIA?",
      answer:
        "SophIA es nuestra inteligencia artificial especializada en turismo. Puede ayudarte a encontrar destinos, comparar paquetes, obtener recomendaciones personalizadas y resolver dudas básicas las 24 horas del día.",
    },
  ]

  const supportOptions = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Llamada Directa",
      description: "Habla con nuestros expertos",
      contact: "601 743 6620",
      action: "Llamar ahora",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Chat en Vivo",
      description: "Respuesta inmediata online",
      contact: "Disponible 24/7",
      action: "Iniciar chat",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      description: "Envíanos tu consulta detallada",
      contact: "soporte@zentravel.com",
      action: "Enviar email",
      color: "from-purple-500 to-purple-600",
    },
  ]

  const filteredFaq = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el formulario
    console.log("Formulario enviado:", formData)
    alert("¡Mensaje enviado! Te contactaremos pronto.")
  }

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-6 shadow-lg">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Centro de
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {" "}
              Soporte
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Estamos aquí para ayudarte. Encuentra respuestas rápidas o contacta directamente con nuestro equipo de
            expertos.
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Busca en nuestras preguntas frecuentes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-lg shadow-lg"
            />
          </div>
        </div>

        {/* Opciones de contacto rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {supportOptions.map((option, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
            >
              <div className={`h-2 bg-gradient-to-r ${option.color}`}></div>
              <div className="p-6">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${option.color} rounded-xl mb-4`}
                >
                  <div className="text-white">{option.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-3">{option.description}</p>
                <p className="text-sm font-semibold text-gray-800 mb-4">{option.contact}</p>
                <button
                  className={`w-full py-2 px-4 bg-gradient-to-r ${option.color} text-white rounded-lg hover:opacity-90 transition-opacity duration-200 font-medium`}
                >
                  {option.action}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <Info className="w-8 h-8 text-emerald-600 mr-3" />
              Preguntas Frecuentes
            </h2>

            <div className="space-y-4">
              {filteredFaq.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleFaq(item.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                    {expandedFaq === item.id ? (
                      <ChevronUp className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === item.id && (
                    <div className="px-6 pb-4 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed pt-4">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFaq.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No se encontraron resultados para "{searchQuery}"</p>
                <p className="text-sm text-gray-500 mt-2">
                  Intenta con otros términos o contacta directamente con nosotros
                </p>
              </div>
            )}
          </div>

          {/* Formulario de contacto */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
              <Mail className="w-8 h-8 text-emerald-600 mr-3" />
              Envíanos un Mensaje
            </h2>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono (opcional)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                      placeholder="300 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                    >
                      <option value="low">Baja</option>
                      <option value="normal">Normal</option>
                      <option value="high">Alta</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 resize-none"
                    placeholder="Describe tu consulta o problema en detalle..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Mensaje
                </button>
              </form>
            </div>

            {/* Información adicional */}
            <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-2">Horarios de Atención</h3>
                  <div className="text-sm text-emerald-800 space-y-1">
                    <p>
                      <strong>Lunes a Viernes:</strong> 8:00 AM - 6:00 PM
                    </p>
                    <p>
                      <strong>Sábados:</strong> 9:00 AM - 4:00 PM
                    </p>
                    <p>
                      <strong>Domingos:</strong> 10:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 mt-4 pt-4 border-t border-emerald-200">
                <MapPin className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-2">Oficina Principal</h3>
                  <p className="text-sm text-emerald-800">
                    Carrera 15 #93-47, Oficina 501
                    <br />
                    Bogotá, Colombia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
