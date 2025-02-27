export const routes = {
  // Auth routes
  auth: {
    login: '/login',
    register: '/register',
    forgotPassword: '/forgot-password',
    resetPassword: '/forgot-password',
  },

  // Main routes
  dashboard: '/',
  jobs: '/jobs',
  sources: '/sources',
  destinations: '/destinations',
  settings: '/settings',
  analytics: '/analytics',

  // Advanced features
  dataStorage: '/data-storage',
  aiInsights: '/ai-insights',
} as const

export type AppRoute = typeof routes