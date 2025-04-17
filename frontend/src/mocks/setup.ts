import { worker } from './browser'

export async function setupMockApi() {
  if (import.meta.env.DEV && import.meta.env.VITE_APP_AUTH_MOCK === 'true') {
    try {
      await worker.start({
        onUnhandledRequest: 'bypass',
        quiet: true // Suppress console logs in development
      })
      console.log('[MSW] Mock API initialized')
    } catch (error) {
      console.error('[MSW] Failed to initialize:', error)
    }
  }
} 