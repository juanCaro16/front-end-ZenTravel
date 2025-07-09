"use client"

import { useState } from "react"
import api from "../../Services/AxiosInstance/AxiosInstance"
import Swal from "sweetalert2"
import {
  Package,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Hotel,
  Plane,
  Clock,
  Percent,
  Save,
  ArrowLeft,
  Star,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export const CrearPaquetes = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    nombrePaquete: "",
    descripcion: "",
    duracionDias: "",
    fechaInicioDisponible: "",
    descuento: "",
    Habitacion: "",
    nombreTransporte: "",
    nombreDestino: "",
    categoria: "",
    incluye: [],
    noIncluye: [],
    cantidad: "",
  })

  const [opcionesTransporte, setOpcionesTransporte] = useState([])
  const [opcionesHabitacion, setOpcionesHabitacion] = useState([])
  const [transporte, setTransporte] = useState({ origen: "", destino: "" })
  const [filtroHabitacion, setFiltroHabitacion] = useState({ nombreHotel: "" })
  const [imagen, setImagen] = useState(null)
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // Estado para controlar el tamaño del select de transporte
  const [transporteSelectSize, setTransporteSelectSize] = useState(1);

  const handleFileChange = (e) => {
    setImagen(e.target.files[0])
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    })
  }

  const handleArrayChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((item) => item !== value) : [...prev[field], value],
    }))
  }

  const handleSubmit = async () => {
    try {
      setMensaje("")
      setError("")
      setIsLoading(true)
      const formToSend = new FormData()

      if (!imagen || !(imagen instanceof File)) {
        setError("⚠️ La imagen no es válida o no fue seleccionada.")
        setIsLoading(false)
        return
      }

      formToSend.append("imagen", imagen)
      formToSend.append("nombrePaquete", formData.nombrePaquete)
      formToSend.append("descripcion", formData.descripcion)
      formToSend.append("duracionDias", formData.duracionDias.toString())
      formToSend.append("fechaInicioDisponible", formData.fechaInicioDisponible)
      formToSend.append("descuento", formData.descuento.toString())
      // ✅ CORREGIDO: Number en lugar de number
      formToSend.append("Habitacion", Number(formData.Habitacion).toString())
      formToSend.append("nombreTransporte", formData.nombreTransporte)
      formToSend.append("nombreDestino", formData.nombreDestino)
      formToSend.append("categoria", formData.categoria)
      formToSend.append("incluye", JSON.stringify(formData.incluye))
      formToSend.append("noIncluye", JSON.stringify(formData.noIncluye))
      formToSend.append("cantidad", (formData.cantidad ?? "1").toString())

      for (const pair of formToSend.entries()) {
        console.log(`${pair[0]}:`, pair[1])
      }
      

      const response = await api.post("packages/Create/Package", formToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("✅ Éxito:", response.data)
      await Swal.fire({
        title: "¡Éxito!",
        text: "Paquete creado correctamente",
        icon: "success",
        confirmButtonColor: "#10b981",
      })
      navigate("/paquetes")
    } catch (err) {
      console.error("❌ Error completo:", err)
      console.error("❌ Response data:", err.response?.data)
      console.error("❌ Response status:", err.response?.status)
      let errMsg = "Hubo un error al crear el paquete"
      if (err.response?.status === 400) {
        errMsg = "Datos inválidos. Verifica que todos los campos estén correctos."
      } else if (err.response?.status === 401) {
        errMsg = "No autorizado. Por favor inicia sesión nuevamente."
      } else if (err.response?.status === 500) {
        errMsg = "Error interno del servidor. Intenta nuevamente."
      } else if (err.response?.data?.message) {
        errMsg = err.response.data.message
      }
      setError(errMsg)
      Swal.fire("Error", errMsg, "error")
    } finally {
      setIsLoading(false)
    }
  }

  const buscarTransportes = async () => {
    if (!transporte.origen || !transporte.destino) {
      alert("Debes ingresar origen y destino.")
      return
    }
    try {
      const res = await api.get(`packages/Transport/${transporte.origen}/${transporte.destino}`)
      setOpcionesTransporte(res.data)
    } catch (error) {
      console.error("❌ Error al buscar transportes:", error)
      alert("Ocurrió un error al buscar transportes.")
    }
  }

  const buscarHabitacion = async () => {
    if (!filtroHabitacion.nombreHotel) {
      Swal.fire("Campo requerido", "Debes ingresar el nombre del hotel.", "warning")
      return
    }
    try {
      console.log("🔍 Buscando habitaciones para:", filtroHabitacion.nombreHotel)
      const resultado = await api.get(`packages/RoomReservation/${filtroHabitacion.nombreHotel}`)
      console.log("✅ Habitaciones encontradas:", resultado.data)
      setOpcionesHabitacion(resultado.data.result || [])
      if ((resultado.data.result || []).length === 0) {
        Swal.fire("Sin resultados", "No hay habitaciones disponibles para este hotel.", "info")
      }
    } catch (error) {
      console.error("❌ Error al buscar habitaciones:", error)
      Swal.fire("Error", error.response?.data?.message || "Ocurrió un error al buscar habitaciones.", "error")
    }
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.nombrePaquete && formData.descripcion && formData.categoria
      case 2:
        return formData.nombreDestino && formData.Habitacion && formData.nombreTransporte
      case 3:
        return true
      case 4:
        return formData.duracionDias && formData.fechaInicioDisponible && formData.cantidad
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Package className="w-4 h-4 inline mr-2" />
                Nombre del paquete *
              </label>
              <input
                name="nombrePaquete"
                value={formData.nombrePaquete}
                onChange={handleChange}
                placeholder="Ej: Aventura en la Costa Caribeña"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Describe la experiencia única que ofrece este paquete..."
                rows="4"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Star className="w-4 h-4 inline mr-2" />
                Categoría *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categorias.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, categoria: cat.value })}
                    className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                      formData.categoria === cat.value
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-300 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <div className="font-medium">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subir imagen *:</label>
              <input
                type="file"
                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                accept="image/*"
                name="imagen"
                onChange={handleFileChange}
                required
              />
            </div>
            {imagen && (
              <img
                src={URL.createObjectURL(imagen) || "/placeholder.svg"}
                alt="Vista previa"
                className="mt-2 rounded-md w-32 h-32 object-cover"
              />
            )}
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Destino *
              </label>
              <input
                name="nombreDestino"
                value={formData.nombreDestino}
                onChange={(e) => {
                  handleChange(e)
                  setTransporte((prev) => ({ ...prev, destino: e.target.value }))
                }}
                placeholder="Ej: Cartagena de Indias"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
              />
            </div>

            {/* ✅ SECCIÓN DE HABITACIONES CORREGIDA */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Hotel className="w-5 h-5 mr-2" />
                Buscar Habitación
              </h3>
              <div className="space-y-4">
                <input
                  name="nombreHotel"
                  value={filtroHabitacion.nombreHotel}
                  onChange={(e) => setFiltroHabitacion((prev) => ({ ...prev, nombreHotel: e.target.value }))}
                  placeholder="Ej: Hotel Boutique Casa San Agustín"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={buscarHabitacion}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-md transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  Buscar habitación
                </button>

                {opcionesHabitacion.length > 0 && (
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Habitaciones disponibles *</label>
                    <select
                      name="Habitacion"
                      value={formData.Habitacion}
                      onChange={(e) => setFormData({ ...formData, Habitacion: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white text-sm text-gray-700"
                    >
                      <option value="">Selecciona una habitación</option>
                      {opcionesHabitacion.map((item) => (
                        <option key={item.id_habitacion} value={item.id_habitacion}>
                          {`#${item.numero} - ${item.tipo}, Precio: $${item.precio}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* ✅ SECCIÓN DE TRANSPORTES CORREGIDA */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Plane className="w-5 h-5 mr-2" />
                Buscar Transporte
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={transporte.origen}
                  onChange={(e) => setTransporte((prev) => ({ ...prev, origen: e.target.value }))}
                  placeholder="Ciudad de origen"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={buscarTransportes}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl shadow-md transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Buscar Transportes
                </button>

                {opcionesTransporte.length > 0 && (
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Transporte disponible *</label>
                    <select
                      name="nombreTransporte"
                      value={formData.nombreTransporte}
                      onChange={(e) => setFormData({ ...formData, nombreTransporte: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white text-sm text-gray-700"
                    >
                      <option value="">Selecciona un transporte</option>
                      {opcionesTransporte.map((item) => (
                        <option key={item.id_transporte} value={item.id_transporte}>
                          {`🚌 Transporte a ${item.destino} desde ${item.origen}, empresa: ${item.empresa}, tipo: ${item.tipo}, pasajes: ${item.capacidad}, salida: ${new Date(item.fecha_salida).toLocaleDateString()}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                <Star className="w-4 h-4 inline mr-2" />
                ¿Qué incluye el paquete?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {incluyeOpciones.map((opcion) => (
                  <label
                    key={opcion}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      formData.incluye.includes(opcion)
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-300 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.incluye.includes(opcion)}
                      onChange={() => handleArrayChange("incluye", opcion)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                        formData.incluye.includes(opcion) ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                      }`}
                    >
                      {formData.incluye.includes(opcion) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium">{opcion}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Servicios adicionales no incluidos
              </label>
              <textarea
                name="noIncluye"
                value={formData.noIncluye.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    noIncluye: e.target.value.split(",").map((item) => item.trim()),
                  })
                }
                placeholder="Ej: Bebidas alcohólicas, propinas, gastos personales..."
                rows="3"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">Separa cada elemento con una coma</p>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Duración (días) *
                </label>
                <input
                  type="number"
                  name="duracionDias"
                  value={formData.duracionDias}
                  onChange={handleChange}
                  placeholder="5"
                  min="1"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-2" />
                  Pasajes (cantidad) *
                </label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  placeholder="2"
                  min="1"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Percent className="w-4 h-4 inline mr-2" />
                  Descuento (%)
                </label>
                <input
                  type="number"
                  name="descuento"
                  value={formData.descuento}
                  onChange={handleChange}
                  placeholder="15"
                  min="0"
                  max="100"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Fecha de inicio disponible *
                </label>
                <input
                  type="date"
                  name="fechaInicioDisponible"
                  value={formData.fechaInicioDisponible}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <h3 className="font-semibold text-emerald-900 mb-3">¡Casi listo!</h3>
              <p className="text-emerald-800">
                Una vez creado el paquete, podrás editarlo y agregar más detalles como servicios adicionales y
                promociones especiales.
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const categorias = [
    { value: "aventura", label: "Aventura", icon: "🏔️" },
    { value: "playa", label: "Playa", icon: "🏖️" },
    { value: "cultural", label: "Cultural", icon: "🏛️" },
    { value: "naturaleza", label: "Naturaleza", icon: "🌿" },
    { value: "urbano", label: "Urbano", icon: "🏙️" },
    { value: "gastronomico", label: "Gastronómico", icon: "🍽️" },
  ]

  const incluyeOpciones = [
    "Alojamiento",
    "Desayuno",
    "Almuerzo",
    "Cena",
    "Transporte local",
    "Guía turístico",
    "Entradas a sitios",
    "Seguro de viaje",
    "Actividades programadas",
  ]

  const steps = [
    { number: 1, title: "Información Básica", icon: <Package className="w-5 h-5" /> },
    { number: 2, title: "Detalles del Viaje", icon: <MapPin className="w-5 h-5" /> },
    { number: 3, title: "Servicios Incluidos", icon: <Star className="w-5 h-5" /> },
    { number: 4, title: "Precios y Fechas", icon: <DollarSign className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/paquetes")}
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a paquetes
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Crear Nuevo
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {" "}
              Paquete
            </span>
          </h1>
          <p className="text-xl text-gray-600">Diseña una experiencia única para tus clientes</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                    currentStep >= step.number
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {step.icon}
                </div>
                <div className="ml-3 hidden md:block">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.number ? "text-emerald-600" : "text-gray-400"
                    }`}
                  >
                    Paso {step.number}
                  </p>
                  <p className={`text-sm ${currentStep >= step.number ? "text-gray-900" : "text-gray-400"}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden md:block w-16 h-1 mx-4 rounded ${
                      currentStep > step.number ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{steps[currentStep - 1].title}</h2>
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>
          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center space-x-2"
            >
              <span>Siguiente</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid() || isLoading}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{isLoading ? "Creando..." : "Crear Paquete"}</span>
            </button>
          )}
        </div>

        {/* Messages */}
        {mensaje && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-600 font-medium">{mensaje}</p>
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
