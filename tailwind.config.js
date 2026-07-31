/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: '#FF8BA7',
          'pink-light': '#FFC6D3',
          lilac: '#D9BBFF',
          purple: '#9D75CB',
        },
        surface: {
          primary: '#FFFFFF',
          secondary: '#F8F5FB',
        },
        feedback: {
          success: '#10B981',
          'success-light': '#D1FAE5',
          warning: '#F59E0B',
        },
        // Shadcn Mapping
        background: '#FAFAFA',
        foreground: '#2D3748',
        card: '#FFFFFF',
        'card-foreground': '#2D3748',
        muted: '#F1F5F9',
        'muted-foreground': '#64748B',
        border: '#E2E8F0',
        destructive: '#EF4444',
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
    },
    fontFamily: {
      sans: ['PlusJakartaSans_400Regular'],
      'sans-medium': ['PlusJakartaSans_500Medium'],
      'sans-semibold': ['PlusJakartaSans_600SemiBold'],
      'sans-bold': ['PlusJakartaSans_700Bold'],
    },
  },
  plugins: [],
}
