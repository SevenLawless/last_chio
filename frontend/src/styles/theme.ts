export const theme = {
  colors: {
    // Palette Colors from Image
    palette: {
      lightBlueGreen: '#C4DDE0',    // Top band - muted pale sky/clear water
      mediumBlueGreen: '#5A9AA8',   // Second band - ocean water
      paleCream: '#F5E6D3',         // Third band - sand/light beige
      warmOrange: '#D4A574'         // Bottom band - terracotta/sunset
    },
    // Primary Colors (using medium blue-green as primary)
    primary: {
      main: '#5A9AA8',              // Medium blue-green
      light: '#7BB5C2',             // Lighter variant
      dark: '#4A7A85',              // Darker variant
      gradient: 'linear-gradient(135deg, #5A9AA8 0%, #7BB5C2 100%)'
    },
    // Accent Colors
    accent: {
      orange: '#D4A574',            // Warm orange for secondary actions
      orangeLight: '#E4B894',       // Lighter orange
      orangeDark: '#B8955A',        // Darker orange
      blueGreen: '#C4DDE0',         // Light blue-green accent
      blueGreenDark: '#A8C4C8'      // Slightly darker variant
    },
    // Background Colors
    background: {
      base: '#C4DDE0',              // Light blue-green - main app background
      surface: '#F5E6D3',           // Pale cream - cards, panels
      elevated: '#E8D4BC',          // Slightly darker cream - elevated surfaces
      overlay: 'rgba(90, 154, 168, 0.85)' // Medium blue-green overlay for modals
    },
    // Text Colors (dark for contrast on light backgrounds)
    text: {
      primary: '#2C4A52',            // Dark blue-green for primary text
      secondary: '#5A7A85',         // Medium blue-green for secondary text
      tertiary: '#8A9A9F',          // Lighter blue-green for tertiary text
      dark: '#2C4A52',              // Dark text
      onOrange: '#FFFFFF',          // White text on orange backgrounds
      onCream: '#4A5A5F'            // Dark text on cream backgrounds
    },
    // Border Colors
    border: {
      default: 'rgba(90, 154, 168, 0.2)',   // Medium blue-green with opacity
      light: 'rgba(90, 154, 168, 0.1)',     // Lighter border
      medium: 'rgba(90, 154, 168, 0.3)',    // Medium border
      strong: 'rgba(90, 154, 168, 0.5)',    // Strong border
      cream: 'rgba(212, 165, 116, 0.2)',    // Orange border variant
      creamLight: 'rgba(212, 165, 116, 0.1)' // Light orange border
    },
    // Status Colors (harmonized with palette)
    status: {
      success: '#6BA87A',           // Green that complements blue-green
      successLight: '#8BC49A',
      warning: '#D4A574',           // Warm orange for warnings
      warningLight: '#E4B894',
      error: '#C87A6A',            // Muted red-orange that works with palette
      errorLight: '#D89A8A'
    },
    input: {
      background: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
      textColor: '#2C4A52',                    // Dark text
      borderColor: 'rgba(90, 154, 168, 0.3)',
      borderRadius: '8px',
      shadow: 'rgba(90, 154, 168, 0.1) 0px 2px 4px inset'
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

export type Theme = typeof theme;

