import { useNavigate } from "react-router-dom";

export const ButtonHelp = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Botón de ayuda con tooltip */}
      <button
        onClick={() => navigate("/soporte")}
        className="bg-white rounded-3xl w-10 h-10 fixed ml-[45%] mt-[38%] hover:bg-gray-200 group"
      >
        ?
        {/* Tooltip */}
        <div className="absolute left-[-2rem] top-[-2.5rem] bg-black text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Ayuda / Soporte
        </div>
      </button>
    </div>
  );
};