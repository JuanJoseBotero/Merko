import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Interfaz para definir la estructura de un prompt
interface Prompt {
  id: number;
  title: string;
  description: string;
  prompt_template: string;
  variables: Record<string, string>;
}

// Componente para mostrar la lista de prompts de una categoría
const PromptListPage: React.FC = () => {
  // useLocation obtiene datos pasados desde la ruta anterior
  const location = useLocation();
  // useNavigate permite redirigir a otra página
  const navigate = useNavigate();
  // Desestructurar categoryId y categoryName; usamos || {} para evitar errores si location.state es undefined
  const { categoryId, categoryName } = location.state || {};

  // Estado para almacenar la lista de prompts
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  // Efecto para cargar prompts del backend cuando cambia categoryId
  useEffect(() => {
    // Si no hay categoryId, no hacemos nada
    if (!categoryId) return;

    // Solicitud fetch al backend; la URL incluye el categoryId como parámetro
    fetch(`http://127.0.0.1:8000/api/catalog/prompts/?category=${categoryId}`)
      .then((res) => res.json()) // Convertir la respuesta a JSON
      .then((data) => setPrompts(data)) // Guardar los prompts en el estado
      .catch((err) => console.error(err)); // Mostrar error en consola si falla
  }, [categoryId]); // Ejecutar cuando cambie categoryId

  return (
    <div className="resposive-big-container">
      <h1 className="heading-2">{categoryName}</h1>

      <div className="mt-6 space-y-4">
        {prompts.map((p) => (
          <button
            key={p.id}
            // Navegar a la página de parametrización, pasando el prompt y categoryName
            onClick={() =>
              navigate("/catalog/prompt-list/prompt-parameterization", {
                state: { prompt: p, categoryName }, // Enviar datos a la siguiente página
              })
            }
            className="w-full text-left p-4 rounded-lg shadow bg-white hover:bg-blue-50 transition"
          >
            <h2 className="heading-3">{p.title}</h2>
            <p className="body">{p.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptListPage;