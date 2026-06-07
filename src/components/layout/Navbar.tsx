import { useNavigate } from "react-router-dom";

import { LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <h1
        onClick={() => navigate("/dashboard")}
        className="text-2xl font-bold text-blue-600 cursor-pointer"
      >
        Preproute
      </h1>

      <div className="flex gap-6 items-center">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 hover:text-blue-600 transition"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
}
