import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles } from "lucide-react"
import api from "../../Services/AxiosInstance/AxiosInstance"
import { Paquetes } from "../Paquetes/Paquetes" // Importar el componente de cards

export const SophIA = () => {
  const [inputValue, setInputValue] = useState("")
  // Inicializar messages desde localStorage si existe
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("sophia_messages");
    if (saved) {
      try {
        // Restaurar fechas
        return JSON.parse(saved).map(m => ({ ...m, timestamp: new Date(m.timestamp) }))
      } catch {
        return [
          {
            type: "bot",
            content: "¡Hola! Soy ZenIA, tu asistente virtual de viajes. ¿En qué puedo ayudarte hoy? 🌎✈️",
            timestamp: new Date(),
          },
        ]
      }
    }
    return [
      {
        type: "bot",
        content: "¡Hola! Soy ZenIA, tu asistente virtual de viajes. ¿En qué puedo ayudarte hoy? 🌎✈️",
        timestamp: new Date(),
      },
    ]
  })
  const [isLoading, setIsLoading] = useState(false)
  const [paquetesIA, setPaquetesIA] = useState([])
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    // Guardar mensajes y paquetesIA en localStorage cada vez que cambian
    localStorage.setItem("sophia_messages", JSON.stringify(messages))
    localStorage.setItem("sophia_paquetesIA", JSON.stringify(paquetesIA))
  }, [messages, paquetesIA])

  // Al cargar, restaurar paquetesIA si existe
  useEffect(() => {
    const savedPaquetes = localStorage.getItem("sophia_paquetesIA")
    if (savedPaquetes) {
      try {
        setPaquetesIA(JSON.parse(savedPaquetes))
      } catch { }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const userId = localStorage.getItem("id_usuario")
      const response = await api.post("IA/ZenIA", {
        ZenIA: inputValue,
        id_usuario: userId,
      })

      const respuesta = response.data.datos || response.data.respuesta || "No se obtuvo respuesta de la IA."
      let paquetesExtraidos = []

      try {
        const match = respuesta.match(/\[.*\]/s)
        if (match) {
          paquetesExtraidos = JSON.parse(match[0])
        } else {
          paquetesExtraidos = parsePaquetesFromTexto(respuesta)
        }
      } catch {
        paquetesExtraidos = parsePaquetesFromTexto(respuesta)
      }

      setPaquetesIA(paquetesExtraidos)

      if (paquetesExtraidos.length > 0) {
        // Mostrar solo una línea introductoria si hay paquetes
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            content: "✨ Aquí tienes algunos paquetes recomendados:",
            timestamp: new Date(),
          },
        ])
        setIsLoading(false)
      } else {
        // Mostrar respuesta completa animada si no hay paquetes
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: "", timestamp: new Date() }, // placeholder para animación
        ])
        setIsLoading(false)
        let currentText = ""
        for (let i = 0; i < respuesta.length; i++) {
          currentText += respuesta[i]
          await new Promise((resolve) => setTimeout(resolve, 18))
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { type: "bot", content: currentText, timestamp: new Date() },
          ])
        }
      }

    } catch (err) {
      console.error("Error al consultar la IA:", err)
      setPaquetesIA([])
      let errorMsg = "Lo siento, hubo un error al procesar tu consulta. Por favor, intenta nuevamente."
      if (err?.response?.status === 403) {
        errorMsg = "No tienes permisos para realizar esta acción. Por favor, inicia sesión nuevamente o verifica tus credenciales."
      } else if (err?.response?.status === 401) {
        errorMsg = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
      }
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: errorMsg,
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const suggestedQuestions = [
    "¿Cuáles son los mejores destinos en Colombia?",
    "¿Qué paquetes familiares recomiendan?",
    "¿Cuál es la mejor época para viajar?",
    "¿Ofrecen tours de aventura?",
  ]

  // Agrega la función parsePaquetesFromTexto si no existe
  const parsePaquetesFromTexto = (texto) => {
    // Busca bloques que empiecen con "Paquete:" y terminen antes del siguiente "Paquete:" o el final
    const bloques = texto.split(/\n\s*\u{1F4E6}|\n\s*\* Paquete:/u).filter(b => b.trim().length > 0)
    return bloques.map(bloque => {
      const get = (regex) => {
        const m = bloque.match(regex)
        return m ? m[1].trim() : undefined
      }
      return {
        nombrePaquete: get(/Paquete:\s*([^\n]+)/) || get(/paquete:\s*([^\n]+)/i),
        destino: get(/Destino:\s*([^\n]+)/i),
        hotel: get(/Hotel:\s*([^\n]+)/i),
        duracion: get(/Duraci[oó]n:\s*([^\n]+)/i),
        fechaSalida: get(/Fecha de salida:\s*([^\n]+)/i),
        precio: get(/Precio:\s*([^\n]+)/i),
        calificacion: get(/Calificaci[oó]n:\s*([^\n]+)/i),
        estado: get(/Estado:\s*([^\n]+)/i),
        descripcion: undefined
      }
    }).filter(p => p.nombrePaquete)
  }

  return (
    <div className="min-h-screen w-full py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-4 shadow-lg">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Conoce a
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> ZenIA</span>
            <Sparkles className="inline-block w-8 h-8 text-yellow-400 ml-2" />
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu asistente virtual especializada en viajes. Pregúntame sobre destinos, paquetes turísticos,
            recomendaciones y todo lo que necesites para tu próxima aventura.
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === "user"
                      ? "bg-gradient-to-br from-blue-500 to-purple-500"
                      : "bg-gradient-to-br from-emerald-500 to-teal-500"
                      }`}
                  >
                    {message.type === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${message.type === "user"
                      ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                      }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {typeof message.content === "string"
                        ? message.content
                        : JSON.stringify(message.content)}
                    </p>
                    <p className={`text-xs mt-2 ${message.type === "user" ? "text-blue-100" : "text-gray-500"}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Carrusel de paquetes IA si existen */}
            {paquetesIA.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-2 text-emerald-700">Paquetes recomendados por ZenIA:</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {paquetesIA.map((paquete, idx) => (
                    <div key={idx} className="min-w-[300px] max-w-xs bg-white rounded-2xl shadow p-4 border border-emerald-100 flex-shrink-0">
                      <h4 className="text-xl font-semibold mb-1">{paquete.nombrePaquete || paquete.paquete || "Paquete"}</h4>
                      <p className="text-gray-600 text-sm mb-2">{paquete.descripcion || ""}</p>
                      <ul className="text-sm space-y-1 mb-2">
                        {paquete.destino && <li><strong>Destino:</strong> {paquete.destino}</li>}
                        {paquete.hotel && <li><strong>Hotel:</strong> {paquete.hotel}</li>}
                        {paquete.duracion && <li><strong>Duración:</strong> {paquete.duracion}</li>}
                        {paquete.fechaSalida && <li><strong>Salida:</strong> {paquete.fechaSalida}</li>}
                        {paquete.precio && <li><strong>Precio:</strong> {paquete.precio}</li>}
                        {paquete.calificacion && <li><strong>Calificación:</strong> {paquete.calificacion}</li>}
                        {paquete.estado && <li><strong>Estado:</strong> {paquete.estado}</li>}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Preguntas sugeridas:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(question)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-all duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Escribe tu consulta sobre viajes..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 disabled:transform-none shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
