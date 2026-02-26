import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, LayoutDashboard, Users, CalendarCheck, LogOut, Menu, X, ChevronRight, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Members', to: '/admin/members', icon: Users },
    { label: 'Attendance', to: '/admin/attendance', icon: CalendarCheck },
    { label: 'Messages', to: '/admin/messages', icon: Mail },
]

export default function AdminLayout() {
    const { signOut, user } = useAuth()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

    const handleLogout = async () => {
        await signOut()
        navigate('/admin/login')
    }

    const SidebarContent = ({ onClose }) => (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 16px' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, padding: '0 8px' }}>
                <div style={{
                    width: 36, height: 36,
                    background: 'linear-gradient(135deg, #ff0033, #cc0025)',
                    borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 0 20px rgba(255,0,51,0.3)',
                }}>
                    <Zap size={18} color="white" strokeWidth={2.5} />
                </div>
                <AnimatePresence>
                    {(sidebarOpen || onClose) && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 20, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden' }}
                        >
                            IRON<span style={{ color: '#ff0033' }}>FIT</span>
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Nav items */}
            <nav style={{ flex: 1 }}>
                {navItems.map(({ label, to, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={onClose}
                        style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '12px 12px',
                            borderRadius: 10,
                            color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                            background: isActive ? 'rgba(255,0,51,0.12)' : 'transparent',
                            border: isActive ? '1px solid rgba(255,0,51,0.25)' : '1px solid transparent',
                            marginBottom: 4, textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            fontWeight: isActive ? 600 : 400,
                            fontSize: 15,
                        })}
                        onMouseEnter={(e) => {
                            const el = e.currentTarget
                            const isActive = el.getAttribute('aria-current') === 'page'
                            if (!isActive) {
                                el.style.background = 'rgba(255,255,255,0.05)'
                                el.style.color = 'rgba(255,255,255,0.85)'
                            }
                        }}
                        onMouseLeave={(e) => {
                            const el = e.currentTarget
                            const isActive = el.getAttribute('aria-current') === 'page'
                            if (!isActive) {
                                el.style.background = 'transparent'
                                el.style.color = 'rgba(255,255,255,0.5)'
                            }
                        }}
                    >
                        <Icon size={19} style={{ flexShrink: 0 }} />
                        <AnimatePresence>
                            {(sidebarOpen || onClose) && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                                >
                                    {label}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </NavLink>
                ))}
            </nav>

            {/* User + Logout */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginTop: 'auto' }}>
                <AnimatePresence>
                    {(sidebarOpen || onClose) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                padding: '10px 12px', background: 'rgba(255,255,255,0.04)',
                                borderRadius: 10, marginBottom: 8,
                            }}
                        >
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '1px' }}>Signed in as</div>
                            <div style={{ color: 'white', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.email || 'Admin'}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        width: '100%', padding: '11px 12px',
                        background: 'none', border: '1px solid transparent',
                        borderRadius: 10, color: 'rgba(255,255,255,0.5)',
                        cursor: 'pointer', fontSize: 15, fontWeight: 400,
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,0,51,0.08)'
                        e.currentTarget.style.borderColor = 'rgba(255,0,51,0.2)'
                        e.currentTarget.style.color = '#ff0033'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none'
                        e.currentTarget.style.borderColor = 'transparent'
                        e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
                    }}
                >
                    <LogOut size={19} style={{ flexShrink: 0 }} />
                    <AnimatePresence>
                        {(sidebarOpen || onClose) && (
                            <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </div>
    )

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a' }}>
            {/* Desktop Sidebar */}
            <motion.aside
                animate={{ width: sidebarOpen ? 240 : 72 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{
                    flexShrink: 0,
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    background: '#111111',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                }}
                className="hidden md:block"
            >
                <div style={{ position: 'absolute', top: 16, right: -12, zIndex: 10 }}>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{
                            width: 24, height: 24,
                            background: '#222', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
                        }}
                    >
                        <ChevronRight size={12} style={{ transform: sidebarOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                    </button>
                </div>
                <SidebarContent />
            </motion.aside>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {mobileSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileSidebarOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 40 }}
                        />
                        <motion.aside
                            initial={{ x: -260 }}
                            animate={{ x: 0 }}
                            exit={{ x: -260 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            style={{
                                position: 'fixed', left: 0, top: 0, bottom: 0, width: 240,
                                background: '#111111', zIndex: 50,
                                borderRight: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            <SidebarContent onClose={() => setMobileSidebarOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main content area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'auto' }}>
                {/* Topbar */}
                <header style={{
                    height: 64,
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(10,10,10,0.9)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 24px',
                    position: 'sticky', top: 0, zIndex: 30,
                }}>
                    <button
                        className="md:hidden"
                        onClick={() => setMobileSidebarOpen(true)}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        <Menu size={22} />
                    </button>
                    <div />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #ff0033, #cc0025)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: 14, color: 'white',
                        }}>
                            {user?.email?.[0]?.toUpperCase() || 'A'}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, padding: '32px 24px', minHeight: 0 }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
