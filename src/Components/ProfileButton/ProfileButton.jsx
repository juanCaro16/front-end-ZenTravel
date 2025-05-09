import { useState, useRef } from "react";
import { User } from "lucide-react";
import { Profile } from "../../Pages/Profile/Profile";

export const ProfileButton = () => {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const timeoutRef = useRef(null);

  const showProfile = () => {
    clearTimeout(timeoutRef.current);
    setIsProfileVisible(true);
  };

  const hideProfile = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProfileVisible(false);
    }, 500); // 500ms para transición rápida (puedes poner 5000 para 5s, pero no es común)
  };

  return (
    <div className="relative">
      {/* Botón de perfil */}
      <button
        onMouseEnter={showProfile}
        onMouseLeave={hideProfile}
        className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center
        hover:bg-neutral-700 cursor-pointer transition"
      >
        <User className="w-6 h-6 text-white" />
      </button>

      {/* Modal del perfil */}
      {isProfileVisible && (
        <div
          onMouseEnter={showProfile}
          onMouseLeave={hideProfile}
          className="absolute top-14 right-0 w-80 bg-white rounded-xl shadow-lg p-4 z-50"
        >
          <Profile />
        </div>
      )}
    </div>
  );
};
