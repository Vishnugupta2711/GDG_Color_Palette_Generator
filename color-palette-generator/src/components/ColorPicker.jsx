import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { Plus, Wand2 } from "lucide-react";

function ColorPicker({
  baseColors,
  setBaseColors,
  onGenerate,
  paletteType,
  setPaletteType,
}) {
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [showPicker, setShowPicker] = useState(false);

  const handleColorChange = (color, index) => {
    const updatedColors = [...baseColors];
    updatedColors[index] = color.hex;
    setBaseColors(updatedColors);
  };

  const addColor = () => {
    if (baseColors.length < 5) {
      setBaseColors([...baseColors, "#ffffff"]);
      setActiveColorIndex(baseColors.length);
      setShowPicker(true);
    }
  };

  const removeColor = (indexToRemove) => {
    if (baseColors.length > 1) {
      const updatedColors = baseColors.filter(
        (_, index) => index !== indexToRemove
      );
      setBaseColors(updatedColors);

      if (activeColorIndex >= updatedColors.length) {
        setActiveColorIndex(updatedColors.length - 1);
      }
    }
  };

  const toggleColorPicker = (index) => {
    setActiveColorIndex(index);
    setShowPicker(!showPicker || activeColorIndex !== index);
  };

  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  const generateRandomPalette = () => {
    const randomColors = baseColors.map(() => getRandomColor());
    setBaseColors(randomColors);
    onGenerate(randomColors);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Base Colors
        </h2>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          {baseColors.map((color, index) => (
            <div key={index} className="relative group">
              <button
                className={`h-12 w-12 rounded-full border-2 transition-all duration-300 transform hover:scale-110 ${
                  activeColorIndex === index && showPicker
                    ? "border-blue-500 shadow-lg scale-110"
                    : "border-gray-200"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => toggleColorPicker(index)}
                aria-label={`Select color ${index + 1}`}
              />

              {baseColors.length > 1 && (
                <button
                  className="absolute -top-2 -right-2 bg-red-500 text-white h-5 w-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeColor(index);
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {baseColors.length < 5 && (
            <button
              className="h-12 w-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-all duration-300"
              onClick={addColor}
              aria-label="Add color"
            >
              <Plus className="h-6 w-6" />
            </button>
          )}

          <button
            className="ml-4 h-10 px-3 flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:shadow-lg transition-all duration-300"
            onClick={generateRandomPalette}
          >
            <Wand2 className="h-4 w-4 mr-1" />
            Random
          </button>
        </div>

        {showPicker && (
          <div className="mb-4 animate-fade-in transition-all duration-300">
            <div className="relative">
              <div className="absolute z-10 -top-2 left-1/2 transform -translate-x-1/2">
                <div className="bg-white p-2 rounded-lg shadow-xl border border-gray-100">
                  <SketchPicker
                    color={baseColors[activeColorIndex]}
                    onChange={(c) => handleColorChange(c, activeColorIndex)}
                    disableAlpha
                  />
                </div>
              </div>
            </div>
            <div className="h-64"></div> {/* Spacer for the color picker */}
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Palette Type
          </h3>
          <div className="flex flex-wrap gap-2">
            {["shades", "tints", "analogous", "complementary"].map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-lg capitalize transition-all duration-300 ${
                  paletteType === type
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setPaletteType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          onClick={() => onGenerate(baseColors)}
        >
          <Wand2 className="h-5 w-5 mr-2" />
          Generate Palette
        </button>
      </div>
    </div>
  );
}

export default ColorPicker;
