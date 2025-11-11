import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Para icono de go back
import { ArrowLeft } from "lucide-react";

// Interfaz para definir la estructura de un prompt
interface Prompt {
  id: number;
  title: string;
  description: string;
  prompt_template: string;
  variables: Record<string, string>;
}

const PromptListPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryId, categoryName } = location.state || {};

  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    if (!categoryId) return;

    fetch(`http://127.0.0.1:8000/api/catalog/prompts/?category=${categoryId}`)
      .then((res) => res.json()) // Convertir la respuesta a JSON
      .then((data) => setPrompts(data)) // Guardar los prompts en el estado
      .catch((err) => console.error(err)); // Mostrar error en consola si falla
  }, [categoryId]); // Ejecutar cuando cambie categoryId

  return (
    <div className="resposive-big-container">
      <div className="mb-6 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-black hover:-translate-y-0.5 hover:text-gray-700 font-semibold transition-all"
        >
          <ArrowLeft size={20} />
          Go back
        </button>
      </div>
      <h1 className="heading-2">{categoryName}</h1>

      {/* Lista de prompts */}
      <div className="mt-6 space-y-4">
        {prompts.length > 0 ? (
          prompts.map((p) => (
            <div
              key={p.id}
              className="w-full text-left p-5 rounded-2xl shadow bg-white hover:bg-blue-50 transition cursor-default"
            >
              <h2 className="heading-3 font-semibold">{p.title}</h2>
              <p className="body text-gray-600 mt-2">{p.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No prompts found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default PromptListPage;