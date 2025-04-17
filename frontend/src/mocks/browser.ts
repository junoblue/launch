import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Set up the worker with handlers
export const worker = setupWorker(...handlers)

// Export for type safety
export type Worker = typeof worker

// Conditionally start the worker
if (import.meta.env.DEV) {
  worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
  })
} 