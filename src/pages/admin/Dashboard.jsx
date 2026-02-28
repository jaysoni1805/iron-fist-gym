import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Users, UserCheck, UserX, DollarSign, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement, LineElement,
    PointElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { supabase } from '../../lib/supabase'

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement,
    PointElement, Title, Tooltip, Legend, Filler,
)

// Animated number counter
function AnimatedNumber({ value, prefix = '', decimals = 0 }) {
    const [display, setDisplay] = useState(0)
    const ref = useRef(null)
    useEffect(() => {
        if (value === null || value === undefined) return
        const start = 0
        const end = parseFloat(value)
        const duration = 1200
        const startTime = performance.now()
        const step = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            ref.current = requestAnimationFrame(step)
            setDisplay(start + (end - start) * eased)
            if (progress >= 1) cancelAnimationFrame(ref.current)
        }
        ref.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(ref.current)
    }, [value])
    if (value === null || value === undefined) return <span>—</span>
    return (
        <span>
            {prefix}{decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString('en-IN')}
        </span>
    )
}

// Skeleton loader
function Skeleton({ width = '100%', height = 20, borderRadius = 6, style = {} }) {
    return (
        <div style={{
            width, height, borderRadius,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.6s infinite',
            ...style,
        }} />
    )
}

function StatCard({ icon: Icon, title, value, sub, color, delay, loading, trend }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, padding: 24,
                transition: 'all 0.3s ease',
                cursor: 'default',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${color}44`
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.boxShadow = `0 12px 32px ${color}18`
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500, marginBottom: 10, letterSpacing: '0.3px' }}>
                        {title}
                    </div>
                    {loading ? (
                        <Skeleton width={100} height={36} borderRadius={8} style={{ marginBottom: 8 }} />
                    ) : (
                        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 36, color: 'white', lineHeight: 1, marginBottom: 8 }}>
                            <AnimatedNumber value={value} prefix={title === 'Total Revenue' ? '₹' : ''} />
                        </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {loading ? <Skeleton width={120} height={14} /> : (
                            <>
                                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>{sub}</span>
                                {trend !== undefined && !loading && (
                                    <span style={{
                                        color: trend >= 0 ? '#22c55e' : '#ef4444',
                                        fontSize: 12, fontWeight: 600,
                                        display: 'flex', alignItems: 'center', gap: 2,
                                    }}>
                                        {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        {Math.abs(trend)}%
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginLeft: 16,
                }}>
                    <Icon size={22} color={color} />
                </div>
            </div>
        </motion.div>
    )
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Dashboard() {
    const [stats, setStats] = useState({ total: null, active: null, expired: null, revenue: null })
    const [monthlyRevenue, setMonthlyRevenue] = useState(new Array(12).fill(0))
    const [loading, setLoading] = useState(true)
    const [revenueTrend, setRevenueTrend] = useState(null)

    const fetchStats = async () => {
        setLoading(true)
        try {
            const { data: members } = await supabase.from('members').select('status, payment_amount, join_date')
            const total = members?.length ?? 0
            const active = members?.filter((m) => m.status === 'active').length ?? 0
            const expired = members?.filter((m) => m.status === 'expired').length ?? 0
            const revenue = members?.reduce((sum, m) => sum + (parseFloat(m.payment_amount) || 0), 0) ?? 0

            const currentYear = new Date().getFullYear()
            const currentMonth = new Date().getMonth()
            const monthly = new Array(12).fill(0)
            members?.forEach((m) => {
                if (m.join_date) {
                    const d = new Date(m.join_date)
                    if (d.getFullYear() === currentYear) {
                        monthly[d.getMonth()] += parseFloat(m.payment_amount) || 0
                    }
                }
            })

            // Calculate MoM revenue trend
            const thisMonth = monthly[currentMonth]
            const lastMonth = monthly[currentMonth - 1] || 0
            const trend = lastMonth > 0
                ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
                : thisMonth > 0 ? 100 : 0

            setStats({ total, active, expired, revenue })
            setMonthlyRevenue(monthly)
            setRevenueTrend(trend)
        } catch (err) {
            console.error('Error fetching dashboard stats:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchStats() }, [])

    const chartData = {
        labels: MONTHS,
        datasets: [
            {
                label: 'Revenue (₹)',
                data: monthlyRevenue,
                backgroundColor: (ctx) => {
                    const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300)
                    gradient.addColorStop(0, 'rgba(255,0,51,0.45)')
                    gradient.addColorStop(1, 'rgba(255,0,51,0.03)')
                    return gradient
                },
                borderColor: '#ff0033',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: 'rgba(255,0,51,0.6)',
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1a1a1a',
                titleColor: 'rgba(255,255,255,0.7)',
                bodyColor: 'white',
                borderColor: 'rgba(255,0,51,0.3)',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: (ctx) => ` ₹${ctx.raw.toLocaleString('en-IN')}`,
                },
            },
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: { color: 'rgba(255,255,255,0.45)', font: { size: 12 } },
                border: { color: 'rgba(255,255,255,0.06)' },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.04)' },
                ticks: {
                    color: 'rgba(255,255,255,0.45)', font: { size: 12 },
                    callback: (v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v}`,
                },
                border: { color: 'rgba(255,255,255,0.06)' },
            },
        },
    }

    const currentMonthRevenue = monthlyRevenue[new Date().getMonth()]
    const currentMonthName = MONTHS[new Date().getMonth()]

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 28, color: 'white', letterSpacing: '-0.5px' }}>
                        Dashboard
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginTop: 4 }}>
                        Overview of your gym's performance
                    </p>
                </div>
                <button
                    onClick={fetchStats}
                    disabled={loading}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 20px', background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                        color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 500,
                        cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                >
                    <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                    Refresh
                </button>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
                <StatCard icon={Users} title="Total Members" value={stats.total} sub="All time" color="#3b82f6" delay={0} loading={loading} />
                <StatCard icon={UserCheck} title="Active Members" value={stats.active} sub="Current plans" color="#22c55e" delay={0.1} loading={loading} />
                <StatCard icon={UserX} title="Expired Members" value={stats.expired} sub="Need renewal" color="#ef4444" delay={0.2} loading={loading} />
                <StatCard
                    icon={DollarSign}
                    title="Total Revenue"
                    value={stats.revenue}
                    sub="All time earnings"
                    color="#ff0033"
                    delay={0.3}
                    loading={loading}
                    trend={revenueTrend}
                />
            </div>

            {/* This Month Revenue Callout */}
            {!loading && currentMonthRevenue > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        background: 'rgba(255,0,51,0.06)',
                        border: '1px solid rgba(255,0,51,0.2)',
                        borderRadius: 14, padding: '16px 24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: 12, marginBottom: 24,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <TrendingUp size={20} color="#ff0033" />
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                            {currentMonthName} Revenue this year
                        </span>
                    </div>
                    <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22, color: 'white' }}>
                        ₹{currentMonthRevenue.toLocaleString('en-IN')}
                        {revenueTrend !== null && (
                            <span style={{
                                fontSize: 13, fontWeight: 600, marginLeft: 10,
                                color: revenueTrend >= 0 ? '#22c55e' : '#ef4444',
                            }}>
                                {revenueTrend >= 0 ? '▲' : '▼'} {Math.abs(revenueTrend)}% vs last month
                            </span>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Revenue Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, padding: 28,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <TrendingUp size={20} color="#ff0033" />
                    <h2 style={{ color: 'white', fontWeight: 700, fontSize: 18, fontFamily: 'Outfit, sans-serif' }}>
                        Monthly Revenue ({new Date().getFullYear()})
                    </h2>
                </div>
                {loading ? (
                    <Skeleton width="100%" height={280} borderRadius={12} />
                ) : (
                    <div style={{ height: 280 }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                )}
            </motion.div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    )
}
