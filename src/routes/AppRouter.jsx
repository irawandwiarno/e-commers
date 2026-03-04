import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../components/layouts/MainLayout'
import ProtectedRoute from './ProtectedRoute'
import { Toaster } from 'react-hot-toast'

const Login    = lazy(() => import('../features/login/LoginPage'))
const Register = lazy(() => import('../features/register/RegisterPage'))
const Customers = lazy(() => import('../features/customers/CustomersPage'))
const Transactions = lazy(() => import('../features/transactions/TransactionsPage'))

function AppRouter() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div style={{ padding: '1rem' }}></div>}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<MainLayout />}>
                            {/* <Route  element={<Dashboard />} /> */}
                            <Route index element={<Customers />} />
                            <Route path="transactions" element={<Transactions />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Toaster/>
            </Suspense>
        </BrowserRouter>
    )
}

export default AppRouter
