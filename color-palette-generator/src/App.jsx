import React, { useState, useEffect } from "react";
import ColorPicker from "./components/ColorPicker";
import PaletteDisplay from "./components/PaletteDisplay";
import { ArrowDown, Sparkles, Save, Download } from "lucide-react";

function App() {
  const [baseColors, setBaseColors] = useState(["#3498db"]);
  const [palette, setPalette] = useState([]);
  const [paletteType, setPaletteType] = useState("shades");
  const [animateGenerate, setAnimateGenerate] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState([]);

  // Generate palette when component mounts
  useEffect(() => {
    generatePalette(baseColors);
  }, []);

  const generatePalette = (colors) => {
    setAnimateGenerate(true);

    setTimeout(() => {
      let newPalette = [];

      if (paletteType === "shades") {
        // Generate darker shades
        newPalette = colors.flatMap((color) => generateShades(color));
      } else if (paletteType === "tints") {
        // Generate lighter tints
        newPalette = colors.flatMap((color) => generateTints(color));
      } else if (paletteType === "analogous") {
        // Generate analogous colors
        newPalette = colors.flatMap((color) => generateAnalogous(color));
      } else if (paletteType === "complementary") {
        // Generate complementary colors
        newPalette = colors.flatMap((color) => generateComplementary(color));
      }

      setPalette(newPalette);
      setAnimateGenerate(false);
    }, 500);
  };

  const generateShades = (hex) => {
    const shades = [];
    for (let i = 0; i <= 5; i++) {
      const factor = i * 0.15;
      const shade = shadeColor(hex, -factor);
      shades.push(shade);
    }
    return shades;
  };

  const generateTints = (hex) => {
    const tints = [];
    for (let i = 0; i <= 5; i++) {
      const factor = i * 0.15;
      const tint = shadeColor(hex, factor);
      tints.push(tint);
    }
    return tints;
  };

  const generateAnalogous = (hex) => {
    const colors = [hex];
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // Generate 2 colors on each side
    for (let i = 1; i <= 2; i++) {
      // Add 30 degrees to hue for each step
      const hue1 = (hsl.h + 30 * i) % 360;
      const hue2 = (hsl.h - 30 * i + 360) % 360;

      colors.push(hslToHex(hue1, hsl.s, hsl.l));
      colors.unshift(hslToHex(hue2, hsl.s, hsl.l));
    }

    return colors;
  };

  const generateComplementary = (hex) => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    // Complementary color (opposite on color wheel)
    const complementaryHue = (hsl.h + 180) % 360;
    const complementary = hslToHex(complementaryHue, hsl.s, hsl.l);

    // Add shades and tints of both colors
    const colors = [];

    // Original color with shades/tints
    for (let i = -2; i <= 2; i++) {
      colors.push(shadeColor(hex, i * 0.15));
    }

    // Complementary color with shades/tints
    for (let i = -2; i <= 2; i++) {
      colors.push(shadeColor(complementary, i * 0.15));
    }

    return colors;
  };

  const shadeColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent * 100);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  // Helper functions for color conversions
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }

      h /= 6;
    }

    return { h: h * 360, s, l };
  };

  const hslToRgb = (h, s, l) => {
    h /= 360;
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  const hslToHex = (h, s, l) => {
    const rgb = hslToRgb(h, s, l);
    return `#${((1 << 24) | (rgb.r << 16) | (rgb.g << 8) | rgb.b)
      .toString(16)
      .slice(1)}`;
  };

  const savePalette = () => {
    const newSavedPalette = {
      id: Date.now(),
      colors: palette,
      baseColors: baseColors,
    };

    setSavedPalettes([...savedPalettes, newSavedPalette]);
  };

  const exportPalette = () => {
    const paletteData = {
      name: "My Color Palette",
      colors: palette.map((color) => ({
        hex: color,
        rgb: hexToRgb(color),
      })),
    };

    const blob = new Blob([JSON.stringify(paletteData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "color-palette.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out">
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Color Palette Generator</h1>
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="text-center text-blue-100">
            Create beautiful, harmonious color combinations
          </p>
        </header>

        <div className="p-6">
          <ColorPicker
            baseColors={baseColors}
            setBaseColors={setBaseColors}
            onGenerate={generatePalette}
            paletteType={paletteType}
            setPaletteType={setPaletteType}
          />

          <div className="flex justify-center mt-4 mb-8">
            <ArrowDown
              className={`h-8 w-8 text-blue-500 ${
                animateGenerate ? "animate-bounce" : ""
              }`}
            />
          </div>

          <div className="mb-6">
            <PaletteDisplay
              palette={palette}
              animateGenerate={animateGenerate}
            />
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
              onClick={savePalette}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Palette
            </button>

            <button
              className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-md"
              onClick={exportPalette}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Palette
            </button>
          </div>

          {savedPalettes.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-bold mb-4 text-gray-700">
                Saved Palettes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedPalettes.map((savedPalette) => (
                  <div
                    key={savedPalette.id}
                    className="bg-gray-50 p-4 rounded-lg shadow"
                  >
                    <div className="flex h-8 overflow-hidden rounded">
                      {savedPalette.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="flex-1 h-full"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <button
                        className="text-xs text-blue-500 hover:underline"
                        onClick={() => {
                          setBaseColors(savedPalette.baseColors);
                          setPalette(savedPalette.colors);
                        }}
                      >
                        Load palette
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer className="bg-gray-50 py-4 px-6 text-center text-gray-500 text-sm">
          <p>Create and share beautiful color combinations with ease</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
