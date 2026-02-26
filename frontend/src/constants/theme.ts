/**
 * Theme Configuration
 * 
 * To change the main theme color, edit the PRIMARY_COLOR below.
 * The system will automatically apply it throughout the application.
 * 
 * Available presets:
 * - Blue: { r: 37, g: 99, b: 235 }
 * - Green: { r: 22, g: 163, b: 74 }
 * - Purple: { r: 147, g: 51, b: 234 }
 * - Red: { r: 220, g: 38, b: 38 }
 * - Orange: { r: 234, g: 88, b: 12 }
 * - Teal: { r: 20, g: 184, b: 166 }
 * - Indigo: { r: 99, g: 102, b: 241 }
 * 
 * Or use any custom RGB values!
 */

export const PRIMARY_COLOR = {
  r: 130, 
  g: 18, 
  b: 87
};

// Auto-calculate hover/darker shade (reduce each channel by ~25%)
export const PRIMARY_COLOR_HOVER = {
  r: Math.floor(PRIMARY_COLOR.r * 0.75),
  g: Math.floor(PRIMARY_COLOR.g * 0.75),
  b: Math.floor(PRIMARY_COLOR.b * 0.75)
};

// Auto-calculate light shade (for backgrounds)
export const PRIMARY_COLOR_LIGHT = {
  r: Math.floor(PRIMARY_COLOR.r + (255 - PRIMARY_COLOR.r) * 0.9),
  g: Math.floor(PRIMARY_COLOR.g + (255 - PRIMARY_COLOR.g) * 0.9),
  b: Math.floor(PRIMARY_COLOR.b + (255 - PRIMARY_COLOR.b) * 0.9)
};

// Export as CSS custom property format (space-separated RGB)
export const getThemeColors = () => ({
  primary: `${PRIMARY_COLOR.r} ${PRIMARY_COLOR.g} ${PRIMARY_COLOR.b}`,
  primaryHover: `${PRIMARY_COLOR_HOVER.r} ${PRIMARY_COLOR_HOVER.g} ${PRIMARY_COLOR_HOVER.b}`,
  primaryLight: `${PRIMARY_COLOR_LIGHT.r} ${PRIMARY_COLOR_LIGHT.g} ${PRIMARY_COLOR_LIGHT.b}`,
});
