"use client"

import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import api from "../../Services/AxiosInstance/AxiosInstance"
import { RoleBasedComponent } from "../../Components/RoleBasedComponent/RoleBasedComponent"
import {
  Heart,
  Eye,
  X,
  Trash2,
  Filter,
  CheckCircle,
  Plus,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Calculator,
  Edit,
  Save,
  XCircle,
} from "lucide-react"

export const Paquetes = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [paquetes, setPaquetes] = useState([])
  const [paquetesFiltrados, setPaquetesFiltrados] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  // Estados para el recálculo de precios
  const [preciosOriginales, setPreciosOriginales] = useState({})

  // Estados para filtros
  const [filtros, setFiltros] = useState({
    hotel: searchParams.get("hotel") || "",
    precioMin: "",
    precioMax: "",
    duracionMin: "",
    duracionMax: "",
    destino: "",
  })

  const [favoritos, setFavoritos] = useState(() => {
    const saved = localStorage.getItem("paquetesFavoritos")
    return saved ? JSON.parse(saved) : []
  })

  // Mensaje de reserva exitosa
  const mensajeReserva = location.state?.mensaje
  const hotelReservado = location.state?.hotelReservado

  useEffect(() => {
    obtenerPaquetes()
    // Mostrar mensaje de reserva exitosa si existe
    if (mensajeReserva) {
      Swal.fire({
        title: "¡Reserva Confirmada!",
        text: mensajeReserva,
        icon: "success",
        timer: 5000,
        showConfirmButton: true,
        confirmButtonText: "Entendido",
      })
    }
  }, [])

  useEffect(() => {
    aplicarFiltros()
  }, [paquetes, filtros])

  const aplicarFiltros = () => {
    let paquetesFiltrados = [...paquetes]

    // Filtro por hotel (si viene de una reserva)
    if (filtros.hotel) {
      paquetesFiltrados = paquetesFiltrados.filter(
        (paquete) => paquete.id_hotel?.toString() === filtros.hotel.toString(),
      )
    }

    // Filtro por precio
    if (filtros.precioMin) {
      paquetesFiltrados = paquetesFiltrados.filter(
        (paquete) => Number(paquete.precioTotal) >= Number(filtros.precioMin),
      )
    }
    if (filtros.precioMax) {
      paquetesFiltrados = paquetesFiltrados.filter(
        (paquete) => Number(paquete.precioTotal) <= Number(filtros.precioMax),
      )
    }

    // Filtro por duración
    if (filtros.duracionMin) {
      paquetesFiltrados = paquetesFiltrados.filter(
        (paquete) => Number(paquete.duracionDias) >= Number(filtros.duracionMin),
      )
    }
    if (filtros.duracionMax) {
      paquetesFiltrados = paquetesFiltrados.filter(
        (paquete) => Number(paquete.duracionDias) <= Number(filtros.duracionMax),
      )
    }

    // Filtro por destino
    if (filtros.destino) {
      paquetesFiltrados = paquetesFiltrados.filter((paquete) =>
        paquete.nombre_destino?.toLowerCase().includes(filtros.destino.toLowerCase()),
      )
    }

    setPaquetesFiltrados(paquetesFiltrados)
  }

  const handleFiltroChange = (e) => {
    const { name, value } = e.target
    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const limpiarFiltros = () => {
    setFiltros({
      hotel: "",
      precioMin: "",
      precioMax: "",
      duracionMin: "",
      duracionMax: "",
      destino: "",
    })
  }

  // Función para calcular precio automáticamente
  const calcularPrecioAutomatico = (paqueteId, nuevaDuracion) => {
    const precioOriginalData = preciosOriginales[paqueteId]
    if (!precioOriginalData) return null

    const { precioOriginal, duracionOriginal } = precioOriginalData

    // Validar que los valores sean válidos
    if (!precioOriginal || !duracionOriginal || duracionOriginal <= 0 || nuevaDuracion <= 0) {
      return null
    }

    // Calcular precio por día basado en los valores originales
    const precioPorDia = precioOriginal / duracionOriginal
    // Calcular nuevo precio total
    const nuevoPrecioTotal = Math.round(precioPorDia * nuevaDuracion)

    return nuevoPrecioTotal
  }

  const handleChange = (index, e) => {
    const { name, value } = e.target
    const nuevosPaquetes = [...paquetes]
    const paqueteIndex = paquetes.findIndex((p) => p.id_paquete === paquetesFiltrados[index].id_paquete)
    const paqueteId = paquetes[paqueteIndex].id_paquete

    // Validar y convertir el valor según el tipo de campo
    let valorProcesado = value
    if (name === "duracionDias" || name === "precioTotal") {
      valorProcesado = value === "" ? "" : Number(value)
      // Asegurar que no sea negativo
      if (valorProcesado < 0) valorProcesado = 0
    }

    // Actualizar el valor
    nuevosPaquetes[paqueteIndex][name] = valorProcesado

    // Si se está cambiando la duración, recalcular el precio automáticamente
    if (name === "duracionDias") {
      const nuevaDuracion = Number(value)
      if (nuevaDuracion > 0) {
        const nuevoPrecio = calcularPrecioAutomatico(paqueteId, nuevaDuracion)
        if (nuevoPrecio !== null) {
          nuevosPaquetes[paqueteIndex]["precioTotal"] = nuevoPrecio
          // Marcar que el precio fue recalculado
          nuevosPaquetes[paqueteIndex]["precioRecalculado"] = true

          console.log(`🔄 Precio recalculado para paquete ${paqueteId}:`, {
            duracionOriginal: preciosOriginales[paqueteId].duracionOriginal,
            precioOriginal: preciosOriginales[paqueteId].precioOriginal,
            nuevaDuracion: nuevaDuracion,
            nuevoPrecio: nuevoPrecio,
          })
        }
      }
    }

    setPaquetes(nuevosPaquetes)
  }

  const handleIniciarEdicion = (paquete) => {
    // Guardar los valores originales para el cálculo
    setPreciosOriginales((prev) => ({
      ...prev,
      [paquete.id_paquete]: {
        precioOriginal: Number(paquete.precioTotal),
        duracionOriginal: Number(paquete.duracionDias),
      },
    }))
    setEditandoId(paquete.id_paquete)

    console.log(`📝 Iniciando edición del paquete ${paquete.id_paquete}:`, {
      precioOriginal: Number(paquete.precioTotal),
      duracionOriginal: Number(paquete.duracionDias),
    })
  }

  const handleCancelarEdicion = () => {
    if (editandoId) {
      // Revertir cambios locales
      obtenerPaquetes()
      // Limpiar los precios originales del paquete que se estaba editando
      setPreciosOriginales((prev) => {
        const newPreciosOriginales = { ...prev }
        delete newPreciosOriginales[editandoId]
        return newPreciosOriginales
      })
    }
    setEditandoId(null)
  }

  const handleGuardar = async (paquete) => {
    try {
      const id = paquete.id_paquete

      // Asegurar que el precio sea el valor recalculado actual
      const precioFinal = Number(paquete.precioTotal)
      const duracionFinal = Number(paquete.duracionDias)

      console.log(`💾 Guardando paquete ${id}:`, {
        duracionDias: duracionFinal,
        precioTotal: precioFinal,
        precioRecalculado: paquete.precioRecalculado,
      })

      // Preparar los datos con el formato exacto que espera el backend
      const datosActualizados = {
        nombrePaquete: String(paquete.nombrePaquete || "").trim(),
        descripcion: String(paquete.descripcion || "").trim(),
        duracionDias: duracionFinal,
        precioTotal: precioFinal, // Enviar el precio recalculado
        nombre_destino: String(paquete.nombre_destino || "").trim(),
        id_hotel: paquete.id_hotel ? Number.parseInt(paquete.id_hotel) : null,
        imagenUrl: paquete.imagenUrl || null,
        estado: paquete.estado || "activo",
        fechaCreacion: paquete.fechaCreacion || null,
        fechaActualizacion: new Date().toISOString(),
        categoria: paquete.categoria || null,
        serviciosIncluidos: paquete.serviciosIncluidos || null,
        restricciones: paquete.restricciones || null,
        politicasCancelacion: paquete.politicasCancelacion || null,
        descuento: paquete.descuento || 0,
        disponibilidad: paquete.disponibilidad !== undefined ? paquete.disponibilidad : true,
        calificacion: paquete.calificacion || null,
      }

      console.log("📤 Enviando datos actualizados:", datosActualizados)

      const response = await api.put(`packages/IDPackage/${id}`, datosActualizados, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      })

      console.log("✅ Respuesta del servidor:", response.data)

      // CRÍTICO: Actualizar el estado local inmediatamente con los datos guardados
      // NO recargar desde el servidor para evitar que se pierdan los cambios
      const paquetesActualizados = paquetes.map((p) => {
        if (p.id_paquete === id) {
          return {
            ...p,
            ...datosActualizados,
            precioRecalculado: false, // Limpiar la bandera
          }
        }
        return p
      })

      setPaquetes(paquetesActualizados)

      Swal.fire({
        title: "¡Éxito!",
        text: "Paquete actualizado exitosamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })

      setEditandoId(null)
      // Limpiar los precios originales
      setPreciosOriginales((prev) => {
        const newPreciosOriginales = { ...prev }
        delete newPreciosOriginales[id]
        return newPreciosOriginales
      })

      // NO llamar obtenerPaquetes() aquí para evitar sobrescribir los cambios
      console.log("✅ Paquete actualizado localmente, precio preservado:", precioFinal)
    } catch (error) {
      console.error("❌ Error completo al actualizar:", error)
      console.error("❌ Respuesta del error:", error.response?.data)
      console.error("❌ Status del error:", error.response?.status)

      let errorMessage = "No se pudo actualizar el paquete"

      if (error.code === "ECONNABORTED") {
        errorMessage = "La petición tardó demasiado tiempo. Intenta nuevamente."
      } else if (error.response?.status === 500) {
        if (error.response?.data?.message?.includes("Malformed")) {
          errorMessage = "Error en el formato de datos. Verifica que todos los campos sean válidos."
        } else {
          errorMessage = "Error interno del servidor. Contacta al administrador."
        }
      } else if (error.response?.status === 400) {
        errorMessage = "Datos inválidos. Verifica que todos los campos estén correctos."
      } else if (error.response?.status === 404) {
        errorMessage = "El paquete no fue encontrado"
      } else if (error.response?.status === 403) {
        errorMessage = "No tienes permisos para actualizar este paquete"
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Entendido",
      })
    }
  }

  const handleEliminar = async (paquete) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: `¿Deseas eliminar el paquete "${paquete.nombrePaquete}"? Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      })

      if (result.isConfirmed) {
        await api.delete(`admin/deletePackage/${paquete.id_paquete}`)

        const paquetesActualizados = paquetes.filter((p) => p.id_paquete !== paquete.id_paquete)
        setPaquetes(paquetesActualizados)

        const nuevosFavoritos = favoritos.filter((fav) => fav.id_paquete !== paquete.id_paquete)
        setFavoritos(nuevosFavoritos)
        localStorage.setItem("paquetesFavoritos", JSON.stringify(nuevosFavoritos))

        Swal.fire({
          title: "¡Eliminado!",
          text: "El paquete ha sido eliminado exitosamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
      }
    } catch (error) {
      console.error("❌ Error al eliminar:", error)
      let errorMessage = "No se pudo eliminar el paquete"
      if (error.response?.status === 404) {
        errorMessage = "El paquete no fue encontrado"
      } else if (error.response?.status === 403) {
        errorMessage = "No tienes permisos para eliminar este paquete"
      }
      Swal.fire("Error", errorMessage, "error")
    }
  }

  const handleComprar = async (paquete) => {
    const price = Number(paquete.precioTotal)
    if (isNaN(price) || price <= 0) {
      alert("El precio del paquete no es válido")
      return
    }

    try {
      const response = await api.post("/api/payments/create", {
        price,
        name: paquete.nombrePaquete,
        id_paquete: paquete.id_paquete,
        quantity: 1,
      })

      const approvalUrl = response.data.approval_url
      if (approvalUrl) {
        window.location.href = approvalUrl
      } else {
        alert("No se pudo obtener la URL de aprobación")
      }
    } catch (error) {
      console.error("Error al crear el pago:", error)
      alert("Error al procesar el pago")
    }
  }

  const handleToggleFavorito = (paquete) => {
    const esFavorito = favoritos.some((fav) => fav.id_paquete === paquete.id_paquete)

    if (esFavorito) {
      const nuevosFavoritos = favoritos.filter((fav) => fav.id_paquete !== paquete.id_paquete)
      setFavoritos(nuevosFavoritos)
      localStorage.setItem("paquetesFavoritos", JSON.stringify(nuevosFavoritos))
      Swal.fire({
        title: "Removido de favoritos",
        text: `${paquete.nombrePaquete} ha sido removido de tus favoritos`,
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      })
    } else {
      const nuevosFavoritos = [...favoritos, { ...paquete, fechaAgregado: new Date().toISOString() }]
      setFavoritos(nuevosFavoritos)
      localStorage.setItem("paquetesFavoritos", JSON.stringify(nuevosFavoritos))
      Swal.fire({
        title: "¡Agregado a favoritos!",
        text: `${paquete.nombrePaquete} ha sido guardado en tus favoritos`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }

  const obtenerPaquetes = async () => {
    try {
      const response = await api.get("/packages")
      console.log("📦 Respuesta completa:", response)
      setPaquetes(response.data.paquetes || [])
    } catch (error) {
      console.error("❌ Error al obtener paquetes:", error)
      Swal.fire("Error", "No se pudieron cargar los paquetes.", "error")
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base">Cargando paquetes...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-16 sm:pt-20 pb-8">
      <div className="flex flex-col items-center gap-6 sm:gap-8 px-4">
        {/* Mensaje de hotel reservado */}
        {hotelReservado && (
          <div className="max-w-4xl w-full">
            <div className="bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-300 rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mr-3" />
                <h3 className="text-base sm:text-lg font-bold text-emerald-900">¡Reserva Confirmada!</h3>
              </div>
              <p className="text-emerald-800 mb-2 text-sm sm:text-base">
                Tu reserva en <strong>{hotelReservado.nombre}</strong> ha sido confirmada exitosamente.
              </p>
              <p className="text-emerald-700 text-xs sm:text-sm">
                Aquí tienes paquetes turísticos que incluyen este hotel para completar tu experiencia:
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Paquetes Disponibles</h1>
          <p className="text-slate-600 text-sm sm:text-base">Encuentra el paquete perfecto para tu próximo viaje</p>
        </div>

        {/* Controles superiores */}
        <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center">
          <RoleBasedComponent allowedRoles={["admin", "empleado"]}>
            <button
              onClick={() => navigate("/crearPaquete")}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Agregar</span> Paquete
            </button>
          </RoleBasedComponent>

          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">{mostrarFiltros ? "Ocultar" : "Mostrar"}</span> Filtros
          </button>
        </div>

        {/* Panel de Filtros */}
        {mostrarFiltros && (
          <div className="max-w-6xl w-full">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                Filtros de Búsqueda
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Destino</label>
                  <input
                    type="text"
                    name="destino"
                    value={filtros.destino}
                    onChange={handleFiltroChange}
                    placeholder="Buscar destino..."
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Precio Mín</label>
                  <input
                    type="number"
                    name="precioMin"
                    value={filtros.precioMin}
                    onChange={handleFiltroChange}
                    placeholder="0"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Precio Máx</label>
                  <input
                    type="number"
                    name="precioMax"
                    value={filtros.precioMax}
                    onChange={handleFiltroChange}
                    placeholder="999999"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Días Mín</label>
                  <input
                    type="number"
                    name="duracionMin"
                    value={filtros.duracionMin}
                    onChange={handleFiltroChange}
                    placeholder="1"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Días Máx</label>
                  <input
                    type="number"
                    name="duracionMax"
                    value={filtros.duracionMax}
                    onChange={handleFiltroChange}
                    placeholder="30"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-xs sm:text-sm"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={limpiarFiltros}
                    className="w-full px-3 sm:px-4 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded-lg transition-colors text-xs sm:text-sm font-semibold"
                  >
                    Limpiar
                  </button>
                </div>
              </div>

              {/* Contador de resultados */}
              <div className="mt-4 text-xs sm:text-sm text-slate-600">
                Mostrando {paquetesFiltrados.length} de {paquetes.length} paquetes
                {filtros.hotel && hotelReservado && (
                  <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                    Filtrado por hotel: {hotelReservado.nombre}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Grid de Paquetes */}
        {paquetesFiltrados.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="text-4xl sm:text-6xl mb-4">🏖️</div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
              {paquetes.length === 0 ? "No hay paquetes disponibles" : "No se encontraron paquetes"}
            </h3>
            <p className="text-slate-500 mb-4 text-sm sm:text-base">
              {paquetes.length === 0
                ? "Aún no se han creado paquetes turísticos."
                : "Intenta ajustar los filtros de búsqueda."}
            </p>
            {filtros.hotel || filtros.destino || filtros.precioMin || filtros.precioMax ? (
              <button
                onClick={limpiarFiltros}
                className="px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                Limpiar Filtros
              </button>
            ) : (
              <RoleBasedComponent allowedRoles={["admin", "empleado"]}>
                <button
                  onClick={() => navigate("/crearPaquete")}
                  className="px-4 sm:px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  Crear Primer Paquete
                </button>
              </RoleBasedComponent>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl w-full px-4">
            {paquetesFiltrados.map((paquete, index) => {
              const enEdicion = editandoId === paquete.id_paquete
              const esFavorito = favoritos.some((fav) => fav.id_paquete === paquete.id_paquete)
              const esDelHotelReservado =
                hotelReservado && paquete.id_hotel?.toString() === hotelReservado.id_hotel?.toString()

              // Obtener información de precio original para mostrar el recálculo
              const precioOriginalData = preciosOriginales[paquete.id_paquete]
              const mostrarRecalculo =
                enEdicion &&
                precioOriginalData &&
                (Number(paquete.duracionDias) !== precioOriginalData.duracionOriginal || paquete.precioRecalculado)

              return (
                <div
                  key={paquete.id_paquete || index}
                  className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-3 sm:p-5 transform hover:-translate-y-1 border cursor-pointer relative ${
                    esDelHotelReservado
                      ? "border-emerald-300 ring-2 ring-emerald-200 bg-gradient-to-br from-white to-emerald-50"
                      : "border-slate-100"
                  }`}
                  onClick={() => {
                    if (!enEdicion) {
                      setPaqueteSeleccionado(paquete)
                      setShowPreviewModal(true)
                    }
                  }}
                >
                  {/* Badge de hotel reservado */}
                  {esDelHotelReservado && (
                    <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                      ¡Tu Hotel!
                    </div>
                  )}

                  {/* Botón de favorito */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleFavorito(paquete)
                    }}
                    className={`absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-full transition-all duration-200 hover:scale-110 z-10 ${
                      esFavorito
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                        : "bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 shadow-md backdrop-blur-sm"
                    }`}
                    title={esFavorito ? "Remover de favoritos" : "Agregar a favoritos"}
                  >
                    <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${esFavorito ? "fill-current" : ""}`} />
                  </button>

                  {/* Imagen del paquete */}
                  {paquete.imagenUrl ? (
                    <img
                      src={paquete.imagenUrl || "/placeholder.svg"}
                      alt={paquete.nombrePaquete}
                      className="w-full h-32 sm:h-40 object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-32 sm:h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded-xl text-slate-500">
                      <div className="text-center">
                        <svg
                          className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-xs sm:text-sm">Sin imagen</p>
                      </div>
                    </div>
                  )}

                  {/* Título del paquete */}
                  {enEdicion ? (
                    <input
                      name="nombrePaquete"
                      value={paquete.nombrePaquete}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full mt-3 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-base sm:text-xl font-bold"
                      placeholder="Nombre del paquete"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <h2 className="text-base sm:text-xl font-bold mt-3 text-slate-800 line-clamp-2">
                      {paquete.nombrePaquete}
                    </h2>
                  )}

                  {/* Descripción */}
                  {enEdicion ? (
                    <textarea
                      name="descripcion"
                      value={paquete.descripcion}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full mt-2 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-xs sm:text-sm resize-none"
                      placeholder="Descripción del paquete"
                      rows="3"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <p className="text-slate-600 text-xs sm:text-sm mb-3 line-clamp-2">{paquete.descripcion}</p>
                  )}

                  {/* Información básica */}
                  <div className="space-y-1 text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Duración:
                      </span>
                      {enEdicion ? (
                        <input
                          type="number"
                          name="duracionDias"
                          value={paquete.duracionDias}
                          onChange={(e) => handleChange(index, e)}
                          className="w-16 sm:w-20 p-1 border border-slate-300 rounded focus:ring-1 focus:ring-blue-400 text-right font-semibold text-xs"
                          onClick={(e) => e.stopPropagation()}
                          min="1"
                        />
                      ) : (
                        <span className="font-semibold">{paquete.duracionDias} días</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Destino:
                      </span>
                      {enEdicion ? (
                        <input
                          name="nombre_destino"
                          value={paquete.nombre_destino || ""}
                          onChange={(e) => handleChange(index, e)}
                          className="w-20 sm:w-32 p-1 border border-slate-300 rounded focus:ring-1 focus:ring-blue-400 text-right font-semibold text-xs"
                          placeholder="Destino"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="font-semibold truncate max-w-24 sm:max-w-32">
                          {paquete.nombre_destino || "No definido"}
                        </span>
                      )}
                    </div>

                    {paquete.precioTotal && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Precio:
                        </span>
                        {enEdicion ? (
                          <input
                            type="number"
                            name="precioTotal"
                            value={paquete.precioTotal}
                            onChange={(e) => handleChange(index, e)}
                            className="w-20 sm:w-32 p-1 border border-slate-300 rounded focus:ring-1 focus:ring-blue-400 text-right font-bold text-emerald-600 text-xs"
                            onClick={(e) => e.stopPropagation()}
                            min="0"
                          />
                        ) : (
                          <span className="font-bold text-emerald-600 text-xs sm:text-sm">
                            ${Number(paquete.precioTotal).toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Indicador de recálculo automático */}
                  {mostrarRecalculo && (
                    <div className="mb-3 p-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center text-xs text-blue-700">
                        <Calculator className="w-3 h-3 mr-1" />
                        <span className="font-semibold">Precio recalculado automáticamente</span>
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        <span className="line-through text-slate-500">
                          ${Number(precioOriginalData.precioOriginal).toLocaleString()}
                        </span>
                        <span className="ml-2 font-bold text-emerald-600">
                          ${Number(paquete.precioTotal).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-blue-500 mt-1">
                        Basado en {precioOriginalData.duracionOriginal} → {paquete.duracionDias} días
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex gap-1 sm:gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleComprar(paquete)
                      }}
                      className={`flex-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm ${
                        esDelHotelReservado
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                          : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                      }`}
                      disabled={enEdicion}
                    >
                      {esDelHotelReservado ? "¡Comprar!" : "Comprar"}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setPaqueteSeleccionado(paquete)
                        setShowPreviewModal(true)
                      }}
                      className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center"
                      title="Ver detalles"
                      disabled={enEdicion}
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {/* Botones de edición para admin */}
                  <RoleBasedComponent allowedRoles={["admin", "empleado"]}>
                    <div className="mt-2">
                      {enEdicion ? (
                        <div className="flex gap-1 sm:gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleGuardar(paquete)
                            }}
                            className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 text-xs sm:text-sm flex items-center justify-center gap-1"
                          >
                            <Save className="w-3 h-3" />
                            Guardar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCancelarEdicion()
                            }}
                            className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-xl transition-all duration-200 text-xs sm:text-sm flex items-center justify-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-1 sm:gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleIniciarEdicion(paquete)
                            }}
                            className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 text-xs sm:text-sm flex items-center justify-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            Editar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEliminar(paquete)
                            }}
                            className="px-2 sm:px-4 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 text-xs sm:text-sm flex items-center justify-center"
                            title="Eliminar paquete"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </RoleBasedComponent>
                </div>
              )
            })}
          </div>
        )}

        {/* Modal de Preview del Paquete */}
        {showPreviewModal && paqueteSeleccionado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Header del modal */}
              <div className="relative bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-white p-4 sm:p-6">
                <button
                  onClick={() => {
                    setShowPreviewModal(false)
                    setPaqueteSeleccionado(null)
                  }}
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{paqueteSeleccionado.nombrePaquete}</h2>
                    <p className="text-white/80 text-sm sm:text-base">Detalles del paquete turístico</p>
                  </div>
                </div>
              </div>

              {/* Contenido del modal */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Imagen */}
                  <div className="space-y-4">
                    {paqueteSeleccionado.imagenUrl ? (
                      <img
                        src={paqueteSeleccionado.imagenUrl || "/placeholder.svg"}
                        alt={paqueteSeleccionado.nombrePaquete}
                        className="w-full h-48 sm:h-64 object-cover rounded-2xl shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded-2xl">
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
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm">Sin imagen disponible</p>
                        </div>
                      </div>
                    )}

                    {/* Información rápida */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 sm:p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center space-x-2 mb-1">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-xs sm:text-sm font-semibold text-blue-700">Duración</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-blue-900">
                          {paqueteSeleccionado.duracionDias} días
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-3 sm:p-4 rounded-xl border border-emerald-100">
                        <div className="flex items-center space-x-2 mb-1">
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs sm:text-sm font-semibold text-emerald-700">Precio</span>
                        </div>
                        <p className="text-lg sm:text-xl font-bold text-emerald-900">
                          ${Number(paqueteSeleccionado.precioTotal || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información detallada */}
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2 flex items-center">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-500" />
                        Destino
                      </h3>
                      <p className="text-slate-600 text-sm sm:text-base">
                        {paqueteSeleccionado.nombre_destino || "Destino no especificado"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">Descripción</h3>
                      <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                        {paqueteSeleccionado.descripcion || "Sin descripción disponible"}
                      </p>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200">
                      <h4 className="font-semibold text-slate-800 mb-3 text-sm sm:text-base">Información adicional</h4>
                      <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                        <div className="flex justify-between">
                          <span>ID del paquete:</span>
                          <span className="font-mono">{paqueteSeleccionado.id_paquete}</span>
                        </div>
                        {paqueteSeleccionado.id_hotel && (
                          <div className="flex justify-between">
                            <span>Hotel incluido:</span>
                            <span className="font-semibold">Sí (ID: {paqueteSeleccionado.id_hotel})</span>
                          </div>
                        )}
                        {paqueteSeleccionado.fechaCreacion && (
                          <div className="flex justify-between">
                            <span>Creado:</span>
                            <span>{new Date(paqueteSeleccionado.fechaCreacion).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                      <button
                        onClick={() => {
                          setShowPreviewModal(false)
                          handleComprar(paqueteSeleccionado)
                        }}
                        className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
                      >
                        Comprar Paquete
                      </button>

                      <button
                        onClick={() => handleToggleFavorito(paqueteSeleccionado)}
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base ${
                          favoritos.some((fav) => fav.id_paquete === paqueteSeleccionado.id_paquete)
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            favoritos.some((fav) => fav.id_paquete === paqueteSeleccionado.id_paquete)
                              ? "fill-current"
                              : ""
                          }`}
                        />
                        <span className="hidden sm:inline">
                          {favoritos.some((fav) => fav.id_paquete === paqueteSeleccionado.id_paquete)
                            ? "Quitar"
                            : "Favorito"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
