type ColorRGB = { r: number; g: number; b: number };
type ColorHSL = { h: number; s: number; l: number };
type ColorOKLCH = { l: number; c: number; h: number };
type CSSVariable = { name: string; value: string };

/**
 * Converts an sRGB color (0–255) to OKLCH.
 * @param rgb - Object containing r, g, b in range [0, 255]
 * @returns OKLCH color with l in [0,1], c >= 0, h in degrees [0–360)
 */
function rgbToOKLCH({ r, g, b }: ColorRGB): ColorOKLCH {
  function srgbToLinear(c: number): number {
    const cs = c / 255;
    return cs <= 0.04045 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
  }

  const rLinear = srgbToLinear(r);
  const gLinear = srgbToLinear(g);
  const bLinear = srgbToLinear(b);

  const l =
    0.4122214708 * rLinear + 0.5363325363 * gLinear + 0.0514459929 * bLinear;
  const m =
    0.2119034982 * rLinear + 0.6806995451 * gLinear + 0.1073969566 * bLinear;
  const s =
    0.0883024619 * rLinear + 0.2817188376 * gLinear + 0.6299787005 * bLinear;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(A * A + B * B);
  let H = Math.atan2(B, A) * (180 / Math.PI);
  if (H < 0) H += 360;

  return { l: L, c: C, h: H };
}

/**
 * Converts an OKLCH color to sRGB.
 * @param oklch - Object containing lightness (l), chroma (c), and hue (h in degrees)
 * @returns RGB object with r, g, b in [0, 255]
 */
function oklchToRGB({ l, c, h }: ColorOKLCH): ColorRGB {
  const hRad = (h * Math.PI) / 180;

  const L = l;
  const A = Math.cos(hRad) * c;
  const B = Math.sin(hRad) * c;

  const l_ = L + 0.3963377774 * A + 0.2158037573 * B;
  const m_ = L - 0.1055613458 * A - 0.0638541728 * B;
  const s_ = L - 0.0894841775 * A - 1.291485548 * B;
  const lCubed = l_ ** 3;
  const mCubed = m_ ** 3;
  const sCubed = s_ ** 3;

  const rLinear =
    4.0767416621 * lCubed - 3.3077115913 * mCubed + 0.2309699292 * sCubed;
  const gLinear =
    -1.2684380046 * lCubed + 2.6097574011 * mCubed - 0.3413193965 * sCubed;
  const bLinear =
    -0.0041960863 * lCubed - 0.7034186147 * mCubed + 1.707614701 * sCubed;

  function linearToSRGBChannel(channel: number): number {
    const clamped = Math.max(0, Math.min(1, channel));
    const gammaCorrected =
      clamped <= 0.0031308
        ? 12.92 * clamped
        : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
    return Math.round(gammaCorrected * 255);
  }

  return {
    r: linearToSRGBChannel(rLinear),
    g: linearToSRGBChannel(gLinear),
    b: linearToSRGBChannel(bLinear),
  };
}

function hexToRGB(colorHex: string): ColorRGB {
  const hexExp = /^#([\da-f]{3}){1,2}$/i;
  let color = { r: 0, g: 0, b: 0 };

  if (hexExp.test(colorHex)) {
    if (colorHex.length === 4) {
      color = {
        r: parseInt(colorHex[1] + colorHex[1], 16),
        g: parseInt(colorHex[2] + colorHex[2], 16),
        b: parseInt(colorHex[3] + colorHex[3], 16),
      };
    }
    if (colorHex.length === 7) {
      color = {
        r: parseInt(colorHex[1] + colorHex[2], 16),
        g: parseInt(colorHex[3] + colorHex[4], 16),
        b: parseInt(colorHex[5] + colorHex[6], 16),
      };
    }
  }

  return color;
}

function rgbToHSL(ColorRGB: ColorRGB): ColorHSL {
  const r = ColorRGB.r / 255;
  const g = ColorRGB.g / 255;
  const b = ColorRGB.b / 255;

  const cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin;
  let h = 0,
    s = 0,
    l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h: h, s: s, l: l };
}

/**
 * Generate a color palette from a base OKLCH color.
 * @returns An array of OKLCH colors, from lightest (index 0) to darkest
 */
function generateColorPalette(
  baseColorOKLCH: ColorOKLCH,
  steps = 11,
  chromaShift = 0,
  lightnessMin = 0.1,
  lightnessMax = 0.9
): ColorOKLCH[] {
  const lightnessStep = (lightnessMin - lightnessMax) / (steps - 1);
  const lightnessRange = Array.from(
    { length: steps },
    (_, i) => lightnessMax + i * lightnessStep
  );

  const baseColorIndex = lightnessRange.reduce((closestIdx, value, idx) => {
    return Math.abs(value - baseColorOKLCH.l) <
      Math.abs(lightnessRange[closestIdx] - baseColorOKLCH.l)
      ? idx
      : closestIdx;
  }, 0);

  const colorPalette: ColorOKLCH[] = [];

  for (let i = 0; i < steps; i++) {
    const maxDistanceFromCenter = Math.floor(steps * 0.5);
    const distanceFromCenter = Math.abs(i - maxDistanceFromCenter);
    const baseColorIndexOffset = i - baseColorIndex;

    const newLightness = Math.min(
      Math.max(baseColorOKLCH.l + baseColorIndexOffset * lightnessStep, 0),
      1
    );

    const chromaAttenuationAtEdges =
      1 - Math.pow(distanceFromCenter * (1 / (maxDistanceFromCenter + 1)), 3);
    const newChroma = Math.min(
      Math.max((baseColorOKLCH.c + chromaShift) * chromaAttenuationAtEdges, 0),
      1
    );

    colorPalette.push({
      l: newLightness,
      c: newChroma,
      h: baseColorOKLCH.h,
    });
  }

  return colorPalette;
}

function softClamp(v: number, threshold = 0.15, strength = 10) {
  if (v <= threshold) return v;
  const delta = v - threshold;
  return threshold + delta / (1 + strength * delta);
}

function variableValue(colorOKLCH: ColorOKLCH): string {
  const colorHSL = rgbToHSL(oklchToRGB(colorOKLCH));
  return `${colorHSL.h}, ${colorHSL.s}%, ${colorHSL.l}%`;
}

export default function generateThemeColors(ColorHEX: string): CSSVariable[] {
  const colorOKLCH = rgbToOKLCH(hexToRGB(ColorHEX));

  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const accents = [100, 200, 300, 400];

  const colorPalette = generateColorPalette(colorOKLCH, shades.length);
  const accentColorPalette = generateColorPalette(
    colorOKLCH,
    accents.length,
    colorOKLCH.c < 0.001 ? 0 : -(colorOKLCH.c - softClamp(colorOKLCH.c + 0.1)),
    0.4,
    0.95
  );

  const primaryVars = shades.map((value, index) => ({
    name: `--colorPrimary${value.toString().padStart(3, "0")}`,
    value: variableValue(colorPalette[index]),
  }));

  const accentVars = accents.map((value, index) => ({
    name: `--colorPrimary${value.toString().padStart(3, "0")}A`,
    value: variableValue(accentColorPalette[index]),
  }));

  return [...primaryVars, ...accentVars];
}
