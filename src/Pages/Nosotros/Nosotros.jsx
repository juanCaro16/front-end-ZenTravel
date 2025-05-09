export const Nosotros = () => {
  return (
    <div className="relative inline-block text-left">
      {/* Botón del menú */}
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
        Abrir menú
      </button>

      {/* Contenedor del menú */}
      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
        {/* Sombrerito en la parte superior */}
        <div className="absolute top-[-6px] left-4 w-3 h-3 bg-white rotate-45 shadow-md z-[-1]" />

        {/* Contenido del menú */}
        <div className="py-2">
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Opción 1
          </a>
          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Opción 2
          </a>
        </div>
      </div>
    </div>
  );
}


