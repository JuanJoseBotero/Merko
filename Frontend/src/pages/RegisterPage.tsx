import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Account created successfully! Please log in.");
        navigate("/login");
      } else {
        const data = await response.json();
        setError(data?.message || "Registration failed. Try again.");
      }
    } catch (err) {
      setError("Error connecting to the server.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <h1 className="text-4xl font-bold">Create your Merko account</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-md w-80"
      >
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
          className="main-button button-text bg-blue-600 text-white rounded p-2 mt-3 hover:bg-blue-700"
        >
          Register
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      <p>
        Already have an account?{" "}
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          Log in
        </span>
      </p>
    </div>
  );
}
