import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/PromptParameterization.css";
import "../css/Icons/Loader.css"

// Definir la interfaz para el objeto Prompt, que describe su estructura
interface Prompt {
  id: number; // Identificador único del prompt
  title: string; // Título del prompt
  description: string; // Descripción del prompt
  prompt_template: string; // Plantilla del prompt con marcadores (ej. {{variable}})
  variables: Record<string, string>; // Objeto con nombres de variables y sus descripciones
}

export default function PromptParameterizationPage() {
  // Acceder al estado de la ubicación (pasado desde la ruta anterior) y a la función de navegación
  const location = useLocation();
  const navigate = useNavigate();
  // Desestructurar prompt y categoryName desde el estado de la ubicación
  const { prompt, categoryName } = location.state as {
    prompt: Prompt;
    categoryName: string;
  };

  // Estado para almacenar los valores ingresados por el usuario para las variables del prompt
  const [values, setValues] = useState<Record<string, string>>({});

  // Estado para almacenar información adicional proporcionada por el usuario
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Estado para almacenar la vista previa del prompt construido
  const [previewPrompt, setPreviewPrompt] = useState("");

  // Estado para almacenar la respuesta del backend
  const [responseData, setResponseData] = useState<string | null>(null);

  // Estado para manejar el estado de carga durante las solicitudes al backend
  const [loading, setLoading] = useState(false);

  // Efecto para actualizar la vista previa del prompt cuando cambian los valores o la información adicional
  useEffect(() => {
    let template = prompt.prompt_template;
    Object.keys(values).forEach((key) => {
      template = template.replace(`{{${key}}}`, values[key] || `{{${key}}}`);
    });

    if (additionalInfo.trim() !== "") {
      template += `\n\nAdditional information ${additionalInfo}`;
    }

    setPreviewPrompt(template);
  }, [values, additionalInfo, prompt]);

  useEffect(()=> {
    if(responseData) {
      setLoading(false);
      navigate("/dashboard", {state: {responseData: JSON.parse(responseData)}});
    }
  }, [responseData]);

  // Manejador para actualizar los valores de las variables cuando el usuario escribe en un campo
  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value })); // Actualizar el valor de la variable específica
  };

  // Manejador para enviar el prompt construido al backend
  const handleSend = async () => {
    try {
      setLoading(true);
      setResponseData(null);

      // Realizar una solicitud POST al backend con el prompt construido y el título
      const response = await axios.post(
        "http://127.0.0.1:8000/api/analysis/request-information-agent/",
        {
          prompt: previewPrompt,
          title: prompt.title,
        }
      );

      // Almacenar la respuesta formateada (JSON stringificado) en el estado
      setResponseData(JSON.stringify(response.data.result, null, 2));
      
    } catch (error) {
      console.error(error);
      setResponseData("An error occurred while sending the prompt");
    }
  };



  // Estructura JSX para renderizar el componente
  return (
    // Contenedor principal con estilos responsivos
    <div className="resposive-big-container">
      {/* Mostrar el nombre de la categoría y el título del prompt como encabezado */}
      <h1 className="heading-2">
        {categoryName} / {prompt.title}
      </h1>
      {/* Contenedor flexible para las secciones de variables y vista previa */}
      <div className="flex flex-wrap gap-2 mt-4 max-h-dvh">
        <div className="space-y-3 border rounded-lg border-black/10 p-2 responsive-variables">
          {/* Mapear las variables del prompt para crear campos de entrada */}
          {Object.keys(prompt.variables).map((key) => (
            <div key={key}>
              <label className="block heading-4 mb-2 capitalize">{key}</label>
              <input
                type="text"
                value={values[key] || ""} // Vincular al estado, por defecto cadena vacía
                onChange={(e) => handleChange(key, e.target.value)} // Actualizar estado al cambiar
                className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder={`Enter ${key}`} // Texto de marcador de posición
              />
            </div>
          ))}
        </div>

        {/* Sección de Vista Previa */}
        <div className="rounded-lg p-6 border border-black/10 responsive-preview">
          <h2 className="heading-3 mb-4">Prompt Preview</h2>
          {/* Mostrar la plantilla del prompt con marcadores reemplazados por valores */}
          <p className="body whitespace-pre-line border rounded-lg border-black/10 p-2">
            {prompt.prompt_template.split(/({{.*?}})/g).map((part, idx) => {
              const match = part.match(/{{(.*?)}}/);
              if (match) {
                const key = match[1];
                const value = values[key] || key; // Mostrar el nombre si no hay valor
                return <strong key={idx}>{value}</strong>;
              }
              return <span key={idx}>{part}</span>;
            })}
          </p>
          {/* Campo para información adicional */}
          <div className="mt-8 mb-4">
            <label className="heading-4">Additional information</label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)} // Actualizar estado al cambiar
              className="border border-gray-300 rounded-xl mt-5 px-4 py-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Add any extra details here..."
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Sección de Botones */}
      <div className="w-full flex justify-end mt-10 gap-4">
        {/* Botón para cancelar y regresar a la página anterior */}
        <button onClick={() => navigate(-1)} className="cancel-button">
          Cancel
        </button>
        {/* Botón para enviar el análisis, deshabilitado si faltan valores */}
        <button
          onClick={handleSend}
          className={`main-button ${
            Object.keys(prompt.variables).some((key) => !values[key])
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={Object.keys(prompt.variables).some((key) => !values[key])}
        >
          Make analysis
        </button>
      </div>

      {/* Sección de Respuesta */}
      {loading && (
        <div className="absolute w-full h-dvh top-0 left-0 flex flex-col items-center justify-center bg-black/30 p-4">
          <div className="loader">
            <div className="loader__bar"></div>
            <div className="loader__bar"></div>
            <div className="loader__bar"></div>
            <div className="loader__bar"></div>
            <div className="loader__bar"></div>
            <div className="loader__ball"></div>
          </div>
          <p className="heading-3 text-white">This will take few minutes</p>
        </div>
      )}

    </div>
  );
}