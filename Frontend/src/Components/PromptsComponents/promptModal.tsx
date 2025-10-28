// src/components/PromptDashboardModal.tsx
import { useState } from "react";

interface PromptDashboardModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function PromptDashboardModal({
  onClose,
  onConfirm,
}: PromptDashboardModalProps) {
  const [formData, setFormData] = useState({
    product_type: "",
    top_x_number: "",
    time_period: "",
    category: "",
    additional_info: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      {/* Modal */}
      <div className="bg-white rounded-xl w-[90%] max-w-4xl shadow-xl p-8 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="heading-2 font-bold">Prompts Editor</h2>
          <p className="text-gray-500 text-sm">1/5</p>
        </div>

        {/* Subheader */}
        <h3 className="text-lg font-semibold mb-6">
          Import Analysis / Import Analyzer by Product and Period
        </h3>

        {/* Formulario */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Product type</label>
              <input
                name="product_type"
                value={formData.product_type}
                onChange={handleChange}
                placeholder="Enter product_type"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Top x number</label>
              <input
                name="top_x_number"
                value={formData.top_x_number}
                onChange={handleChange}
                placeholder="Enter top_x_number"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Time period</label>
              <input
                name="time_period"
                value={formData.time_period}
                onChange={handleChange}
                placeholder="Enter time_period"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Category</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter category"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Vista previa */}
          <div className="border border-gray-300 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Prompt Preview</h4>
            <p className="text-gray-700 text-sm">
              Analyze the market for <b>{formData.product_type || "product_type"}</b> and provide a
              detailed breakdown of the <b>{formData.top_x_number || "top_x_number"}</b> major
              importers over the last <b>{formData.time_period || "time_period"}</b>. For each
              importer, identify the specific product types they import within the category{" "}
              <b>{formData.category || "category"}</b>.
            </p>

            <div className="mt-4">
              <label className="block text-sm font-medium">
                Additional information
              </label>
              <textarea
                name="additional_info"
                value={formData.additional_info}
                onChange={handleChange}
                placeholder="Add any extra details here..."
                className="border border-gray-300 rounded-lg px-3 py-2 w-full mt-2 h-24 focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-yellow-800 bg-yellow-100 px-4 py-2 rounded-lg text-sm font-medium">
            Make sure to put the correct information, you couldn’t go back
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
