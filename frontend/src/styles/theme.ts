// Helper function to lighten a color
const lightenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * percent));
  const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * percent));
  const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * percent));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

// Helper function to darken a color
const darkenColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - percent)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - percent)));
  const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

// Helper function to convert hex to rgba
const hexToRgba = (hex: string, alpha: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Helper function to get text color (dark or light) based on background
const getTextColor = (bgColor: string): string => {
  const num = parseInt(bgColor.replace('#', ''), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#2C4A52' : '#FFFFFF';
};

export interface ThemeColors {
  primary_color: string;
  background_base_color: string;
  background_surface_color: string;
  accent_color: string;
}

export const generateTheme = (colors?: Partial<ThemeColors>) => {
  const primaryColor = colors?.primary_color || '#5A9AA8';
  const backgroundBaseColor = colors?.background_base_color || '#C4DDE0';
  const backgroundSurfaceColor = colors?.background_surface_color || '#F5E6D3';
  const accentColor = colors?.accent_color || '#D4A574';

  // Generate derived colors
  const primaryLight = lightenColor(primaryColor, 0.2);
  const primaryDark = darkenColor(primaryColor, 0.15);
  const accentLight = lightenColor(accentColor, 0.15);
  const accentDark = darkenColor(accentColor, 0.15);
  const backgroundElevated = darkenColor(backgroundSurfaceColor, 0.1);

  // Generate text colors
  const textPrimary = getTextColor(backgroundBaseColor);
  const textSecondary = darkenColor(primaryColor, 0.3);
  const textTertiary = darkenColor(primaryColor, 0.5);

  return {
  colors: {
    // Palette Colors
    palette: {
      lightBlueGreen: backgroundBaseColor,
      mediumBlueGreen: primaryColor,
      paleCream: backgroundSurfaceColor,
      warmOrange: accentColor
    },
    // Primary Colors
    primary: {
      main: primaryColor,
      light: primaryLight,
      dark: primaryDark,
      gradient: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryLight} 100%)`
    },
    // Accent Colors
    accent: {
      orange: accentColor,
      orangeLight: accentLight,
      orangeDark: accentDark,
      blueGreen: backgroundBaseColor,
      blueGreenDark: darkenColor(backgroundBaseColor, 0.1)
    },
    // Background Colors
    background: {
      base: backgroundBaseColor,
      surface: backgroundSurfaceColor,
      elevated: backgroundElevated,
      overlay: hexToRgba(primaryColor, 0.85)
    },
    // Text Colors
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      tertiary: textTertiary,
      dark: textPrimary,
      onOrange: '#FFFFFF',
      onCream: getTextColor(backgroundSurfaceColor)
    },
    // Border Colors
    border: {
      default: hexToRgba(primaryColor, 0.2),
      light: hexToRgba(primaryColor, 0.1),
      medium: hexToRgba(primaryColor, 0.3),
      strong: hexToRgba(primaryColor, 0.5),
      cream: hexToRgba(accentColor, 0.2),
      creamLight: hexToRgba(accentColor, 0.1)
    },
    // Status Colors
    status: {
      success: '#6BA87A',
      successLight: '#8BC49A',
      warning: accentColor,
      warningLight: accentLight,
      error: '#C87A6A',
      errorLight: '#D89A8A'
    },
    input: {
      background: 'rgba(255, 255, 255, 0.5)',
      textColor: textPrimary,
      borderColor: hexToRgba(primaryColor, 0.3),
      borderRadius: '8px',
      shadow: `${hexToRgba(primaryColor, 0.1)} 0px 2px 4px inset`
    }
  },
  typography: {
    fontFamilies: {
      primary: 'sans-serif',
      heading: 'Inter Variable, Inter, sans-serif',
      body: 'Inter Variable, Inter, sans-serif',
      paragraph: 'Inter Variable, Inter, sans-serif'
    },
    fontSizes: {
      h1: '48px',
      h2: '32px',
      h3: '24px',
      body: '16px',
      small: '13px',
      tiny: '11px'
    },
    lineHeights: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  spacing: {
    baseUnit: 4,
    xs: '4px',
    sm: '6px',
    md: '12px',
    lg: '18px',
    xl: '24px',
    xxl: '36px'
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '50%'
  },
  colorScheme: 'light'
  };
};

// Default theme for backwards compatibility
export const theme = generateTheme();

export type Theme = ReturnType<typeof generateTheme>;

