"use client"

import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import api from "../../Services/AxiosInstance/AxiosInstance"
import { RoleBasedComponent } from "../../Components/RoleBasedComponent/RoleBasedComponent"
import { Heart, Eye, X, Trash2 } from "lucide-react"

export const Paquetes = () => {
  const navigate = useNavigate()
  const [paquetes, setPaquetes] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [favoritos, setFavoritos] = useState(() => {
    const saved = localStorage.getItem("paquetesFavoritos")
    return saved ? JSON.parse(saved) : []
  })

  const handleChange = (index, e) => {
    const { name, value } = e.target
    const nuevosPaquetes = [...paquetes]
    nuevosPaquetes[index][name] = value
    setPaquetes(nuevosPaquetes)
  }

  const handleGuardar = async (paquete) => {
    try {
      const id = paquete.id_paquete
      await api.put(`packages/IDPackage/${id}`, paquete)
      Swal.fire("Éxito", "Paquete actualizado exitosamente", "success")
      setEditandoId(null)
    } catch (error) {
      console.error("❌ Error al actualizar:", error)
      Swal.fire("Error", "No se pudo actualizar el paquete", "error")
    }
  }

  const handleEliminar = async (paquete) => {
    try {
      console.log("🗑️ Intentando eliminar paquete:", paquete)
      console.log("ID del paquete:", paquete.id_paquete)

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
        const id = paquete.id_paquete
        console.log("🔄 Haciendo petición DELETE a:", `packages/deletePackage/${id}`)

        const response = await api.delete(`admin/deletePackage/${paquete.id_paquete}`)
        console.log("✅ Respuesta del servidor:", response)

        // Actualizar la lista de paquetes
        const paquetesActualizados = paquetes.filter((p) => p.id_paquete !== id)
        setPaquetes(paquetesActualizados)
        console.log("📦 Paquetes actualizados:", paquetesActualizados)

        // Remover de favoritos si estaba
        const nuevosFavoritos = favoritos.filter((fav) => fav.id_paquete !== id)
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
      console.error("❌ Error completo al eliminar:", error)
      console.error("❌ Error response:", error.response)
      console.error("❌ Error message:", error.message)
      console.error("❌ Error status:", error.response?.status)
      console.error("❌ Error data:", error.response?.data)

      let errorMessage = "No se pudo eliminar el paquete"

      if (error.response?.status === 404) {
        errorMessage = "El paquete no fue encontrado"
      } else if (error.response?.status === 403) {
        errorMessage = "No tienes permisos para eliminar este paquete"
      } else if (error.response?.status === 500) {
        errorMessage = "Error interno del servidor"
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
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

  const [loading, setLoading] = useState(true)

  const obtenerPaquetes = async () => {
    try {
      const response = await api.get("/packages")
      console.log("📦 Respuesta completa:", response)
      console.log("Contenido:", response.data)
      setPaquetes(response.data.paquetes || [])
    } catch (error) {
      console.error("❌ Error al obtener paquetes:", error)
      Swal.fire("Error", "No se pudieron cargar los paquetes.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    obtenerPaquetes()
  }, [])

  if (loading) return <p className="text-center mt-8 text-slate-600">Cargando paquetes...</p>

  if (paquetes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center pt-16 gap-8">
          <RoleBasedComponent allowedRoles={["admin", "Empleado"]}>
            <button
              onClick={() => navigate("/crearPaquete")}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              + Agregar Paquete
            </button>
          </RoleBasedComponent>
          <p className="text-center mt-8 text-slate-600">No hay paquetes disponibles.</p>
        </div>
      </div>
    )
  }

  return (

    <div className="flex flex-col items-center pt-16 gap-8">
      <RoleBasedComponent allowedRoles={["admin", "Empleado"]}>
        <button
          onClick={() => navigate("/crearPaquete")}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          + Agregar Paquete
        </button>
      </RoleBasedComponent>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl">
        {paquetes.map((paquete, index) => {
          const enEdicion = editandoId === paquete.id_paquete
          const esFavorito = favoritos.some((fav) => fav.id_paquete === paquete.id_paquete)

          return (
            <div
              key={paquete.id_paquete || index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 transform hover:-translate-y-1 border border-slate-100 cursor-pointer relative"
              onClick={() => {
                console.log("Card clicked, paquete:", paquete) // Para debug
                setPaqueteSeleccionado(paquete)
                setShowPreviewModal(true)
              }}
            >
              {/* Botón de favorito */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleFavorito(paquete)
                }}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 hover:scale-110 z-10 ${esFavorito
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                    : "bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 shadow-md backdrop-blur-sm"
                  }`}
                title={esFavorito ? "Remover de favoritos" : "Agregar a favoritos"}
              >
                <Heart className={`w-4 h-4 ${esFavorito ? "fill-current" : ""}`} />
              </button>

              {/* Imagen del paquete */}
              {paquete.imagenUrl ? (
                <img
                  src={paquete.imagenUrl || "/placeholder.svg"}
                  alt={paquete.nombrePaquete}
                  className="w-full h-40 object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded-xl text-slate-500">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 mx-auto mb-2 text-slate-400"
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
                    <p className="text-sm">Sin imagen</p>
                  </div>
                </div>
              )}

              {/* Título del paquete */}
              {enEdicion ? (
                <input
                  name="nombrePaquete"
                  value={paquete.nombrePaquete}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full mt-3 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-xl font-bold"
                  placeholder="Nombre del paquete"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <h2 className="text-xl font-bold mt-3 text-slate-800">{paquete.nombrePaquete}</h2>
              )}

              {/* Descripción */}
              {enEdicion ? (
                <textarea
                  name="descripcion"
                  value={paquete.descripcion}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full mt-2 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm resize-none"
                  placeholder="Descripción del paquete"
                  rows="3"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">{paquete.descripcion}</p>
              )}

              {/* Información básica */}
              <div className="space-y-1 text-sm text-slate-600 mb-4">
                <div className="flex items-center justify-between">
                  <span>Duración:</span>
                  {enEdicion ? (
                    <input
                      type="number"
                      name="duracionDias"
                      value={paquete.duracionDias}
                      onChange={(e) => handleChange(index, e)}
                      className="w-20 p-1 border border-slate-300 rounded focus:ring-1 focus:ring-blue-400 text-right font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="font-semibold">{paquete.duracionDias} días</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Destino:</span>
                  {enEdicion ? (
                    <input
                      name="nombre_destino"
                      value={paquete.nombre_destino || ""}
                      onChange={(e) => handleChange(index, e)}
                      className="w-32 p-1 border border-slate-300 rounded focus:ring-1 focus:ring-blue-400 text-right font-semibold"
                      placeholder="Destino"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="font-semibold">{paquete.nombre_destino || "No definido"}</span>
                  )}
                </div>
                {paquete.precioTotal && (
                  <div className="flex items-center justify-between">
                    <span>Precio:</span>
                    {enEdicion ? (
                      <input
                        type="number"
                        name="precioTotal"
                        value={paquete.precioTotal}
                        onChange={(e) => handleChange(index, e)}
                        className="w-32 p-1 border border-slate-300 rounded focus:ring-1 focus:ring-blue-400 text-right font-bold text-emerald-600"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="font-bold text-emerald-600">
                        ${Number(paquete.precioTotal).toLocaleString()} COP
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleComprar(paquete)
                  }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Comprar
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log("Eye button clicked, paquete:", paquete) // Para debug
                    setPaqueteSeleccionado(paquete)
                    setShowPreviewModal(true)
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center"
                  title="Ver detalles"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Botones de edición para admin */}
              <RoleBasedComponent allowedRoles={["admin", "Empleado"]}>
                <div className="mt-2">
                  {enEdicion ? (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleGuardar(paquete)
                        }}
                        className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 text-sm"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditandoId(null)
                        }}
                        className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-xl transition-all duration-200 text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditandoId(paquete.id_paquete)
                        }}
                        className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEliminar(paquete)
                        }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 text-sm flex items-center justify-center"
                        title="Eliminar paquete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </RoleBasedComponent>
            </div>
          )
        })}
      </div>

      {/* Modal de Preview del Paquete */}
      {showPreviewModal && paqueteSeleccionado && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header del modal */}
            <div className="relative bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-white p-6">
              <button
                onClick={() => {
                  setShowPreviewModal(false)
                  setPaqueteSeleccionado(null)
                }}
                className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="pr-12">
                <h2 className="text-3xl font-bold mb-2">{paqueteSeleccionado.nombrePaquete}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm text-black">
                    📍 {paqueteSeleccionado.nombre_destino || "Destino no definido"}
                  </span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm text-black">
                    ⏱️ {paqueteSeleccionado.duracionDias} días
                  </span>
                  {paqueteSeleccionado.categoria && (
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm text-black">
                      🏷️ {paqueteSeleccionado.categoria}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Columna izquierda */}
                <div className="space-y-6">
                  {/* Imagen del paquete */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-500"
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
                      Imagen del Paquete
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      {paqueteSeleccionado.imagenUrl ? (
                        <img
                          src={paqueteSeleccionado.imagenUrl || "/placeholder.svg"}
                          alt={paqueteSeleccionado.nombrePaquete}
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                        />
                      ) : (
                        <div className="w-full h-64 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center rounded-lg">
                          <div className="text-center">
                            <svg
                              className="w-16 h-16 mx-auto mb-4 text-slate-400"
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
                            <p className="text-slate-500 text-lg">No hay imagen disponible</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-emerald-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Descripción
                    </h3>
                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg">
                      {paqueteSeleccionado.descripcion || "Sin descripción disponible"}
                    </p>
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="space-y-6">
                  {/* Información del paquete */}
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Detalles del Paquete
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Duración:</span>
                        <span className="font-semibold">{paqueteSeleccionado.duracionDias} días</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Fecha de inicio:</span>
                        <span className="font-semibold">{paqueteSeleccionado.fechaInicio || "No especificado"}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Hotel:</span>
                        <span className="font-semibold">
                          {paqueteSeleccionado.numero_habitacion || "No definido"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Transporte:</span>
                        <span className="font-semibold">
                          {paqueteSeleccionado.nombre_transporte || "No definido"}
                        </span>
                      </div>

                      {paqueteSeleccionado.descuento && Number(paqueteSeleccionado.descuento) > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Descuento:</span>
                          <span className="font-semibold text-red-600">
                            {Number(paqueteSeleccionado.descuento).toFixed(2)}%
                          </span>
                        </div>
                      )}

                      {paqueteSeleccionado.precioTotal && (
                        <div className="flex items-center justify-between border-t pt-3">
                          <span className="text-slate-600 text-lg">Precio Total:</span>
                          <span className="font-bold text-2xl text-emerald-600">
                            ${Number(paqueteSeleccionado.precioTotal).toLocaleString()} COP
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Estado del paquete */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                    <h4 className="font-semibold text-emerald-900 mb-2">Estado del Paquete</h4>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-gray-600">Disponible para compra</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="border-t bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleFavorito(paqueteSeleccionado)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center gap-2 ${favoritos.some((fav) => fav.id_paquete === paqueteSeleccionado.id_paquete)
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${favoritos.some((fav) => fav.id_paquete === paqueteSeleccionado.id_paquete) ? "fill-current" : ""}`}
                    />
                    {favoritos.some((fav) => fav.id_paquete === paqueteSeleccionado.id_paquete)
                      ? "Remover de favoritos"
                      : "Agregar a favoritos"}
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowPreviewModal(false)
                      setPaqueteSeleccionado(null)
                    }}
                    className="px-6 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded-lg transition-all duration-200 font-semibold"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => {
                      setShowPreviewModal(false)
                      setPaqueteSeleccionado(null)
                      handleComprar(paqueteSeleccionado)
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                  >
                    Comprar Ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}

export const PaquetesCard = ({ paquete, onComprar, onFavorito, esFavorito }) => (
  <div className="min-w-[300px] max-w-xs bg-white rounded-2xl shadow p-4 border border-emerald-100 flex-shrink-0 relative">
    <button
      onClick={() => onFavorito(paquete)}
      className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 hover:scale-110 z-10 ${esFavorito
          ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
          : "bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 shadow-md backdrop-blur-sm"
        }`}
      title={esFavorito ? "Remover de favoritos" : "Agregar a favoritos"}
    >
      <Heart className={`w-4 h-4 ${esFavorito ? "fill-current" : ""}`} />
    </button>
    <h4 className="text-xl font-semibold mb-1">{paquete.nombrePaquete || paquete.paquete || "Paquete"}</h4>
    <p className="text-gray-600 text-sm mb-2">{paquete.descripcion || ""}</p>
    <ul className="text-sm space-y-1 mb-2">
      {paquete.destino && (
        <li>
          <strong>Destino:</strong> {paquete.destino}
        </li>
      )}
      {paquete.hotel && (
        <li>
          <strong>Hotel:</strong> {paquete.hotel}
        </li>
      )}
      {paquete.duracion && (
        <li>
          <strong>Duración:</strong> {paquete.duracion}
        </li>
      )}
      {paquete.fechaSalida && (
        <li>
          <strong>Salida:</strong> {paquete.fechaSalida}
        </li>
      )}
      {paquete.precio && (
        <li>
          <strong>Precio:</strong> {paquete.precio}
        </li>
      )}
      {paquete.calificacion && (
        <li>
          <strong>Calificación:</strong> {paquete.calificacion}
        </li>
      )}
      {paquete.estado && (
        <li>
          <strong>Estado:</strong> {paquete.estado}
        </li>
      )}
    </ul>
    <button
      onClick={() => onComprar(paquete.nombrePaquete || paquete.paquete)}
      className="w-full mt-2 px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 hover:scale-105"
    >
      Comprar
    </button>
  </div>
)

