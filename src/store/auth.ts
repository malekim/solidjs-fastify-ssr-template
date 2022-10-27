import { createStore, produce } from 'solid-js/store'

const [store, setStore] = createStore({ email: '', isLoggedIn: false })

const setIsLoggedIn = (isLoggedIn: boolean): void => {
  setStore(produce(s => {
    s.isLoggedIn = isLoggedIn
}))
}

export { store, setIsLoggedIn }
