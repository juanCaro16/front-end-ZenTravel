import { useState } from "react"
import api from "../../Services/AxiosInstance/AxiosInstance"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"

export const CrearHoteles = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    ubicacion: "",
    ciudad: "",
    estrellas: "",
    imagenes: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, imagenes: Array.from(e.target.files) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMensaje("")
    setError("")
    try {
      const formToSend = new FormData()
      formToSend.append("nombre", formData.nombre)
      formToSend.append("descripcion", formData.descripcion)
      formToSend.append("ubicacion", formData.ubicacion)
      formToSend.append("ciudad", formData.ciudad) // <-- aquí
      formToSend.append("estrellas", formData.estrellas)
      formData.imagenes.forEach((img) => {
        formToSend.append("imagenes", img)
      })

      const response = await api.post("/admin/CreateHotel", formToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      Swal.fire("¡Éxito!", response.data?.message || "Hotel creado correctamente", "success")
      navigate("/Hoteles")
    } catch (err) {
      let errMsg = "Error al crear el hotel"
      if (err.response?.data?.message) {
        errMsg = err.response.data.message
      }
      setError(errMsg)
      Swal.fire("Error", errMsg, "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center mt-10 p-2">
      <form
        onSubmit={handleSubmit}
        className="w-130 bg-white shadow-xl rounded-2xl px-6 py-10 space-y-5"
      >
        <h1 className="text-4xl font-extrabold text-emerald-600 text-center tracking-tight">
          Registrar Hotel
        </h1>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Nombre del Hotel</label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej. Hotel Paraíso"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Breve descripción del hotel"
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-emerald-400 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Ubicación</label>
          <input
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            placeholder="Ej. Medellín, Antioquia"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Ciudad</label>
          <input
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            placeholder="Ej. Medellín"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Estrellas</label>
          <input
            name="estrellas"
            type="number"
            min={1}
            max={5}
            step={0.1} // <-- permite decimales como 2.3, 4.7, etc.
            value={formData.estrellas}
            onChange={handleChange}
            placeholder="1 a 5"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Imágenes del Hotel</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            multiple
          />
          {formData.imagenes.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {formData.imagenes.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-gray-200 shadow">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview-${i}`}
                    className="w-full h-24 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition duration-200 shadow-lg"
        >
          {isLoading ? "Creando..." : "Crear Hotel"}
        </button>

        {mensaje && <p className="text-green-600 text-sm text-center">{mensaje}</p>}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>
  )
}
