import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
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

  // Filtrar prompts por búsqueda y categoría
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
    setCurrentPage(1); // Reiniciar a la primera página
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

  // Obtener el nombre de la categoría de un prompt
  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown";
  };

  return (
    <div className="space-y-8 resposive-big-container">
      <h1 className="heading-1 font-bold">Explore Prompts</h1>
      <p className="body text-gray-600">
        Each prompt has been designed for a specific purpose and used to create
        an historical dashboard. Check out its detailed description to
        understand its full potential, and use the category filters to quickly
        find the one you need. {" "}
        <a
            href="/catalog"
            className="text-blue-600 font-semibold hover:underline hover:text-blue-700 transition-colors duration-200"
        >
            Discover the categories
        </a>
      </p>

      {/* Barra de búsqueda y filtro */}
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search prompts by name..."
          className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <select
          value={selectedCategory ?? ""}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value ? parseInt(e.target.value) : null
            )
          }
          className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <Link
            className="main-button"
            to="/register"
        >
            Click here to start
        </Link>
      </div>

      {/* Lista de prompts */}
      <div className="responsive-grid">
        {currentPrompts.length > 0 ? (
          currentPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-white p-6 rounded-2xl shadow flex flex-col justify-between gap-4"
            >
              <div>
                <h2 className="heading-2">{prompt.title}</h2>
                <p className="body text-gray-600 mt-2">{prompt.description}</p>
              </div>
              <span className="text-sm text-blue-600 font-medium">
                {getCategoryName(prompt.category)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No prompts found.</p>
        )}
      </div>

      {/* Botones de paginación */}
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
    </div>
  );
}
