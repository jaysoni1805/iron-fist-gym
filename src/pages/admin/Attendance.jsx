import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck, Search, Users, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { supabase } from '../../lib/supabase'

function AttendanceBadge({ status }) {
    if (!status) {
        return (
            <span style={{
                padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.08)',
            }}>Not Marked</span>
        )
    }
    const isPresent = status === 'present'
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600,
            background: isPresent ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
            color: isPresent ? '#22c55e' : '#ef4444',
            border: `1px solid ${isPresent ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
        }}>
            {isPresent ? <CheckCircle size={12} /> : <XCircle size={12} />}
            {isPresent ? 'Present' : 'Absent'}
        </span>
    )
}

export default function Attendance() {
    const [members, setMembers] = useState([])
    const [attendanceMap, setAttendanceMap] = useState({}) // memberId -> {id, status}
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [marking, setMarking] = useState({})

    const fetchData = useCallback(async () => {
        setLoading(true)
        const [{ data: membersData }, { data: attData }] = await Promise.all([
            supabase.from('members').select('id, name, phone, plan, status').order('name'),
            supabase.from('attendance').select('id, member_id, status').eq('date', selectedDate),
        ])
        setMembers(membersData || [])
        const map = {}
        attData?.forEach((a) => { map[a.member_id] = { id: a.id, status: a.status } })
        setAttendanceMap(map)
        setLoading(false)
    }, [selectedDate])

    useEffect(() => { fetchData() }, [fetchData])

    const markAttendance = async (memberId, status) => {
        setMarking((prev) => ({ ...prev, [memberId]: true }))
        const existing = attendanceMap[memberId]
        if (existing?.id) {
            if (existing.status === status) {
                // Toggle off (delete)
                await supabase.from('attendance').delete().eq('id', existing.id)
                setAttendanceMap((prev) => {
                    const updated = { ...prev }
                    delete updated[memberId]
                    return updated
                })
            } else {
                // Update status
                await supabase.from('attendance').update({ status }).eq('id', existing.id)
                setAttendanceMap((prev) => ({ ...prev, [memberId]: { ...prev[memberId], status } }))
            }
        } else {
            // Insert new
            const { data } = await supabase.from('attendance').insert([{ member_id: memberId, date: selectedDate, status }]).select().single()
            if (data) setAttendanceMap((prev) => ({ ...prev, [memberId]: { id: data.id, status: data.status } }))
        }
        setMarking((prev) => ({ ...prev, [memberId]: false }))
    }

    const filtered = members.filter((m) =>
        !search || m.name?.toLowerCase().includes(search.toLowerCase()) || m.phone?.includes(search)
    )

    const presentCount = Object.values(attendanceMap).filter((a) => a.status === 'present').length
    const absentCount = Object.values(attendanceMap).filter((a) => a.status === 'absent').length

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 28, color: 'white', letterSpacing: '-0.5px' }}>
                        Attendance
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginTop: 4 }}>
                        Mark and track daily attendance
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        type="date"
                        className="form-input"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{ maxWidth: 180 }}
                    />
                    <button
                        onClick={fetchData}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '10px 16px', background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                            color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer',
                        }}
                    >
                        <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                    </button>
                </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
                {[
                    { icon: Users, label: 'Total Members', value: members.length, color: '#3b82f6' },
                    { icon: CheckCircle, label: 'Present Today', value: presentCount, color: '#22c55e' },
                    { icon: XCircle, label: 'Absent Today', value: absentCount, color: '#ef4444' },
                    { icon: CalendarCheck, label: 'Not Marked', value: members.length - presentCount - absentCount, color: '#f59e0b' },
                ].map(({ icon: Icon, label, value, color }, i) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        style={{
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 14, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'center',
                        }}
                    >
                        <div style={{
                            width: 42, height: 42, borderRadius: 10,
                            background: `${color}18`, border: `1px solid ${color}30`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <Icon size={19} color={color} />
                        </div>
                        <div>
                            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 26, color: 'white', lineHeight: 1 }}>{value}</div>
                            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 4 }}>{label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Search bar */}
            <div style={{ position: 'relative', marginBottom: 16 }}>
                <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
                <input
                    type="text"
                    className="form-input"
                    placeholder="Search members..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ paddingLeft: 40 }}
                />
            </div>

            {/* Members list */}
            <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, overflow: 'hidden',
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                            {['Member', 'Plan', 'Status', 'Attendance', 'Quick Mark'].map((h) => (
                                <th key={h} style={{
                                    padding: '12px 16px', textAlign: 'left',
                                    color: 'rgba(255,255,255,0.4)', fontSize: 12,
                                    fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase',
                                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                                }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: 48, color: 'rgba(255,255,255,0.35)' }}>
                                    Loading attendance...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: 48, color: 'rgba(255,255,255,0.35)' }}>
                                    No members found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((m, idx) => {
                                const att = attendanceMap[m.id]
                                const isMarking = marking[m.id]
                                return (
                                    <motion.tr
                                        key={m.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.025 }}
                                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                                    >
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{
                                                    width: 34, height: 34, borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #ff0033, #cc0025)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 700, fontSize: 13, color: 'white', flexShrink: 0,
                                                }}>
                                                    {m.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{m.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                background: 'rgba(255,255,255,0.07)', borderRadius: 6,
                                                padding: '3px 10px', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600,
                                            }}>{m.plan}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                                                background: m.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                                                color: m.status === 'active' ? '#22c55e' : '#ef4444',
                                                border: `1px solid ${m.status === 'active' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                                            }}>
                                                {m.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <AttendanceBadge status={att?.status} />
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button
                                                    onClick={() => markAttendance(m.id, 'present')}
                                                    disabled={isMarking}
                                                    style={{
                                                        padding: '7px 14px',
                                                        background: att?.status === 'present' ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.08)',
                                                        border: `1px solid ${att?.status === 'present' ? 'rgba(34,197,94,0.5)' : 'rgba(34,197,94,0.2)'}`,
                                                        borderRadius: 8, color: '#22c55e', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600,
                                                        transition: 'all 0.2s', opacity: isMarking ? 0.5 : 1,
                                                    }}
                                                >
                                                    <CheckCircle size={14} /> Present
                                                </button>
                                                <button
                                                    onClick={() => markAttendance(m.id, 'absent')}
                                                    disabled={isMarking}
                                                    style={{
                                                        padding: '7px 14px',
                                                        background: att?.status === 'absent' ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.08)',
                                                        border: `1px solid ${att?.status === 'absent' ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.2)'}`,
                                                        borderRadius: 8, color: '#ef4444', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600,
                                                        transition: 'all 0.2s', opacity: isMarking ? 0.5 : 1,
                                                    }}
                                                >
                                                    <XCircle size={14} /> Absent
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
