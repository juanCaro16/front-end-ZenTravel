import React from 'react'

export const Profile = () => {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-6">
        {/* Foto y nombre */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-bold">
            JD
          </div>
          <div>
            <h2 className="text-xl font-semibold">Juan David</h2>
            <p className="text-gray-500">juandavid@email.com</p>
          </div>
        </div>
  
        {/* Información general */}
        <div> 
          <h3 className="text-lg font-medium mb-2">Información general</h3>
          <ul className="text-gray-700 space-y-1">
            <li><span className="font-semibold">Id:</span> 123456789 </li>
            <li><span className="font-semibold">País:</span> Colombia</li>
            <li><span className="font-semibold">Teléfono:</span> +57 300 123 4567</li>
            <li><span className="font-semibold">Miembro desde:</span> enero 2024</li>
          </ul>
        </div>
  
        {/* Acciones */}
        <div className="w-full flex justify-between">
          <button className="w-[40%] py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Editar perfil
          </button>
          <button className=" w-[50%] py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  };
