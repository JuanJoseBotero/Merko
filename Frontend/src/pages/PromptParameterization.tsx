import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/PromptParameterization.css";
import "../css/Icons/Loader.css";
import { Info } from "lucide-react";

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
  const [responseData, setResponseData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredVar, setHoveredVar] = useState<string | null>(null);

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

  useEffect(() => {
    if (responseData) {
      setLoading(false);
      navigate("/dashboard", { state: { responseData: JSON.parse(responseData) } });
    }
  }, [responseData]);

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
        }
      );

      setResponseData(JSON.stringify(response.data.result, null, 2));
    } catch (error) {
      console.error(error);
      setResponseData("An error occurred while sending the prompt");
    }
  };

  return (
    <div className="resposive-big-container">
      <h1 className="heading-2">
        {categoryName} / {prompt.title}
      </h1>

      <div className="flex flex-wrap gap-2 mt-4 max-h-dvh">
        <div className="space-y-3 border rounded-lg border-black/10 p-2 responsive-variables">
          {Object.keys(prompt.variables).map((key) => (
            <div key={key} className="relative mb-6">
              <label className="block heading-4 mb-2 capitalize flex items-center gap-2">
                {key}
                {/* Ícono de información */}
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

              {/* Tooltip flotante */}
              {hoveredVar === key && (
                <div className="info-card">
                  <p className="text-sm">
                    {prompt.variables[key] || "No description available"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-lg p-6 border border-black/10 responsive-preview">
          <h2 className="heading-3 mb-4">Prompt Preview</h2>
          <p className="body whitespace-pre-line border rounded-lg border-black/10 p-2">
            {prompt.prompt_template.split(/({{.*?}})/g).map((part, idx) => {
              const match = part.match(/{{(.*?)}}/);
              if (match) {
                const key = match[1];
                const value = values[key] || key;
                return <strong key={idx}>{value}</strong>;
              }
              return <span key={idx}>{part}</span>;
            })}
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
