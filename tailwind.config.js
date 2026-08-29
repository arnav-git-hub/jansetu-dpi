/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // JanSetu Civic System Design System Palette (from DESIGN.md)
        "background": "#071327",
        "surface": "#071327",
        "surface-dim": "#071327",
        "surface-bright": "#2e394f",
        "surface-container-lowest": "#030e22",
        "surface-container-low": "#101b30",
        "surface-container": "#142034",
        "surface-container-high": "#1f2a3f",
        "surface-container-highest": "#2a354b",
        "surface-variant": "#2a354b",
        "surface-tint": "#ffb780",
        
        "on-surface": "#d7e2ff",
        "on-surface-variant": "#d8c2b5",
        "on-background": "#d7e2ff",
        "inverse-surface": "#d7e2ff",
        "inverse-on-surface": "#263046",
        
        "primary": "#ffc499",
        "on-primary": "#4e2600",
        "primary-container": "#f4a261",
        "on-primary-container": "#6f3800",
        "inverse-primary": "#8e4e14",
        "primary-fixed": "#ffdcc4",
        "primary-fixed-dim": "#ffb780",
        "on-primary-fixed": "#2f1400",
        "on-primary-fixed-variant": "#6f3800",

        "secondary": "#6fd8c8",
        "on-secondary": "#003731",
        "secondary-container": "#30a193",
        "on-secondary-container": "#00302a",
        "secondary-fixed": "#8cf5e4",
        "secondary-fixed-dim": "#6fd8c8",
        "on-secondary-fixed": "#00201c",
        "on-secondary-fixed-variant": "#005048",

        "tertiary": "#3aeab3",
        "on-tertiary": "#003827",
        "tertiary-container": "#00cd99",
        "on-tertiary-container": "#00513a",
        "tertiary-fixed": "#54fdc4",
        "tertiary-fixed-dim": "#27e0a9",
        "on-tertiary-fixed": "#002116",
        "on-tertiary-fixed-variant": "#00513b",

        "error": "#ffb4ab",
        "on-error": "#690005",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6",

        "outline": "#a08d80",
        "outline-variant": "#534439",

        // Backward compatibility tokens
        india: {
          saffron: '#f4a261',
          navy: '#071327',
          green: '#00cd99',
          ashoka: '#30a193',
        },
        gov: {
          blue: '#142034',
          dark: '#071327',
          slate: '#101b30',
          card: '#1b263b',
          accent: '#6fd8c8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        headline: ['Public Sans', 'Inter', 'sans-serif'],
        'display-lg': ['Public Sans', 'sans-serif'],
        'headline-lg': ['Public Sans', 'sans-serif'],
        'headline-lg-mobile': ['Public Sans', 'sans-serif'],
        'title-md': ['Public Sans', 'sans-serif'],
        'body-lg': ['Inter', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'label-sm': ['Inter', 'sans-serif'],
      },
      spacing: {
        base: '4px',
        gutter: '24px',
        'margin-mobile': '16px',
        'margin-desktop': '32px',
        'container-max': '1440px',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.25rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      }
    },
  },
  plugins: [],
}
