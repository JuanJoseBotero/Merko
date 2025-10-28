import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import PromptModal from "../Components/PromptsComponents/promptModal";
import { Link } from "react-router-dom";

interface Prompt {
  id: number;
  title: string;
  description: string;
  category: number; // viene como ID
}

interface Category {
  id: number;
  name: string;
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const promptsPerPage = 8;
  const [selectedPrompts, setSelectedPrompts] = useState<Prompt[]>([]);
  const maxSelection = 5;
  const minSelection = 5;
  const [showModal, setShowModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Escuchar cambios en el token
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Cargar prompts
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/catalog/prompts/")
      .then((res) => res.json())
      .then((data) => {
        setPrompts(data);
        setFilteredPrompts(data);
      })
      .catch((err) => console.error("Error fetching prompts:", err));
  }, []);

  // Cargar categorías
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/catalog/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Filtrar prompts
  useEffect(() => {
    let filtered = prompts;
    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    setFilteredPrompts(filtered);
    setCurrentPage(1);
  }, [search, selectedCategory, prompts]);

  // Paginación
  const indexOfLastPrompt = currentPage * promptsPerPage;
  const indexOfFirstPrompt = indexOfLastPrompt - promptsPerPage;
  const currentPrompts = filteredPrompts.slice(
    indexOfFirstPrompt,
    indexOfLastPrompt
  );

  const handleNextPage = () => {
    if (indexOfLastPrompt < filteredPrompts.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Obtener nombre categoría
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  // Cambiar selección (solo si esta logeado)
  const togglePromptSelection = (prompt: Prompt) => {
    if (!isLoggedIn) return;
    setSelectedPrompts((prev) => {
      const isSelected = prev.some((p) => p.id === prompt.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== prompt.id);
      } else {
        if (prev.length < maxSelection) {
          return [...prev, prompt];
        } else {
          setShowLimitModal(true);
          return prev;
        }
      }
    });
  };

  return (
    <div className="space-y-8 resposive-big-container">
      <h1 className="heading-1 font-bold">Explore Prompts</h1>
      <p className="body text-gray-600">
        Each prompt has been designed for a specific purpose and used to create
        an historical dashboard. Check out its detailed description to
        understand its full potential, and use the category filters to quickly
        find the one you need.{" "}
        <a
          href="/catalog"
          className="text-blue-600 font-semibold hover:underline hover:text-blue-700 transition-colors duration-200"
        >
          Discover the categories
        </a>
      </p>

      {/* Barra de búsqueda y filtro */}
      <div className="flex flex-wrap items-center gap-4 justify-between mt-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search prompts by name..."
          className="flex-1 h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <select
          value={selectedCategory ?? ""}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value ? parseInt(e.target.value) : null
            )
          }
          className="h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {isLoggedIn ? (
          <>
            {selectedPrompts.length === 0 ? (
              <p className="h-12 flex items-center bg-yellow-100 text-yellow-800 font-medium px-4 rounded-lg shadow">
                Select at least 5 prompts to create a Dashboard
              </p>
            ) : selectedPrompts.length < minSelection ? (
              <p className="h-12 flex items-center bg-red-100 text-red-800 font-medium px-4 rounded-lg shadow">
                {`${selectedPrompts.length} out of 5 prompts selected — select ${
                  minSelection - selectedPrompts.length
                } more`}
              </p>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all"
              >
                Create Dashboard
              </button>
            )}
          </>
        ) : (
          <Link
            className="h-12 flex items-center px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
            to="/register"
          >
            Click here to start
          </Link>
        )}
      </div>

      {/* Lista de prompts */}
      <div className="responsive-grid">
        {currentPrompts.length > 0 ? (
          currentPrompts.map((prompt) => {
            const isSelected = selectedPrompts.some((p) => p.id === prompt.id);
            return (
              <div
                key={prompt.id}
                onClick={() => togglePromptSelection(prompt)}
                className={`p-6 rounded-2xl flex flex-col justify-between gap-4 cursor-pointer border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-blue-500 shadow-md bg-white scale-[1.02]"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-md bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <h2
                    className={`heading-2 ${
                      isSelected ? "text-blue-600" : "text-gray-900"
                    }`}
                  >
                    {prompt.title}
                  </h2>
                  {isLoggedIn && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="w-5 h-5 text-blue-600 accent-blue-600 cursor-pointer flex-shrink-0"
                      style={{ minWidth: "1rem", minHeight: "1rem" }}
                    />
                  )}
                </div>
                <p className="body text-gray-600 mt-2">{prompt.description}</p>
                <span className="text-sm text-blue-600 font-medium">
                  {getCategoryName(prompt.category)}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No prompts found.</p>
        )}
      </div>

      {/* Paginación */}
      <div className="flex justify-end items-center gap-4 mt-6 fixed bottom-10 right-10">
        {currentPage > 1 && (
          <button
            onClick={handlePreviousPage}
            className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        {indexOfLastPrompt < filteredPrompts.length && (
          <button
            onClick={handleNextPage}
            className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
      
      {/* Modal de creacion */}
      {showModal && (
        <PromptModal
          prompts={selectedPrompts} // ← lista de prompts seleccionados
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Modal de límite */}
      {showLimitModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl text-center w-[350px]">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Selection Limit Reached
            </h2>
            <p className="text-gray-600 mb-4">
              You can select a maximum of 5 prompts.
            </p>
            <button
              onClick={() => setShowLimitModal(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
