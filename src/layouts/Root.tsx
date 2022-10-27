import { NavLink, Outlet } from 'solid-app-router'
import { onMount, Suspense, Show } from 'solid-js'
import type { JSX } from 'solid-js'
import axios, { AxiosError } from 'axios'
import { store, setIsLoggedIn } from '@/src/store/auth'

export default (): JSX.Element => {
  onMount(() => {
    axios.get('/api/v1/auth/is-logged-in')
      .then((response) => {
        setIsLoggedIn(true)
      })
      .catch((error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
          setIsLoggedIn(false)
          console.log(error.response?.data?.message)
        }
      })
  })

  const logout = (): void => {
    axios.post('/api/v1/auth/logout')
      .then((response) => {
        setIsLoggedIn(false)
      })
      .catch((error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
          setIsLoggedIn(false)
          console.log(error.response?.data?.message)
        }
      })
  }

  return (
    <>
      <header>
        <h1>Solid JS</h1>
        <h3>SSR + API based on Fastify</h3>
        <h4>Development and build with Vite</h4>
      </header>
      <nav>
        <NavLink href="/" end>
          Home
        </NavLink>
        <Show when={!store.isLoggedIn}>
          <NavLink href="login">Login</NavLink>
        </Show>
        <NavLink href="test">Test</NavLink>
        <Show when={store.isLoggedIn}>
          <button type="button" onClick={logout}>Logout</button>
        </Show>
      </nav>
      <Suspense>
        <Outlet />
      </Suspense>
      <footer>
        <p>This is a footer</p>
      </footer>
    </>
  )
}
