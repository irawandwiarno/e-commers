import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { APP_NAME } from '../../helpers/constants'
import useAuth from '../../hooks/useAuth'
import useIsDesktop from '../../hooks/useIsDesktop'
import Sidebar from '../composite/Sidebar'
import { Menu } from 'lucide-react'
import { useSelector } from 'react-redux'

function MainLayout() {
    const { logout } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const isDesktop = useIsDesktop()
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)
    const user = useSelector((state) => state.login.user)

    console.log('User in MainLayout:', user) // Debugging line to check user state

    // Open sidebar by default on desktop, close on mobile
    useEffect(() => {
        setIsSidebarOpen(isDesktop)
    }, [isDesktop])

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (!isDesktop && isSidebarOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isDesktop, isSidebarOpen])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)

    return (
        <div className="max-h-screen overflow-hidden bg-slate-50 flex">
            <Sidebar open={isSidebarOpen} onToggle={toggleSidebar} />

            {/* Backdrop overlay â€” closes sidebar when clicking outside on mobile */}
            {!isDesktop && isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40"
                    onClick={toggleSidebar}
                />
            )}

            <main className="flex-1 min-w-0">
                <header className="h-16 px-4 md:px-6 flex items-center justify-between bg-white border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        {!isDesktop && (
                            <>
                                <button
                                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
                                    onClick={toggleSidebar}
                                    aria-label="Open sidebar"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                                <span className="font-semibold text-slate-900 text-base">
                                    {APP_NAME}
                                </span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2 relative" ref={menuRef}>
                        <span className="text-base capitalize font-semibold text-slate-700">{user?.name || 'User'}</span>
                        <button
                            className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold shrink-0"
                            aria-label="Account"
                            onClick={() => setMenuOpen((prev) => !prev)}
                        >
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </button>
                        {menuOpen && (
                            <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-red-500 font-semibold hover:bg-slate-50"
                                    onClick={() => { setMenuOpen(false); logout() }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <div className="h-[calc(100vh-4rem)] overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
export default MainLayout
