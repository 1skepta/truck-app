import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/"); 
  };

  return (
    <nav className="bg-blue-700 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold tracking-wide">🚛 Truck Manager</h1>
        <div className="space-x-6 text-lg">
          <Link to="/dashboard" className="hover:text-gray-300 transition">
            Dashboard
          </Link>
          <Link to="/profile" className="hover:text-gray-300 transition">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
