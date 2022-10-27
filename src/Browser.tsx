import type { Component } from 'solid-js'
import { MetaProvider } from 'solid-meta'
import { Router } from 'solid-app-router'
import { App } from '@/src/App'

const Browser: Component = () => {
  return (
    <MetaProvider>
      <Router>
        <App />
      </Router>
    </MetaProvider>
  )
}

export default Browser
