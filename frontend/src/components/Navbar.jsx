import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  const isDashboard = location.pathname === "/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setIsOpen(false), 1000);
    }
  }, [isOpen]);

  const closeMenu = () => {
    setAnimate(false);
    setTimeout(() => setIsOpen(false), 1000);
  };

  const handleIconClick = () => {
    if (!isDashboard) {
      navigate("/dashboard");
    } else {
      setIsOpen(true);
    }
  };

  return (
    <nav className="pb-3 shadow-md mb-7 bg-[#F3FFFD]">
      <div className="flex justify-between items-center mx-5 pt-5">
        <div className="w-8 cursor-pointer" onClick={handleIconClick}>
          {isDashboard ? (
            <img src="assets/sort.png" alt="hamburger icon" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-5 text-black transition-colors duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          )}
        </div>
        <div>
          <Link to="/dashboard" className="text-xl font-bold">
            Truck Manager
          </Link>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 flex justify-start z-50 transition-opacity duration-1000 ease-in-out "
          onClick={closeMenu}
        >
          <div
            className={`bg-[#F3FFFD] w-64 h-full p-5 shadow-lg transform transition-transform duration-1000 ease-in-out ${
              animate ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="mb-5 text-lg font-bold" onClick={closeMenu}>
              ✖
            </button>
            <div className="flex flex-col items-start space-y-4">
              <Link to="/profile" className="text-blue-500" onClick={closeMenu}>
                Profile
              </Link>
              <button className="text-red-500" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
