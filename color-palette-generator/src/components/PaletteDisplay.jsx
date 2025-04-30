import React, { useState } from "react";
import { Copy, Check, Eye, EyeOff } from "lucide-react";

function PaletteDisplay({ palette, animateGenerate }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or strip

  const copyToClipboard = (hex, index) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Determine if text color should be light or dark based on background
  const getContrastColor = (hexColor) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  if (palette.length === 0) {
    return (
      <div className="text-center text-gray-500">No colors generated yet</div>
    );
  }

  return (
    <div className="transition-all duration-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Generated Palette
        </h2>
        <button
          className="flex items-center text-sm text-gray-600 hover:text-blue-500 transition-colors"
          onClick={() => setViewMode(viewMode === "grid" ? "strip" : "grid")}
        >
          {viewMode === "grid" ? (
            <>
              <Eye className="h-4 w-4 mr-1" />
              View as Strip
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              View as Grid
            </>
          )}
        </button>
      </div>

      {viewMode === "strip" && (
        <div className="h-24 rounded-lg overflow-hidden flex mb-6 shadow-md">
          {palette.map((color, index) => (
            <div
              key={index}
              className="flex-1 cursor-pointer transition-all duration-300 flex items-center justify-center hover:flex-[1.5]"
              style={{
                backgroundColor: color,
                color: getContrastColor(color),
              }}
              onClick={() => copyToClipboard(color, index)}
            >
              <span className="font-mono text-xs opacity-70 hover:opacity-100 transition-opacity">
                {color}
              </span>
            </div>
          ))}
        </div>
      )}

      {viewMode === "grid" && (
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${
            animateGenerate ? "animate-pulse" : ""
          }`}
        >
          {palette.map((color, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              <div
                className="h-32 flex items-center justify-center"
                style={{ backgroundColor: color }}
              ></div>

              <div className="p-3 bg-white border-t flex justify-between items-center">
                <span className="font-mono text-sm" style={{ color: color }}>
                  {color}
                </span>

                <button
                  className="rounded-full p-1 text-gray-500 hover:text-blue-500 hover:bg-gray-100 transition-colors"
                  onClick={() => copyToClipboard(color, index)}
                  aria-label="Copy color code"
                >
                  {copiedIndex === index ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              <style jsx>{`
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaletteDisplay;
