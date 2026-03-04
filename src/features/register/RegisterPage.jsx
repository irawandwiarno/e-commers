import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import apiClient from '../../api/axios'
import FormField from '../../components/base/FormField'
import validateRegister from '../../helpers/validateRegister'

function RegisterPage() {
    const navigate = useNavigate()

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [serverError, setServerError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setServerError('')

        const validationErrors = validateRegister({ fullName, email, password, confirmPassword })
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }
        setErrors({})

        try {
            setLoading(true)
            await apiClient.post('/users', { fullName, email, password })
            navigate(`/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
        } catch (err) {
            setServerError(
                err?.response?.data?.message || 'Failed to create account. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-6 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8">

                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-slate-900">Create an account</h1>
                        <p className="text-sm text-slate-500 mt-1">Fill in the details below to get started.</p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                        <FormField
                            id="fullName"
                            label="Full Name"
                            placeholder="Masukan Nama Lengkap"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            error={errors.fullName}
                        />
                        <FormField
                            id="email"
                            label="Email address"
                            type="email"
                            placeholder="Masukan Alamat Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                        />
                        <FormField
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="Masukan Password (Min. 8 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                        />
                        <FormField
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            placeholder="Masukan Konfirmasi Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={errors.confirmPassword}
                        />

                        {serverError && (
                            <p className="text-sm text-red-500">{serverError}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-colors mt-1"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <hr className="border-slate-200 my-6" />

                    <p className="text-sm text-slate-500 text-center">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
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

export default RegisterPage
