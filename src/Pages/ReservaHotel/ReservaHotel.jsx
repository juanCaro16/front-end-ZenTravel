"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import api from "../../Services/AxiosInstance/AxiosInstance"
import Swal from "sweetalert2"
import { Calendar, Users, CreditCard, MapPin, Star, Clock, ArrowLeft, Check } from "lucide-react"

export const ReservarHotel = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Obtener datos del hotel desde el state o cargar desde API
  const [hotel, setHotel] = useState(location.state?.hotel || null)
  const [loading, setLoading] = useState(!hotel)
  const [procesando, setProcesando] = useState(false)

  const [reservaData, setReservaData] = useState({
    fechaEntrada: "",
    fechaSalida: "",
    numeroHuespedes: 1,
    tipoHabitacion: "individual",
    observaciones: "",
    metodoPago: "tarjeta",
    cedula: "",
  })

  // Precios por tipo de habitación
  const precios = {
    individual: 150000,
    doble: 250000,
    suite: 400000,
    familiar: 350000,
  }

  // Si no tenemos datos del hotel, los obtenemos
  useEffect(() => {
    if (!hotel && id) {
      obtenerHotel()
    }
  }, [id, hotel])

  const obtenerHotel = async () => {
    try {
      const response = await api.get(`/packages/Hotel`)
      const hoteles = response.data.hoteles || []
      const hotelEncontrado = hoteles.find((h) => h.id_hotel === Number.parseInt(id))

      if (hotelEncontrado) {
        setHotel(hotelEncontrado)
      } else {
        Swal.fire("Error", "Hotel no encontrado", "error")
        navigate("/hoteles")
      }
    } catch (error) {
      console.error("Error al obtener hotel:", error)
      Swal.fire("Error", "No se pudo cargar la información del hotel", "error")
      navigate("/hoteles")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setReservaData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const calcularNoches = () => {
    if (reservaData.fechaEntrada && reservaData.fechaSalida) {
      const entrada = new Date(reservaData.fechaEntrada)
      const salida = new Date(reservaData.fechaSalida)
      const diferencia = salida.getTime() - entrada.getTime()
      const noches = Math.ceil(diferencia / (1000 * 3600 * 24))
      return noches > 0 ? noches : 0
    }
    return 0
  }

  const calcularPrecioTotal = () => {
    const noches = calcularNoches()
    const precioPorNoche = precios[reservaData.tipoHabitacion]
    const multiplicador = reservaData.numeroHuespedes > 2 ? 1.2 : 1
    return Math.round(noches * precioPorNoche * multiplicador)
  }

  const validarFormulario = () => {
    const { fechaEntrada, fechaSalida, numeroHuespedes, cedula } = reservaData

    if (!cedula || cedula.trim() === "") {
      Swal.fire("Error", "Por favor ingresa tu número de cédula", "error")
      return false
    }

    if (cedula.length < 6 || cedula.length > 12) {
      Swal.fire("Error", "La cédula debe tener entre 6 y 12 dígitos", "error")
      return false
    }

    if (!/^\d+$/.test(cedula)) {
      Swal.fire("Error", "La cédula solo debe contener números", "error")
      return false
    }

    if (!fechaEntrada || !fechaSalida) {
      Swal.fire("Error", "Por favor selecciona las fechas de entrada y salida", "error")
      return false
    }

    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const entrada = new Date(fechaEntrada)
    const salida = new Date(fechaSalida)

    if (entrada < hoy) {
      Swal.fire("Error", "La fecha de entrada no puede ser anterior a hoy", "error")
      return false
    }

    if (salida <= entrada) {
      Swal.fire("Error", "La fecha de salida debe ser posterior a la fecha de entrada", "error")
      return false
    }

    if (numeroHuespedes < 1 || numeroHuespedes > 10) {
      Swal.fire("Error", "El número de huéspedes debe estar entre 1 y 10", "error")
      return false
    }

    return true
  }

  const guardarReservaEnLocalStorage = (reservaCompleta, idReserva) => {
    try {
      // Obtener reservas existentes
      const reservasExistentes = JSON.parse(localStorage.getItem("reservasHoteles") || "[]")

      // Crear nueva reserva con información completa
      const nuevaReserva = {
        id_reserva: idReserva,
        id_hotel: hotel.id_hotel,
        nombreHotel: hotel.nombre,
        ubicacionHotel: hotel.ubicacion,
        estrellasHotel: hotel.estrellas,
        imagenHotel: hotel.imagenes,
        fechaReserva: new Date().toISOString(),
        fechaEntrada: reservaCompleta.fechaEntrada,
        fechaSalida: reservaCompleta.fechaSalida,
        numeroHuespedes: reservaCompleta.numeroHuespedes,
        tipoHabitacion: reservaCompleta.tipoHabitacion,
        metodoPago: reservaCompleta.metodoPago,
        observaciones: reservaCompleta.observaciones,
        noches: reservaCompleta.noches,
        precioTotal: reservaCompleta.precioTotal,
        estado: "confirmado",
        tipo: "hotel",
        cedula: reservaCompleta.cedula,
      }

      // Agregar nueva reserva
      reservasExistentes.push(nuevaReserva)

      // Guardar en localStorage
      localStorage.setItem("reservasHoteles", JSON.stringify(reservasExistentes))

      console.log("Reserva guardada en localStorage:", nuevaReserva)
    } catch (error) {
      console.error("Error al guardar reserva en localStorage:", error)
    }
  }

  const handleReservar = async (e) => {
    e.preventDefault()

    if (!validarFormulario()) return

    setProcesando(true)

    try {
      const reservaCompleta = {
        cedula: reservaData.cedula, // Usar la cédula del formulario
        id_paquete: hotel.id_hotel, // Using hotel ID as package ID for now
        fechaEntrada: reservaData.fechaEntrada,
        fechaSalida: reservaData.fechaSalida,
        numeroHuespedes: reservaData.numeroHuespedes,
        tipoHabitacion: reservaData.tipoHabitacion,
        metodoPago: reservaData.metodoPago,
        observaciones: reservaData.observaciones,
        noches: calcularNoches(),
        precioTotal: calcularPrecioTotal(),
      }

      console.log("Enviando reserva:", reservaCompleta)

      // Make actual API call to backend
      const response = await api.post("/Reservations", {
        cedula: reservaCompleta.cedula,
        id_paquete: reservaCompleta.id_paquete,
      })

      console.log("Respuesta del servidor:", response.data)

      // Also save additional hotel reservation details to localStorage for UI purposes
      const reservaDetallada = {
        id_reserva: `HTL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        id_hotel: hotel.id_hotel,
        nombreHotel: hotel.nombre,
        ubicacionHotel: hotel.ubicacion,
        estrellasHotel: hotel.estrellas,
        imagenHotel: hotel.imagenes,
        fechaReserva: new Date().toISOString(),
        fechaEntrada: reservaCompleta.fechaEntrada,
        fechaSalida: reservaCompleta.fechaSalida,
        numeroHuespedes: reservaCompleta.numeroHuespedes,
        tipoHabitacion: reservaCompleta.tipoHabitacion,
        metodoPago: reservaCompleta.metodoPago,
        observaciones: reservaCompleta.observaciones,
        noches: reservaCompleta.noches,
        precioTotal: reservaCompleta.precioTotal,
        estado: "confirmado",
        tipo: "hotel",
        cedula: reservaCompleta.cedula,
      }

      // Save to localStorage for UI display
      guardarReservaEnLocalStorage(reservaCompleta, reservaDetallada.id_reserva)

      await Swal.fire({
        title: "¡Reserva Exitosa!",
        html: `
        <div class="text-center">
          <div class="text-6xl mb-4">🎉</div>
          <p class="text-lg mb-2">Tu reserva en <strong>${hotel.nombre}</strong> ha sido confirmada.</p>
          <p class="text-sm text-gray-600 mb-2">Cédula: <strong>${reservaCompleta.cedula}</strong></p>
          <p class="text-sm text-gray-600 mb-4">La reserva ha sido registrada en el sistema.</p>
          <p class="text-blue-600">Puedes ver tu reserva en "Mis Viajes".</p>
        </div>
      `,
        icon: "success",
        timer: 5000,
        showConfirmButton: true,
        confirmButtonText: "Ver Mis Viajes",
        showCancelButton: true,
        cancelButtonText: "Ver Paquetes",
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#10b981",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/mis-viajes")
        } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
          navigate("/paquetes")
        }
      })
    } catch (error) {
      console.error("Error al crear reserva:", error)

      let errorMessage = "No se pudo procesar la reserva"
      if (error.response?.data?.errorInfo) {
        errorMessage = error.response.data.errorInfo
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.status === 401) {
        errorMessage = "No tienes autorización para realizar esta acción"
      } else if (error.response?.status === 400) {
        errorMessage = "Datos de reserva inválidos"
      }

      Swal.fire("Error", errorMessage, "error")
    } finally {
      setProcesando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base">Cargando información del hotel...</p>
        </div>
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl sm:text-6xl mb-4">🏨</div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Hotel no encontrado</h2>
          <p className="text-slate-600 mb-6 text-sm sm:text-base">
            No se pudo cargar la información del hotel solicitado.
          </p>
          <button
            onClick={() => navigate("/hoteles")}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2 mx-auto text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Hoteles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16 sm:pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/hoteles")}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Hoteles
          </button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Reservar Hotel</h1>
          <p className="text-slate-600 text-sm sm:text-base">Completa tu reserva en {hotel.nombre}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Información del Hotel */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden order-2 lg:order-1">
            {/* Imagen del hotel */}
            <div className="h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
              {(() => {
                let imagenUrl = null
                if (hotel.imagenes) {
                  try {
                    const arr = typeof hotel.imagenes === "string" ? JSON.parse(hotel.imagenes) : hotel.imagenes
                    if (Array.isArray(arr) && arr.length > 0) imagenUrl = arr[0]
                  } catch (e) {}
                }
                return imagenUrl ? (
                  <img
                    src={imagenUrl || "/placeholder.svg"}
                    alt={hotel.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <svg
                        className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <p className="text-sm">Sin imagen disponible</p>
                    </div>
                  </div>
                )
              })()}
            </div>

            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-500" />
                {hotel.nombre}
              </h2>

              {/* Información básica */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-slate-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">{hotel.ubicacion}</span>
                </div>

                <div className="flex items-center text-slate-600">
                  <Star className="w-4 h-4 mr-2 text-amber-500" />
                  <span className="text-sm sm:text-base">{Number(hotel.estrellas || 0).toFixed(1)} estrellas</span>
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">Descripción</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {hotel.descripcion ||
                    "Hotel con excelentes servicios y ubicación privilegiada. Perfecto para una estadía cómoda y memorable."}
                </p>
              </div>

              {/* Precios por tipo de habitación */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-3 sm:p-4 border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center text-sm sm:text-base">
                  <CreditCard className="w-4 h-4 mr-2 text-emerald-500" />
                  Precios por noche
                </h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Individual:</span>
                    <span className="font-semibold text-slate-800">${precios.individual.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Doble:</span>
                    <span className="font-semibold text-slate-800">${precios.doble.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Suite:</span>
                    <span className="font-semibold text-slate-800">${precios.suite.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Familiar:</span>
                    <span className="font-semibold text-slate-800">${precios.familiar.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-3">* Precios pueden variar según temporada y disponibilidad</p>
              </div>
            </div>
          </div>

          {/* Formulario de Reserva */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 order-1 lg:order-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-emerald-500" />
              Detalles de la Reserva
            </h2>

            <form onSubmit={handleReservar} className="space-y-4 sm:space-y-6">
              {/* Cédula del Usuario - Movido al principio */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  Cédula de Ciudadanía *
                </label>
                <input
                  type="text"
                  name="cedula"
                  value={reservaData.cedula}
                  onChange={handleInputChange}
                  className="w-full p-2 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Ingresa tu número de cédula"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Solo números, entre 6 y 12 dígitos</p>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha de Entrada *</label>
                  <input
                    type="date"
                    name="fechaEntrada"
                    value={reservaData.fechaEntrada}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-2 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Fecha de Salida *</label>
                  <input
                    type="date"
                    name="fechaSalida"
                    value={reservaData.fechaSalida}
                    onChange={handleInputChange}
                    min={reservaData.fechaEntrada || new Date().toISOString().split("T")[0]}
                    className="w-full p-2 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Huéspedes y Tipo de Habitación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Número de Huéspedes
                  </label>
                  <select
                    name="numeroHuespedes"
                    value={reservaData.numeroHuespedes}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "huésped" : "huéspedes"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Habitación</label>
                  <select
                    name="tipoHabitacion"
                    value={reservaData.tipoHabitacion}
                    onChange={handleInputChange}
                    className="w-full p-2 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    required
                  >
                    <option value="individual">Individual - ${precios.individual.toLocaleString()}/noche</option>
                    <option value="doble">Doble - ${precios.doble.toLocaleString()}/noche</option>
                    <option value="suite">Suite - ${precios.suite.toLocaleString()}/noche</option>
                    <option value="familiar">Familiar - ${precios.familiar.toLocaleString()}/noche</option>
                  </select>
                </div>
              </div>

              {/* Método de Pago */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  Método de Pago
                </label>
                <select
                  name="metodoPago"
                  value={reservaData.metodoPago}
                  onChange={handleInputChange}
                  className="w-full p-2 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  required
                >
                  <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="efectivo">Efectivo (en el hotel)</option>
                </select>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Observaciones (Opcional)</label>
                <textarea
                  name="observaciones"
                  value={reservaData.observaciones}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-2 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-200 text-sm sm:text-base"
                  placeholder="Solicitudes especiales, preferencias de habitación, etc."
                />
              </div>

              {/* Resumen de la Reserva */}
              {reservaData.fechaEntrada && reservaData.fechaSalida && calcularNoches() > 0 && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4 sm:p-6">
                  <h3 className="font-semibold text-emerald-900 mb-4 flex items-center text-sm sm:text-base">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Resumen de la Reserva
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {reservaData.cedula && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700 text-sm">Cédula:</span>
                        <span className="font-semibold text-slate-900 text-sm">{reservaData.cedula}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 text-sm">Noches:</span>
                      <span className="font-semibold text-slate-900 text-sm">{calcularNoches()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 text-sm">Tipo de habitación:</span>
                      <span className="font-semibold text-slate-900 capitalize text-sm">
                        {reservaData.tipoHabitacion}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 text-sm">Precio por noche:</span>
                      <span className="font-semibold text-slate-900 text-sm">
                        ${precios[reservaData.tipoHabitacion].toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 text-sm">Huéspedes:</span>
                      <span className="font-semibold text-slate-900 text-sm">{reservaData.numeroHuespedes}</span>
                    </div>
                    {reservaData.numeroHuespedes > 2 && (
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-slate-600">Recargo por huéspedes adicionales:</span>
                        <span className="font-semibold text-slate-700">+20%</span>
                      </div>
                    )}
                    <div className="border-t border-emerald-300 pt-2 sm:pt-3 mt-2 sm:mt-3">
                      <div className="flex justify-between items-center text-base sm:text-lg">
                        <span className="font-bold text-slate-900">Total:</span>
                        <span className="font-bold text-emerald-700 text-lg sm:text-xl">
                          ${calcularPrecioTotal().toLocaleString()} COP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/hoteles")}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-slate-400 hover:bg-slate-500 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={procesando || calcularNoches() <= 0 || !reservaData.cedula}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {procesando ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      <span className="hidden sm:inline">Confirmar Reserva - </span>
                      <span>${calcularPrecioTotal().toLocaleString()}</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
