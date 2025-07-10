import { useEffect, useState } from "react";
import api from "../../Services/AxiosInstance/AxiosInstance";
import Swal from "sweetalert2";

export const HotelSelector = ({ destino, onSelect }) => {
  const [hoteles, setHoteles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!destino) return;

    const fetchHoteles = async () => {
      setLoading(true);
      try {
        const res = await api.get(`packages/Hotel/${destino}`); // ← Reemplaza esta ruta
        setHoteles(res.data.resultado);
        if (res.data.length === 0) {
          Swal.fire("Sin resultados", "No se encontraron hoteles en este destino.", "info");
        }
      } catch (error) {
        console.error("❌ Error al obtener hoteles:", error);
        Swal.fire("Error", "Ocurrió un error al cargar los hoteles.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchHoteles();
  }, [destino]);

  return (
    <div className="mt-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Hoteles en {destino || "la ciudad seleccionada"}
      </label>
      {loading ? (
        <p className="text-sm text-gray-500">Cargando hoteles...</p>
      ) : (
        <select
          onChange={(e) => onSelect(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl bg-white text-sm"
        >
          <option value="">Selecciona un hotel</option>
          {hoteles.map((hotel) => (
            <option key={hotel.id_hotel} value={hotel.nombre}>
              🏨 {hotel.nombre} ({hotel.ciudad})
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
