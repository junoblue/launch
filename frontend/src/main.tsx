import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Initialize MSW in development
async function initMockServiceWorker() {
  if (import.meta.env.DEV) {
    console.log('Development environment detected, starting MSW...')
    try {
      const { worker } = await import('./mocks/browser')
      console.log('MSW worker imported successfully')
      
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js'
        }
      })
      
      console.log('MSW worker started successfully')
      return true
    } catch (error) {
      console.error('Failed to initialize MSW:', error)
      return false
    }
  }
  return false
}

// Wait for MSW to initialize before rendering
initMockServiceWorker().then((mswStarted) => {
  console.log('MSW initialization complete, started:', mswStarted)
  console.log('Rendering app...')
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
