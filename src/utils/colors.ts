// src/utils/colors.ts

/**
 * Safely convert hex color to rgba without causing casting errors
 */
export const withOpacity = (hex: string, opacity: number): string => {
  // Handle shorthand hex (#RGB)
  let hexColor = hex;
  if (hex.length === 4) {
    hexColor = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

/**
 * Pre-defined colors with opacity for consistent usage
 */
export const Colors = {
  primary: "#6C63FF",
  primaryLight: (opacity: number = 0.2) => withOpacity("#6C63FF", opacity),
  secondary: "#4CAF50",
  secondaryLight: (opacity: number = 0.2) => withOpacity("#4CAF50", opacity),
  accent: "#FF9800",
  accentLight: (opacity: number = 0.2) => withOpacity("#FF9800", opacity),
  info: "#2196F3",
  infoLight: (opacity: number = 0.2) => withOpacity("#2196F3", opacity),
  success: "#4CAF50",
  successLight: (opacity: number = 0.2) => withOpacity("#4CAF50", opacity),
  warning: "#FF9800",
  warningLight: (opacity: number = 0.2) => withOpacity("#FF9800", opacity),
  error: "#FF4757",
  errorLight: (opacity: number = 0.2) => withOpacity("#FF4757", opacity),
};
