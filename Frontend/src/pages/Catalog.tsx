import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function Catalog() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/catalog/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div className="space-y-8 resposive-big-container">
      <h1 className="heading-1 font-bold">New Analysis</h1>
      <div className="responsive-grid">
        {categories.map((cat) => (
          <div
            className="bg-white p-8 rounded-2xl shadow flex flex-col justify-between gap-6"
            key={cat.id}
          >
            <h2 className="heading-2">{cat.name}</h2>
            <p className="body">{cat.description}</p>
            <Link
              className="main-button"
              to="/catalog/prompt-list"
              state={{ categoryId: cat.id, categoryName: cat.name }}
            >
              View Prompts
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
