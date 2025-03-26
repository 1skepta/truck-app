import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  return (
    <nav>
      <div>
        <h1>Truck Manager</h1>
        <div>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
