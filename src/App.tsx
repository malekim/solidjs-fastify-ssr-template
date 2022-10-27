import type { JSX } from 'solid-js'
import { createSignal } from 'solid-js'
import { Title } from 'solid-meta'

import { Routes, Route } from 'solid-app-router'

import Root from '@/src/layouts/Root'

import Main from '@/src/pages/Main'
import Login from '@/src/pages/Login'
import NotFound from '@/src/pages/NotFound'
import Test from '@/src/pages/Test'

export const App = (): JSX.Element => {
  const [count, setCount] = createSignal(0)

  const counts = (Count: () => number): string => {
    const count = Count()
    return `${count} time${count === 1 ? '' : 's'}`
  }

  return (
    <>
      <Title>Solid.js, Vite, Fastify SSR + API</Title>
      <div>
        <Routes>
          <Route path="/" component={Root}>
            <Route path="/" component={Main} />
            <Route path="/login" component={Login} />
            <Route path="test" component={Test} />
            <Route path="*all" component={NotFound} />
          </Route>
        </Routes>
        <button onClick={() => setCount(count() + 1)}>Click me</button>
        <p> The Button Has been clicked {counts(count)}</p>
      </div>
    </>
  )
}

export default App
