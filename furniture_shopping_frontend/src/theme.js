import Blits from '@lightningjs/blits'

/**
 * Ocean Professional theme tokens used across the app.
 * Colors and sizes are centralized here for consistency.
 */
const theme = {
  name: 'Ocean Professional',
  colors: {
    primary: 0x2563ebff,   // #2563EB
    secondary: 0xf59e0bff, // #F59E0B
    success: 0xf59e0bff,
    error: 0xef4444ff,
    background: 0xf9fafbff,
    surface: 0xffffffff,
    text: 0x111827ff,
    textMuted: 0x6b7280ff,
    shadow: 0x00000022,
    border: 0xe5e7ebff,
  },
  // Rounded corners in Lightning are achieved with shader cornerRadius (rtc) on certain components
  // For simplicity we simulate via card masks or images; here we prefer clean rectangles
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },
  sizes: {
    headerH: 100,
    productCardW: 380,
    productCardH: 420,
    productImageH: 260,
    contentPadding: 32,
  },
  shadowAlpha: 0.15,
}

/**
 * PUBLIC_INTERFACE
 * Provide helper to draw subtle card background with shadow-like effect.
 */
export function drawCardBg({ w, h, color = theme.colors.surface, alpha = 1 }) {
  return Blits.Element({
    w, h, color, alpha,
  })
}

export default theme
