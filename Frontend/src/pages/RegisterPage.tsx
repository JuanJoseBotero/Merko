import { Import } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://34.31.138.222:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Account created successfully! Please log in.");
        navigate("/login");
      } else {
        const data = await response.json();
        console.error("Registration error:", data);

        const formattedErrors = Object.entries(data)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(", ")}`)
          .join(" | ");

        setError(formattedErrors || "Registration failed. Try again.");
      }
    } catch (err) {
      setError("Error connecting to the server.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-row gap-8 p-10 rounded-2xl bg-white">
        <div className="flex flex-col items-center justify-center gap-6">
          <h1 className="text-4xl mb-6 font-bold">Register</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80" >
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="p-2 rounded border"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 rounded border"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 rounded border"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 p-3 rounded-lg text-white hover:bg-blue-700 hover:cursor-pointer"
            >
              Register
            </button>
          </form>
          <h2>Do you have an account? <span><Link to={"/login"} className="text-blue-500"> Login</Link></span></h2>
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}

    </div>
  );
}
