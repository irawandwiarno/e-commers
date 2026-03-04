import { createSlice } from '@reduxjs/toolkit'
import secureLocalStorage from 'react-secure-storage'

const LOGIN_STORAGE_KEY = 'login'

const getStoredLogin = () => {
  const raw = secureLocalStorage.getItem(LOGIN_STORAGE_KEY)

  if (!raw) {
    return null
  }

  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }

  return raw
}

const storedLogin = getStoredLogin()

const initialState = {
  user: storedLogin?.user ?? null,
  token: storedLogin?.token ?? null,
  isAuthenticated: Boolean(storedLogin?.token),
}

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token } = action.payload

      state.user = user
      state.token = token
      state.isAuthenticated = true

      secureLocalStorage.setItem(LOGIN_STORAGE_KEY, { user, token })
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false

      secureLocalStorage.removeItem(LOGIN_STORAGE_KEY)
    },
  },
})

export const { loginSuccess, logout } = loginSlice.actions

export default loginSlice.reducer
