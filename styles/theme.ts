export type Theme = 'light' | 'dark'

export const theme = {
  light: {
    background: 'bg-white',
    text: 'text-gray-900',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-100',
    muted: 'text-gray-500',
  },
  dark: {
    background: 'bg-gray-900',
    text: 'text-gray-100',
    border: 'border-gray-800',
    hover: 'hover:bg-gray-800',
    muted: 'text-gray-400',
  },
} as const

