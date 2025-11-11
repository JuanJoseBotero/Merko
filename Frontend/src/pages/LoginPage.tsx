import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("username", data.username);
      localStorage.setItem("token", data.access);
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-row gap-8 p-10 rounded-2xl bg-white">
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl mb-6 font-bold">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
            <input
              className="border p-2 rounded"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="bg-blue-600 p-3 rounded-lg text-white hover:bg-blue-700 hover:cursor-pointer" type="submit">
              Log In
            </button>
          </form>
          <h2>Don't have an account yet?<span><Link to={"/register"} className="text-blue-500 "> Register</Link></span></h2>
        </div>
      </div>
    </div>
  );
}
