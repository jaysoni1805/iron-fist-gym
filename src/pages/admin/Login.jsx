import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Zap, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
    const navigate = useNavigate()
    const { signIn } = useAuth()

    const [form, setForm] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!form.email || !form.password) {
            setError('Please enter your email and password.')
            return
        }
        setLoading(true)
        const { error: signInError } = await signIn(form.email, form.password)
        setLoading(false)
        if (signInError) {
            setError('Invalid email or password. Please try again.')
        } else {
            navigate('/admin/dashboard')
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,0,51,0.12) 0%, transparent 60%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
                pointerEvents: 'none',
            }} />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}
            >
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <div style={{
                            width: 44, height: 44,
                            background: 'linear-gradient(135deg, #ff0033, #cc0025)',
                            borderRadius: 12,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 30px rgba(255,0,51,0.35)',
                        }}>
                            <Zap size={22} color="white" strokeWidth={2.5} />
                        </div>
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 26, color: 'white' }}>
                            IRON<span style={{ color: '#ff0033' }}>FIT</span>
                        </span>
                    </div>
                    <h1 style={{ color: 'white', fontWeight: 700, fontSize: 24, fontFamily: 'Outfit, sans-serif', marginBottom: 8 }}>
                        Admin Portal
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15 }}>
                        Sign in to manage your gym
                    </p>
                </div>

                {/* Card */}
                <div className="glass-card" style={{ padding: '40px 36px' }}>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                background: 'rgba(255,0,51,0.1)', border: '1px solid rgba(255,0,51,0.3)',
                                borderRadius: 10, padding: '12px 16px', marginBottom: 24,
                            }}
                        >
                            <AlertCircle size={16} color="#ff0033" />
                            <span style={{ color: '#ff6677', fontSize: 14 }}>{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Email Address"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                autoComplete="email"
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    autoComplete="current-password"
                                    style={{ paddingRight: 48 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: 'rgba(255,255,255,0.4)',
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '14px 24px',
                                background: loading ? 'rgba(255,0,51,0.5)' : 'linear-gradient(135deg, #ff0033, #cc0025)',
                                color: 'white', fontWeight: 600, fontSize: 15,
                                borderRadius: 10, border: 'none', cursor: loading ? 'wait' : 'pointer',
                                marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,0,51,0.4)'
                            }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
                        >
                            {loading ? (
                                <>
                                    <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                    Signing in...
                                </>
                            ) : 'Sign In'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 13, marginTop: 24 }}>
                    IronFit Gym Management System
                </p>
            </motion.div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
