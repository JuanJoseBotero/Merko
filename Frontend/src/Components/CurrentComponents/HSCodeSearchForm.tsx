import { useState, useEffect } from "react";
import axios from "axios";

export default function HSCodeSearchForm({ onSelect }: { onSelect: (code: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ hscode: string; description: string }[]>([]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      axios
        .get("http://127.0.0.1:8000/api/analysis/search-hs/", { params: { q: query } })
        .then((res) => setResults(res.data))
        .catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) {
      alert("Please select a product from the list before continuing.");
      return;
    }
    const hsCode = query.split(" - ")[0];
    if (!hsCode) {
      alert("Please select a product from the list before continuing.");
      return;
    }
    onSelect(hsCode);
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "center", marginBottom: "2rem" }}>
      <h2 style={{ fontWeight: "bold", fontSize: "1.5rem" }}>Select Product</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        list="hs-options"
        placeholder="Type product name (e.g., Coffee)"
        style={{
          padding: "0.6rem",
          width: "60%",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "1rem",
        }}
      />
      <datalist id="hs-options">
        {results.map((item) => (
          <option key={item.hscode} value={`${item.hscode} - ${item.description}`} />
        ))}
      </datalist>
      <br />
      <button
        type="submit"
        style={{
          marginTop: "1rem",
          padding: "0.6rem 1.5rem",
          borderRadius: "8px",
          backgroundColor: "#007bff",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Load Dashboard
      </button>
    </form>
  );
}
