import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../css/PromptParameterization.css';

interface Prompt {
  id: number;
  title: string;
  description: string;
  prompt_template: string;
  variables: Record<string, string>;
}

const PromptParameterizationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prompt, categoryName } = location.state as {
    prompt: Prompt;
    categoryName: string;
  };

  const [values, setValues] = useState<Record<string, string>>({});
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [previewPrompt, setPreviewPrompt] = useState("");

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
    const response = await fetch("", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: previewPrompt
      }),
    });

    if (!response.ok) throw new Error("Error sending analysis");

    const data = await response.json();
    console.log("Response from backend:", data);
    setPreviewPrompt(data.result || "No response received");
  } catch (error) {
      console.error(error);
      setPreviewPrompt("An error occurred while sending the prompt");
    }
};

  return (
    <div className="resposive-big-container">
      <h1 className="heading-1">{categoryName} / {prompt.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">

        {/* Variables */}
        <div className="space-y-5 border rounded-lg border-black/10 p-2 responsive-variables">
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
        <div className="rounded-2xl p-6 border border-black/10">
          <h2 className="heading-2 mb-4">Prompt Preview</h2>
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
              <label className="heading-3">Additional Information</label>
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
        <button onClick={() => navigate(-1)}className="cancel-button">
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
    </div>
  );
};

export default PromptParameterizationPage;
