"use client"

import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import api from "../../Services/AxiosInstance/AxiosInstance"
import { RoleBasedComponent } from "../../Components/RoleBasedComponent/RoleBasedComponent"
import { Heart } from "lucide-react"

export const Paquetes = () => {
  const navigate = useNavigate()
  const [paquetes, setPaquetes] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [favoritos, setFavoritos] = useState(() => {
    const saved = localStorage.getItem("paquetesFavoritos")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    obtenerPaquetes()
  }, [])

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

  const handleComprar = async (nombre) => {
    if (typeof nombre !== "string") {
      console.error("Nombre inválido:", nombre)
      return alert("Error interno al procesar el paquete.")
    }

    try {
      const response = await api.post("/api/payments/create", {
        price: 10.0,
        name: nombre,
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
      // Remover de favoritos
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
      // Agregar a favoritos
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

  if (loading) return <p className="text-center mt-8">Cargando paquetes...</p>

  if (paquetes.length === 0) {
    return (
      <div className="flex flex-col items-center mt-16 gap-8">
        <RoleBasedComponent allowedRoles={["admin", "Empleado"]}>
          <button onClick={() => navigate("/crearPaquete")} className="w-max p-3 rounded-full bg-white text-black">
            Agregar Paquete
          </button>
        </RoleBasedComponent>
        <p className="text-center mt-8">No hay paquetes disponibles.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center mt-16 gap-8">
      <RoleBasedComponent allowedRoles={["admin", "Empleado"]}>
        <button onClick={() => navigate("/crearPaquete")} className="w-max p-3 rounded-full bg-white text-black">
          Agregar Paquete
        </button>
      </RoleBasedComponent>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paquetes.map((paquete, index) => {
          const enEdicion = editandoId === paquete.id_paquete
          const esFavorito = favoritos.some((fav) => fav.id_paquete === paquete.id_paquete)

          return (
            <div key={paquete.id_paquete || index} className="bg-white rounded-2xl shadow p-4 relative">
              {/* Botón de favorito en la esquina superior derecha */}
              <button
                onClick={() => handleToggleFavorito(paquete)}
                className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 hover:scale-110 z-10 ${
                  esFavorito
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg"
                    : "bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 shadow-md backdrop-blur-sm"
                }`}
                title={esFavorito ? "Remover de favoritos" : "Agregar a favoritos"}
              >
                <Heart className={`w-4 h-4 ${esFavorito ? "fill-current" : ""}`} />
              </button>

              {paquete.imagenUrl ? (
                <img
                  src={paquete.imagenUrl || "/placeholder.svg"}
                  alt={paquete.nombrePaquete}
                  className="w-full h-40 object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-xl text-gray-500">
                  Sin imagen
                </div>
              )}

              {enEdicion ? (
                <input
                  name="nombrePaquete"
                  value={paquete.nombrePaquete}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full mt-2 border p-1 rounded"
                />
              ) : (
                <h2 className="text-xl font-semibold mt-2">{paquete.nombrePaquete}</h2>
              )}

              {enEdicion ? (
                <textarea
                  name="descripcion"
                  value={paquete.descripcion}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full mt-2 border p-1 rounded text-sm resize-none"
                />
              ) : (
                <p className="text-gray-600 text-sm mb-2">{paquete.descripcion}</p>
              )}

              {enEdicion ? (
                <input
                  name="duracionDias"
                  type="number"
                  value={paquete.duracionDias}
                  onChange={(e) => handleChange(index, e)}
                  className="w-full mt-1 border p-1 rounded text-sm"
                />
              ) : (
                <p className="text-sm">
                  <strong>Duración:</strong> {paquete.duracionDias} días
                </p>
              )}

              <ul className="text-sm space-y-1 mt-2">
                <li>
                  <strong>Inicio:</strong> {paquete.fechaInicio || "No especificado"}
                </li>
                <li>
                  <strong>Hotel:</strong> {paquete.numero_habitacion || "No definido"}
                </li>
                <li>
                  <strong>Transporte:</strong> {paquete.nombre_transporte || "No definido"}
                </li>
                <li>
                  <strong>Destino:</strong> {paquete.nombre_destino || "No definido"}
                </li>
                <li>
                  <strong>Categoría:</strong> {paquete.categoria || "Sin categoría"}
                </li>
                <li>
                  <strong>Descuento:</strong> {(Number(paquete.descuento) || 0).toFixed(2)}%
                </li>
                {paquete.precioTotal && (
                  <li>
                    <strong>Precio total:</strong> ${Number(paquete.precioTotal).toLocaleString()} COP
                  </li>
                )}
              </ul>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => handleComprar(paquete.nombrePaquete)}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 hover:scale-105"
                >
                  Comprar
                </button>

                <RoleBasedComponent allowedRoles={["admin", "Empleado"]}>
                  {enEdicion ? (
                    <>
                      <button
                        onClick={() => handleGuardar(paquete)}
                        className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditandoId(null)}
                        className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-xl transition-all duration-200"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditandoId(paquete.id_paquete)}
                      className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200"
                    >
                      Editar
                    </button>
                  )}
                </RoleBasedComponent>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const PaquetesCard = ({ paquete, onComprar, onFavorito, esFavorito }) => (
  <div className="min-w-[300px] max-w-xs bg-white rounded-2xl shadow p-4 border border-emerald-100 flex-shrink-0 relative">
    <button
      onClick={() => onFavorito(paquete)}
      className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 hover:scale-110 z-10 ${
        esFavorito
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
      {paquete.destino && <li><strong>Destino:</strong> {paquete.destino}</li>}
      {paquete.hotel && <li><strong>Hotel:</strong> {paquete.hotel}</li>}
      {paquete.duracion && <li><strong>Duración:</strong> {paquete.duracion}</li>}
      {paquete.fechaSalida && <li><strong>Salida:</strong> {paquete.fechaSalida}</li>}
      {paquete.precio && <li><strong>Precio:</strong> {paquete.precio}</li>}
      {paquete.calificacion && <li><strong>Calificación:</strong> {paquete.calificacion}</li>}
      {paquete.estado && <li><strong>Estado:</strong> {paquete.estado}</li>}
    </ul>
    <button
      onClick={() => onComprar(paquete.nombrePaquete || paquete.paquete)}
      className="w-full mt-2 px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 hover:scale-105"
    >
      Comprar
    </button>
  </div>
)
