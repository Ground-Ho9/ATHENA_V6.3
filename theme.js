/**
 * ATHENA UI THEME – Olympus Visual Directive
 * Centralized color, font, and layout values for tactical consistency.
 */

export const theme = {
  colors: {
    background: '#1C1C1E',     // Deep smoke gray
    surface: '#2C2C2E',        // Cards, modal backgrounds
    primary: '#ED1C24',        // Tactical red
    secondary: '#3A3A3C',      // Secondary nav/tabs
    text: '#E5E5E7',           // Main interface text
    subdued: '#A1A1A3',        // Soft text (timestamps, meta)
    placeholder: '#6C6C6D',    // Form ghost text
    danger: '#FF453A',         // Delete, cancel, alert
    success: '#32D74B'         // Success, confirm
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  fontSizes: {
    xxs: 10,
    xs: 12,
    sm: 14,
    base: 16,
    md: 18,
    lg: 22,
    xl: 28,
    xxl: 36
  },
  fonts: {
    base: 'System',         // Replace with 'SpaceMono' or custom if needed
    mono: 'Courier New'     // Mono for terminal/classified text blocks
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14
  },
  shadows: {
    light: {
      elevation: 2
    },
    medium: {
      elevation: 4
    },
    heavy: {
      elevation: 8
    }
  }
};