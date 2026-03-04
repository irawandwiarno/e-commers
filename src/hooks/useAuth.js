import { useDispatch, useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../features/login/loginSelectors'
import { loginSuccess, logout as logoutAction } from '../features/login/loginSlice'
import apiClient from '../api/axios'
import { useCallback, useState } from 'react'

function useAuth() {
    const dispatch = useDispatch()
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [error, setError] = useState('')

    const login = useCallback(async ({ email, password }) => {
        if (!email || !password) {
            setError('Email and password are required')
            return null
        }

        setLoading(true)
        setError('')

        try {
            const response = await apiClient.get('/login')
            if (response.status === 200) {
                console.log('Login successful:', response.data?.[0]?.data) // Debugging line to check response data
                setUser(response?.data?.[0]?.data);
                dispatch(loginSuccess({
                    user: response?.data?.[0]?.data,
                    token: response?.data?.[0]?.token,
                }));
                return response?.data?.[0]?.data;
            }
        } catch (err) {
            const message = err?.response?.data?.message || 'Login failed'
            setError(message)
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    const logout = () => {
        dispatch(logoutAction())
    }

    return {
        isAuthenticated,
        login,
        logout,
        loading,
        error,
        user,
        setError,
    }
}

export default useAuth

