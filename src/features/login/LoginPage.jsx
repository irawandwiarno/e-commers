import { useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { loginSuccess } from './loginSlice'
import useAuth from '../../hooks/useAuth'
import FormField from '../../components/base/FormField'
import toast from 'react-hot-toast'

function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isAuthenticated, login, loading, error, setError } = useAuth()

    const [searchParams] = useSearchParams()
    const [email, setEmail] = useState(() => searchParams.get('email') || '')
    const [password, setPassword] = useState(() => searchParams.get('password') || '')

    const fallbackName = useMemo(() => {
        if (!email.includes('@')) return 'Admin'
        return email.split('@')[0]
    }, [email])

    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!email || !password) return
        setError('')

        const result = await login({ email, password })
        if (!result) return

        navigate('/', { replace: true })
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-6 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <FormField
                            id="email"
                            label="Email address"
                            type="email"
                            placeholder="Masukan Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FormField
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="Masukan Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* Error */}
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between">
                            <a onClick={()=>toast.error("Fitur belum tersedia")} href="#" className="text-sm text-primary hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-colors"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <hr className="border-slate-200 my-6" />

                    <p className="text-sm text-slate-500 text-center">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="text-primary hover:underline">Create account</Link>
                    </p>
                </div>

                <div className="mt-4 flex justify-center gap-6">
                    <a href="#" className="text-xs text-slate-400 hover:text-slate-600">Privacy Policy</a>
                    <a href="#" className="text-xs text-slate-400 hover:text-slate-600">Terms of Service</a>
                    <a href="#" className="text-xs text-slate-400 hover:text-slate-600">Help Center</a>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
