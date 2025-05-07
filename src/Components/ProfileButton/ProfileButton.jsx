import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProfileButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/profile")} 
    className="w-15 h-15 mr-10 rounded-full bg-neutral-900 flex items-center justify-center
     hover:bg-neutral-700 cursor-pointer transition">
      <User className="w-6 h-6 text-white" />
    </button>
  );
};



