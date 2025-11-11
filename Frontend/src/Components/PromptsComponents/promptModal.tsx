import { useState, useEffect } from "react";
import axios from "axios";
import { Info, ChevronRight } from "lucide-react";
import "../../css/PromptParameterization.css";
import "../../css/Icons/Loader.css";
import { useNavigate } from "react-router-dom";

interface Prompt {
  id: number;
  title: string;
  description: string;
  prompt_template: string;
  variables: Record<string, string>;
}

interface PromptModalProps {
  prompts: { id: number }[]; // solo ids seleccionados
  onClose: () => void;
}


export default function PromptModal({ prompts, onClose }: PromptModalProps) {
  const [promptList, setPromptList] = useState<Prompt[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [previewPrompt, setPreviewPrompt] = useState("");
  const [hoveredVar, setHoveredVar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dashboardName, setDashboardName] = useState("");
  const [accumulatedResults, setAccumulatedResults] = useState<any[]>([]);
  const [accumulatedUsedPrompts, setAccumulatedUsedPrompts] = useState<any[]>([]);


  const navigate = useNavigate();


  const currentPrompt = promptList[currentIndex];

  // Cargar datos completos de los prompts desde el backend
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const responses = await Promise.all(
          prompts.map((p) =>
            axios.get(`http://34.31.138.222:8000/api/catalog/prompts/${p.id}/`)
          )
        );
        setPromptList(responses.map((r) => r.data));
      } catch (error) {
        console.error("Error fetching prompts:", error);
      }
    };
    fetchPrompts();
  }, [prompts]);

  // Actualizar vista previa
  useEffect(() => {
    if (!currentPrompt) return;
    let template = currentPrompt.prompt_template;
    Object.keys(values).forEach((key) => {
      template = template.replace(`{{${key}}}`, values[key] || `{{${key}}}`);
    });
    if (additionalInfo.trim() !== "") {
      template += `\n\nAdditional information ${additionalInfo}`;
    }
    setPreviewPrompt(template);
  }, [values, additionalInfo, currentPrompt]);

  // Manejo de cambios
  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  // Guardar y pasar al siguiente prompt
  const handleNext = async () => {
  if (!currentPrompt) return;

  const isLast = currentIndex === promptList.length - 1;
  const username = localStorage.getItem("username"); 

  const payload = {
    prompt: previewPrompt,
    title: currentPrompt.title,
    prompt_id: currentPrompt.id,
    variables: values,
    last_prompt: false, 
    dashboard_name: dashboardName,
  };

  try {
    setLoading(true);
    const response = await axios.post(
      "http://34.31.138.222:8000/api/analysis/request-information-agent/",
      payload,
    );
    setLoading(false);

    // Añadir respuesta actual al acumulado
    const currentResult = response.data.result; // según cómo respondas backend
    setAccumulatedResults(prev => [...prev, currentResult]);
    setAccumulatedUsedPrompts(prev => [...prev, currentPrompt.title]);


    if (isLast) {
      // Cuando es el último prompt, enviar todo el acumulado para crear dashboard
      const savePayload = {
        dashboard_name: dashboardName,
         // acumulado + último
        diagrams: [...accumulatedResults, currentResult], 
        usedPrompts: [...accumulatedUsedPrompts,currentPrompt.title],
        username:username
      };
      console.log("Saving dashboard with payload:", savePayload);
      const dashboard_response = await axios.post(
        "http://34.31.138.222:8000/api/analysis/save-dashboard/",
        savePayload,
      );
      onClose();
      navigate("/dashboard", { state: { data: dashboard_response.data } });
    } else {
      // Limpiar inputs y avanzar
      setValues({});
      setAdditionalInfo("");
      setHoveredVar(null);
      setCurrentIndex(prev => prev + 1);
    }
  } catch (error) {
    console.error("Error sending prompt:", error);
    setLoading(false);
  }
};


  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm p-4">
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
    );
  }

  if (promptList.length === 0) return null;
  const isLast = currentIndex === promptList.length - 1;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded-2xl shadow-xl max-w-6xl w-[90%] h-[90vh] overflow-auto relative"
        onClick={(e) => e.stopPropagation()} // evitar cierre accidental
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h1 className="heading-2">
            {currentPrompt.title}
          </h1>
          <span className="text-gray-500 font-medium">
            {currentIndex + 1} / {promptList.length}
          </span>
        </div>

        {/* Variables */}
        <div className="flex flex-wrap gap-2 max-h-[75vh] overflow-y-auto">
          <div className="space-y-3 border rounded-lg border-black/10 p-2 flex-1 min-w-[280px]">
            {Object.keys(currentPrompt.variables).map((key) => (
              <div key={key} className="relative mb-6">
                <label className="block heading-4 mb-2 capitalize flex items-center gap-2">
                  {key}
                  <Info
                    size={18}
                    className="text-gray-500 cursor-pointer hover:text-blue-400 transition"
                    onMouseEnter={() => setHoveredVar(key)}
                    onMouseLeave={() => setHoveredVar(null)}
                  />
                </label>
                <input
                  type="text"
                  value={values[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder={`Enter ${key}`}
                />
                {hoveredVar === key && (
                  <div className="info-card">
                    <p className="text-sm">
                      {currentPrompt.variables[key] ||
                        "No description available"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="rounded-lg p-6 border border-black/10 flex-1 min-w-[280px]">
            <h2 className="heading-3 mb-4">Prompt Preview</h2>
            <p className="body whitespace-pre-line border rounded-lg border-black/10 p-2">
              {currentPrompt.prompt_template.split(/({{.*?}})/g).map(
                (part, idx) => {
                  const match = part.match(/{{(.*?)}}/);
                  if (match) {
                    const key = match[1];
                    const value = values[key] || key;
                    return <strong key={idx}>{value}</strong>;
                  }
                  return <span key={idx}>{part}</span>;
                }
              )}
            </p>
            <div className="mt-8 mb-4">
              <label className="heading-4">Additional information</label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="border border-gray-300 rounded-xl mt-5 px-4 py-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Add any extra details here..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full mt-8 pt-4 flex items-center justify-between gap-4">
          {/* Mensaje de advertencia */}
          <div className="flex items-center gap-3 bg-yellow-100 text-yellow-800 text-sm p-3 rounded-md mt-4">
            <span>Make sure to put the correct information. You couldn’t go back.</span>

            
          </div>
          {isLast && (
              <input
                type="text"
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                placeholder="Enter dashboard name"
                className="ml-auto border border-yellow-400 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            )}
          {/* Botones */}
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="h-12 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleNext}
              disabled={Object.keys(currentPrompt.variables).some((key) => !values[key]) ||
                (isLast && dashboardName.trim() === "")
              }
              className={`h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all flex items-center gap-2 ${
                Object.keys(currentPrompt.variables).some((key) => !values[key])
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
