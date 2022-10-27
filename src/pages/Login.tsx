import { createSignal, Show } from 'solid-js'
import type { JSX } from 'solid-js'
import axios, { AxiosError } from 'axios'
import { setIsLoggedIn } from '@/src/store/auth'

export default (): JSX.Element => {
  const [hasCode, setHasCode] = createSignal(false)
  const [email, setEmail] = createSignal('')
  const [code, setCode] = createSignal('')
  const sendCode = (event: Event): void => {
    event.preventDefault()
    const data = {
      email: email()
    }
    axios.post('/api/v1/auth/send-code', data)
      .then((response) => {
        setHasCode(true)
      })
      .catch((error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data?.message)
        }
      })
  }

  const login = (event: Event): void => {
    event.preventDefault()
    const data = {
      code: code()
    }
    axios.post('/api/v1/auth/login', data)
      .then((response) => {
        setIsLoggedIn(true)
      })
      .catch((error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data?.message)
        }
      })
  }
  return (
    <main>
      <h2>Login</h2>
      <Show when={!hasCode()}>
        <form onSubmit={sendCode}>
          <label for="email">
            Email
          </label>
          <input
            type="text"
            id="email"
            value={email()}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </Show>
      <Show when={hasCode()}>
        <form onSubmit={login}>
          <label for="code">
            Code
          </label>
          <input
            type="text"
            id="code"
            value={code()}
            onChange={(e) => setCode(e.currentTarget.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </Show>
    </main>
  )
}
