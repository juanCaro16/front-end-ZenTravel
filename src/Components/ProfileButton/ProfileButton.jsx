import { useState, useRef } from "react"
import { User, ChevronDown } from "lucide-react"
import { Profile } from "../../Pages/Profile/Profile"

export const ProfileButton = () => {
  const [isProfileVisible, setIsProfileVisible] = useState(false)
  const timeoutRef = useRef(null)

  const showProfile = () => {
    clearTimeout(timeoutRef.current)
    setIsProfileVisible(true)
  }

  const hideProfile = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProfileVisible(false)
    }, 300)
  }

  return (
    <div className="relative">
      {/* Botón de perfil mejorado */}
      <button
        onMouseEnter={showProfile}
        onMouseLeave={hideProfile}
        onClick={() => setIsProfileVisible(!isProfileVisible)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
      >
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
        <span className="hidden sm:block text-sm font-medium">Mi Perfil</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileVisible ? "rotate-180" : ""}`} />
      </button>

      {/* Modal del perfil mejorado */}
      {isProfileVisible && (
        <div
          onMouseEnter={showProfile}
          onMouseLeave={hideProfile}
          className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 transform opacity-0 scale-95 animate-in"
          style={{
            animation: "fadeInScale 0.2s ease-out forwards",
          }}
        >
          {/* Flecha indicadora */}
          <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>

          <div className="p-6">
            <Profile />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
