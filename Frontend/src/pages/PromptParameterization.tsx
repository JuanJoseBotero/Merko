import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/PromptParameterization.css";

interface Prompt {
  id: number;
  title: string;
  description: string;
  prompt_template: string;
  variables: Record<string, string>;
}

export default function PromptParameterizationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { prompt, categoryName } = location.state as {
    prompt: Prompt;
    categoryName: string;
  };

  const [values, setValues] = useState<Record<string, string>>({});
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [previewPrompt, setPreviewPrompt] = useState("");
  const [responseData, setResponseData] = useState<string | null>(null); // Nuevo estado para manejar la respuesta
  const [loading, setLoading] = useState(false); // Loader para mostrar el estado actual del sistema

  useEffect(() => {
    let template = prompt.prompt_template;
    Object.keys(values).forEach((key) => {
      template = template.replace(`{{${key}}}`, values[key] || `{{${key}}}`);
    });

    if (additionalInfo.trim() !== "") {
      template += `\n\nAdditional information: ${additionalInfo}`;
    }

    setPreviewPrompt(template);
  }, [values, additionalInfo, prompt]);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSend = async () => {
    try {
      setLoading(true);
      setResponseData(null);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/analysis/request-information-agent/",
        {
          prompt: previewPrompt,
          title: prompt.title,
        },
      );

      console.log("Response from backend:", response.data);
      setResponseData(JSON.stringify(response.data.result, null, 2));
    } catch (error) {
      console.error(error);
      setResponseData("An error occurred while sending the prompt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resposive-big-container">
      <h1 className="heading-2">
        {categoryName} / {prompt.title}
      </h1>
      <div className="flex flex-wrap gap-2 mt-4 max-h-dvh">
        {/* Variables */}
        <div className="space-y-3 border rounded-lg border-black/10 p-2 responsive-variables">
          {Object.keys(prompt.variables).map((key) => (
            <div key={key}>
              <label className="block heading-4 mb-2 capitalize">{key}</label>
              <input
                type="text"
                value={values[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder={`Enter ${key}`}
              />
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="rounded-lg p-6 border border-black/10 responsive-preview">
          <h2 className="heading-3 mb-4">Prompt Preview</h2>
          <p className="body whitespace-pre-line border rounded-lg border-black/10 p-2">
            {prompt.prompt_template.split(/({{.*?}})/g).map((part, idx) => {
              const match = part.match(/{{(.*?)}}/);
              if (match) {
                const key = match[1];
                const value = values[key] || key; // mostrar solo nombre si no hay valor
                return <strong key={idx}>{value}</strong>;
              }
              return <span key={idx}>{part}</span>;
            })}
          </p>
          <div className="mt-8 mb-4">
            <label className="heading-4">Additional Information</label>
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

      {/* Buttons */}
      <div className="w-full flex justify-end mt-10 gap-4">
        <button onClick={() => navigate(-1)} className="cancel-button">
          Cancel
        </button>
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

      {/* sección de Respuesta */}
      <div className="mt-10 p-6 border rounded-lg border-black/20 bg-gray-50">
        <h2 className="heading-3 mb-4">Response</h2>

        {loading && (
          <p className="text-blue-600 font-medium">
            Connecting to Agent and processing response...
          </p>
        )}

        {!loading && responseData && (
          <pre className="whitespace-pre-wrap text-sm bg-white p-4 rounded-lg border border-gray-300">
            {responseData}
          </pre>
        )}
      </div>
    </div>
  );
}
