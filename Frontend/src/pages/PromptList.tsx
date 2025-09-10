import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
      .then((res) => res.json())
      .then((data) => setPrompts(data))
      .catch((err) => console.error(err));
  }, [categoryId]);

  return (
    <div className="resposive-big-container">
      <h1 className="heading-1">{categoryName}</h1>

      <div className="mt-6 space-y-4">
        {prompts.map((p) => (
          <button
            key={p.id}
            onClick={() =>
              navigate("/catalog/prompt-list/prompt-parameterization", {
                state: { prompt: p, categoryName },
              })
            }
            className="w-full text-left p-4 rounded-lg border bg-white hover:bg-blue-50 transition"
          >
            <h2 className="heading-2">{p.title}</h2>
            <p className="body">{p.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptListPage;
