import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'

const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Programs', href: '#programs' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleNavClick = (href) => {
        setMobileOpen(false)
        if (href.startsWith('#')) {
            const el = document.querySelector(href)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <>
            <motion.nav
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    padding: '0 24px',
                    background: scrolled
                        ? 'rgba(10, 10, 10, 0.95)'
                        : 'transparent',
                    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    transition: 'all 0.4s ease',
                }}
            >
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 36,
                            height: 36,
                            background: 'linear-gradient(135deg, #ff0033, #cc0025)',
                            borderRadius: 8,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Zap size={18} color="white" strokeWidth={2.5} />
                        </div>
                        <span style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontWeight: 800,
                            fontSize: 22,
                            color: 'white',
                            letterSpacing: '-0.5px',
                        }}>
                            IRON<span style={{ color: '#ff0033' }}>FIT</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="hidden md:flex">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => handleNavClick(link.href)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.75)',
                                    fontWeight: 500,
                                    fontSize: 15,
                                    cursor: 'pointer',
                                    transition: 'color 0.2s',
                                    letterSpacing: '0.3px',
                                }}
                                onMouseEnter={(e) => (e.target.style.color = '#ffffff')}
                                onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.75)')}
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>

                    {/* CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Link
                            to="/admin/login"
                            style={{
                                padding: '10px 24px',
                                background: 'linear-gradient(135deg, #ff0033, #cc0025)',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: 14,
                                borderRadius: 8,
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                                letterSpacing: '0.3px',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)'
                                e.target.style.boxShadow = '0 6px 24px rgba(255,0,51,0.4)'
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)'
                                e.target.style.boxShadow = 'none'
                            }}
                        >
                            Admin Login
                        </Link>
                        <button
                            className="md:hidden"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                        >
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'fixed',
                            top: 72,
                            left: 0,
                            right: 0,
                            zIndex: 999,
                            background: 'rgba(10,10,10,0.98)',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(20px)',
                            padding: '16px 24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                        }}
                    >
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => handleNavClick(link.href)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.8)',
                                    fontWeight: 500,
                                    fontSize: 16,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    padding: '12px 0',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    transition: 'color 0.2s',
                                }}
                            >
                                {link.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
