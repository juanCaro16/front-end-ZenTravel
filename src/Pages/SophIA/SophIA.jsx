import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles } from "lucide-react"
import api from "../../Services/AxiosInstance/AxiosInstance"

export const SophIA = () => {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "¡Hola! Soy ZenIA, tu asistente virtual de viajes. ¿En qué puedo ayudarte hoy? 🌎✈️",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      // Obtener el id del usuario justo antes de enviar la petición
      const response = await api.post("IA/ZenIA", {
        ZenIA: inputValue
      });

      console.log(inputValue);
      

      const contenidoRespuesta =
          typeof response.data.datos === "string"
            ? response.data.datos
            : JSON.stringify(response.data.datos, null, 2);

        const botMessage = {
          type: "bot",
          content: contenidoRespuesta,
          timestamp: new Date(),
        };


      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      console.error("Error al consultar la IA:", err)
      const errorMessage = {
        type: "bot",
        content: "Lo siento, hubo un error al procesar tu consulta. Por favor, intenta nuevamente.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
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
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === "user"
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
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.type === "user"
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
