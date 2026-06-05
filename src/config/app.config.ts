/**
 * app.config.ts
 * ─────────────────────────────────────────────────────────────────
 * Central application configuration constants for PIXEL.
 */

export const APP_CONFIG = {
  /** Short name shown on the home-screen icon label. */
  name: 'PIXEL',

  /** Full name shown in the browser tab, install prompt, and splash screen. */
  fullName: 'PIXEL — The Digital Revolution',

  /** One-line description used in the web app manifest and meta tags. */
  description:
    'PIXEL is the native cryptocurrency token of Pixels, a farming and social simulation game built on the Ronin Network.',

  /**
   * Primary brand colour
   */
  themeColor: '#0a0e1a',

  /**
   * Application Theme Tokens
   */
  COLORS: {
    primary: '#00d4ff', // Neon cyan
    primaryDark: '#3b82f6', // Electric blue
    accent: '#8b5cf6', // Vivid violet
    accentDark: '#d946ef', // Neon magenta
    surface: {
      50: '#1f2937',
      100: '#111827',
      200: '#030712',
    },
    shadow: 'rgba(0, 212, 255, 0.15)',
  },

  /** Application Version */
  version: '1.0.0',

  /** Platform deposit wallet addresses — users send USDT here, then upload proof. */
  DEPOSIT_ADDRESSES: {
    BEP20: '0x274A4D9EB67B54E228665294ED51B916D1b94139',
    TRC20: 'TYrk1uoMZLj5HW2gLeFCXF1RNtzsNUaX1q',
  } as Record<'BEP20' | 'TRC20', string>,

  /** Navigation Links */
  NAV_LINKS: [
    { name: 'About', href: '#about' },
    { name: 'Investment', href: '#investment' },
    { name: 'Withdrawal', href: '#withdrawal' },
    { name: 'Referral', href: '#referral' },
    { name: 'Network', href: '#network' },
  ],
} as const;
