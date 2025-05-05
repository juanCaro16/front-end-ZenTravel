import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProfileButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition">
      <User className="w-5 h-5 text-gray-700" />
    </button>
  );
};



