import { Link, useLocation } from 'react-router-dom'
import { APP_NAME } from '../../helpers/constants'
import useAuth from '../../hooks/useAuth'
import useIsDesktop from '../../hooks/useIsDesktop'
import { ShoppingBag, Users } from 'lucide-react'

const drawerWidth = 260
const collapsedWidth = 72

function Sidebar({ open }) {
    const isDesktop = useIsDesktop()
    const location = useLocation()
    const { user } = useAuth()

    const isActive = (path) => location.pathname === path
    const width = open ? drawerWidth : collapsedWidth

    return (
        <aside
            className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-200 ${
                isDesktop ? 'static' : 'fixed z-40 inset-y-0 left-0'
            } ${!isDesktop && !open ? 'hidden' : ''}`}
            style={{ width }}
        >
            <div className="h-16 flex items-center gap-3 px-4">
                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                </div>
                {open && (
                    <span className="font-bold text-slate-900 text-base truncate">
                        {APP_NAME}
                    </span>
                )}
            </div>

            <hr className="border-slate-200" />

            <nav className="px-2 py-4 space-y-1">
                <Link
                    to="/"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                        isActive('/') ? 'bg-blue-50 text-primary-hover' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    <Users className={`w-5 h-5 shrink-0 ${isActive('/') ? 'text-primary-hover' : 'text-slate-500'}`} />
                    <span className={open ? 'block' : 'hidden'}>Customers</span>
                </Link>
                <Link
                    to="/transactions"
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                        isActive('/transactions') ? 'bg-blue-50 text-primary-hover' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    <ShoppingBag className={`w-5 h-5 shrink-0 ${isActive('/transactions') ? 'text-primary-hover' : 'text-slate-500'}`} />
                    <span className={open ? 'block' : 'hidden'}>Transactions</span>
                </Link>
            </nav>
        </aside>
    )
}

export default Sidebar
