import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Icon from "../../Images/Icon.png";

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
      const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="flex flex-row py-3 px-8 justify-between shadow-sm bg-white/10 backdrop-blur-md fixed top-0 w-full z-10">
      <h1 className="text-2xl font-extrabold">
        <Link to="/">Merko</Link>
      </h1>

      <nav>
        <ul className="flex items-center gap-8 font-medium">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/catalog">Categories</Link>
          </li>
          <li>
            <Link to="/prompts">Prompts</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/dashboard/current">Current Dashboard</Link>
          </li>

          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/login" className="text-blue-500 hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-blue-500 hover:underline">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="text-red-500 font-semibold hover:underline"
              >
                Logout
              </button>
            </li>
          )}

          <img
            src={Icon}
            alt="profile"
            className="h-9 w-9 rounded-full border-2 border-gray-300"
          />
        </ul>
      </nav>
    </div>
  );
}