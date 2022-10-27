import type { Component } from 'solid-js'
import { MetaProvider } from 'solid-meta'
import { Router } from 'solid-app-router'
import { App } from '@/src/App'

export interface TagDescription {
  id: string
  tag: string
  props: Record<string, unknown>
}

export interface ServerProps {
  tags: TagDescription[]
  url: string
}

const Server: Component<ServerProps> = (props) => {
  return (
    <MetaProvider tags={props.tags}>
      <Router url={props.url}>
        <App />
      </Router>
    </MetaProvider>
  )
}

export default Server
