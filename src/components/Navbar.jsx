import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
    const location = useLocation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50)
        const onResize = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            if (!mobile) setMobileOpen(false)
        }
        window.addEventListener('scroll', onScroll)
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onResize)
        }
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
                    top: 0, left: 0, right: 0,
                    zIndex: 1000,
                    padding: '0 20px',
                    background: scrolled ? 'rgba(10,10,10,0.95)' : 'rgba(10,10,10,0.6)',
                    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    backdropFilter: 'blur(20px)',
                    transition: 'background 0.4s ease, border 0.4s ease',
                }}
            >
                <div style={{
                    maxWidth: 1200, margin: '0 auto',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', height: 72,
                }}>
                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <div style={{
                            width: 36, height: 36,
                            background: 'linear-gradient(135deg, #ff0033, #cc0025)',
                            borderRadius: 8,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Zap size={18} color="white" strokeWidth={2.5} />
                        </div>
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22, color: 'white', letterSpacing: '-0.5px' }}>
                            IRON<span style={{ color: '#ff0033' }}>FIT</span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links — hidden on mobile */}
                    {!isMobile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                            {navLinks.map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => handleNavClick(link.href)}
                                    style={{
                                        background: 'none', border: 'none',
                                        color: 'rgba(255,255,255,0.75)',
                                        fontWeight: 500, fontSize: 15,
                                        cursor: 'pointer', transition: 'color 0.2s',
                                        letterSpacing: '0.3px', whiteSpace: 'nowrap',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Right side */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                        {/* Desktop CTA */}
                        {!isMobile && (
                            <button
                                onClick={() => handleNavClick('#pricing')}
                                style={{
                                    padding: '10px 24px',
                                    background: 'linear-gradient(135deg, #ff0033, #cc0025)',
                                    color: 'white', fontWeight: 600, fontSize: 14,
                                    borderRadius: 8, border: 'none', cursor: 'pointer',
                                    transition: 'all 0.3s ease', whiteSpace: 'nowrap',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)'
                                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(255,0,51,0.4)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                Join Now
                            </button>
                        )}

                        {/* Hamburger — mobile only */}
                        {isMobile && (
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                style={{
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: 8,
                                    color: 'white', cursor: 'pointer',
                                    width: 44, height: 44,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                            >
                                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Dropdown Menu */}
            <AnimatePresence>
                {mobileOpen && isMobile && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        style={{
                            position: 'fixed',
                            top: 72, left: 0, right: 0,
                            zIndex: 999,
                            background: 'rgba(8,8,8,0.98)',
                            borderBottom: '1px solid rgba(255,255,255,0.07)',
                            backdropFilter: 'blur(24px)',
                            padding: '12px 20px 24px',
                            display: 'flex', flexDirection: 'column',
                            maxHeight: 'calc(100vh - 72px)',
                            overflowY: 'auto',
                        }}
                    >
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={() => handleNavClick(link.href)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    color: 'rgba(255,255,255,0.85)',
                                    fontWeight: 500, fontSize: 17,
                                    cursor: 'pointer', textAlign: 'left',
                                    padding: '16px 4px',
                                    minHeight: 56,
                                    width: '100%',
                                    transition: 'color 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#ff0033')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                            >
                                {link.label}
                            </button>
                        ))}
                        {/* Mobile CTA */}
                        <button
                            onClick={() => handleNavClick('#pricing')}
                            style={{
                                marginTop: 16,
                                padding: '16px',
                                background: 'linear-gradient(135deg, #ff0033, #cc0025)',
                                color: 'white', fontWeight: 700, fontSize: 16,
                                borderRadius: 10, border: 'none', cursor: 'pointer',
                                width: '100%', minHeight: 52,
                            }}
                        >
                            Join Now →
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
