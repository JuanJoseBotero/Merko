import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef} from "react";
import Icon from "../../Images/Icon.png";
import "../../css/navbar.css"

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isDropActive, setIsDropActive] = useState(false)
  const navigate = useNavigate();
  const dropRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
      const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    // Si el clic no fue dentro del dropdown, lo cerramos
    if (dropRef.current && !dropRef.current.contains(event.target as Node)) {
      setIsDropActive(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const activateProfile = () => {
    setIsDropActive(!isDropActive);
  };

  return (
    <div className="flex flex-row py-3 px-8 justify-between shadow-sm bg-white/10 backdrop-blur-md fixed top-0 w-full z-10">
      <h1 className="text-2xl font-extrabold">
        <Link to="/">Merko</Link>
      </h1>

      <nav className="flex flex-row relative">
        <ul className="flex items-center gap-8 font-medium">
          <li>
            <Link to="/catalog">Categories</Link>
          </li>
          <li>
            <Link to="/prompts">Prompts</Link>
          </li>

          <img
            src={Icon}
            alt="profile"
            className="h-9 w-9 rounded-full border-2 border-gray-300"
            onClick={activateProfile}
          />
        </ul>
        <div ref={dropRef} className={`action ${isDropActive ? "active" : ""} p-3`} >
            <ul className=" flex flex-col divide-y divide-gray-300">
                <li className="p-2">
                  <Link to="/view-dashboards" className="text-black hover:underline">
                    Profile
                  </Link>
                </li>
                <li className="p-2">
                  <Link to="/dashboard/current">Current Dashboard</Link>
                </li>
                {!isLoggedIn ? (
                <>
                  <li className="p-2">
                    <Link to="/login" className="text-blue-500 hover:underline">
                      Login
                    </Link>
                  </li>
                  <li className="p-2">
                    <Link to="/register" className="text-blue-500 hover:underline">
                      Register
                    </Link>
                  </li>
                </>
                ) : (
                  <li className="p-2">
                    <button
                      onClick={handleLogout}
                      className="text-red-500 font-semibold hover:underline cursor-pointer"
                    >
                      Logout
                    </button>
                  </li>
                )}
            </ul>
          </div>
      </nav>
    </div>
  );
}