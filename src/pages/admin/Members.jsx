import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, Check, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const PLANS = ['Basic', 'Standard', 'Premium']
const STATUSES = ['active', 'expired']

const emptyForm = {
    name: '', phone: '', email: '', plan: 'Basic',
    join_date: '', expiry_date: '', payment_amount: '', status: 'active',
}

function Badge({ status }) {
    const isActive = status === 'active'
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600,
            background: isActive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
            color: isActive ? '#22c55e' : '#ef4444',
            border: `1px solid ${isActive ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
        }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? '#22c55e' : '#ef4444' }} />
            {isActive ? 'Active' : 'Expired'}
        </span>
    )
}

function MemberModal({ isOpen, onClose, member, onSave }) {
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (member) {
            setForm({ ...emptyForm, ...member })
        } else {
            setForm({
                ...emptyForm,
                join_date: new Date().toISOString().split('T')[0],
            })
        }
        setError('')
    }, [member, isOpen])

    const handleSave = async () => {
        setError('')
        if (!form.name || !form.phone || !form.plan || !form.join_date || !form.expiry_date) {
            setError('Please fill in all required fields.')
            return
        }
        setSaving(true)
        const payload = {
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            plan: form.plan,
            join_date: form.join_date,
            expiry_date: form.expiry_date,
            payment_amount: parseFloat(form.payment_amount) || 0,
            status: new Date(form.expiry_date) < new Date() ? 'expired' : form.status,
        }
        let error
        if (member?.id) {
            ; ({ error } = await supabase.from('members').update(payload).eq('id', member.id))
        } else {
            ; ({ error } = await supabase.from('members').insert([payload]))
        }
        setSaving(false)
        if (error) {
            setError(error.message)
        } else {
            onSave()
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 100,
                        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
                    }}
                    onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            background: '#161616', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 20, padding: '32px 36px',
                            width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 22, color: 'white' }}>
                                {member?.id ? 'Edit Member' : 'Add New Member'}
                            </h2>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {error && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: 'rgba(255,0,51,0.1)', border: '1px solid rgba(255,0,51,0.3)',
                                borderRadius: 10, padding: '10px 14px', marginBottom: 20,
                            }}>
                                <AlertCircle size={15} color="#ff0033" />
                                <span style={{ color: '#ff6677', fontSize: 13 }}>{error}</span>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {[
                                { key: 'name', type: 'text', placeholder: 'Full Name' },
                                { key: 'phone', type: 'tel', placeholder: 'Phone Number' },
                                { key: 'email', type: 'email', placeholder: 'Email Address' },
                            ].map(({ key, type, placeholder }) => (
                                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                    <input
                                        type={type}
                                        className="form-input"
                                        placeholder={placeholder}
                                        value={form[key]}
                                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                    />
                                </div>
                            ))}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                    <select
                                        className="form-input"
                                        value={form.plan}
                                        onChange={(e) => setForm({ ...form, plan: e.target.value })}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <option value="" disabled>Select Plan</option>
                                        {PLANS.map((p) => <option key={p} value={p} style={{ background: '#1a1a1a' }}>{p} Plan</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                    <select
                                        className="form-input"
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <option value="" disabled>Select Status</option>
                                        {STATUSES.map((s) => <option key={s} value={s} style={{ background: '#1a1a1a', textTransform: 'capitalize' }}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                    <input
                                        type="date"
                                        className="form-input"
                                        title="Join Date"
                                        value={form.join_date}
                                        onChange={(e) => setForm({ ...form, join_date: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                    <input
                                        type="date"
                                        className="form-input"
                                        title="Expiry Date"
                                        value={form.expiry_date}
                                        onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Amount Paid (₹)"
                                    value={form.payment_amount}
                                    onChange={(e) => setForm({ ...form, payment_amount: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
                            <button
                                onClick={onClose}
                                style={{
                                    flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                                    color: 'rgba(255,255,255,0.65)', fontWeight: 600, cursor: 'pointer', fontSize: 14,
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                style={{
                                    flex: 2, padding: '12px',
                                    background: saving ? 'rgba(255,0,51,0.5)' : 'linear-gradient(135deg, #ff0033, #cc0025)',
                                    border: 'none', borderRadius: 10,
                                    color: 'white', fontWeight: 600, cursor: saving ? 'wait' : 'pointer', fontSize: 14,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                }}
                            >
                                {saving ? 'Saving...' : (
                                    <><Check size={16} /> {member?.id ? 'Update Member' : 'Add Member'}</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default function Members() {
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterPlan, setFilterPlan] = useState('all')
    const [sortConfig, setSortConfig] = useState({ key: 'created_at', dir: 'desc' })
    const [modalOpen, setModalOpen] = useState(false)
    const [editMember, setEditMember] = useState(null)
    const [deleteId, setDeleteId] = useState(null)

    const fetchMembers = useCallback(async () => {
        setLoading(true)
        const { data } = await supabase.from('members').select('*').order(sortConfig.key, { ascending: sortConfig.dir === 'asc' })
        setMembers(data || [])
        setLoading(false)
    }, [sortConfig])

    useEffect(() => { fetchMembers() }, [fetchMembers])

    const handleSort = (key) => {
        setSortConfig((prev) => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }))
    }

    const handleDelete = async (id) => {
        await supabase.from('members').delete().eq('id', id)
        setDeleteId(null)
        fetchMembers()
    }

    const filtered = members.filter((m) => {
        const matchSearch = !search || m.name?.toLowerCase().includes(search.toLowerCase()) || m.phone?.includes(search) || m.email?.toLowerCase().includes(search.toLowerCase())
        const matchStatus = filterStatus === 'all' || m.status === filterStatus
        const matchPlan = filterPlan === 'all' || m.plan === filterPlan
        return matchSearch && matchStatus && matchPlan
    })

    const SortIcon = ({ col }) => {
        if (sortConfig.key !== col) return <ChevronUp size={13} style={{ opacity: 0.25 }} />
        return sortConfig.dir === 'asc' ? <ChevronUp size={13} color="#ff0033" /> : <ChevronDown size={13} color="#ff0033" />
    }

    const thStyle = (col) => ({
        padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.45)',
        fontSize: 12, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase',
        cursor: 'pointer', whiteSpace: 'nowrap',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
    })

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 28, color: 'white', letterSpacing: '-0.5px' }}>
                        Members
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginTop: 4 }}>
                        {members.length} total members
                    </p>
                </div>
                <button
                    onClick={() => { setEditMember(null); setModalOpen(true) }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px',
                        background: 'linear-gradient(135deg, #ff0033, #cc0025)',
                        border: 'none', borderRadius: 10, color: 'white',
                        fontWeight: 600, fontSize: 14, cursor: 'pointer',
                    }}
                >
                    <Plus size={17} /> Add Member
                </button>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: 16,
            }}>
                <div style={{ position: 'relative', flex: '1 1 220px' }}>
                    <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search by name, phone, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: 36 }}
                    />
                </div>
                <select
                    className="form-input"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ maxWidth: 150, cursor: 'pointer' }}
                >
                    <option value="all" style={{ background: '#1a1a1a' }}>All Status</option>
                    <option value="active" style={{ background: '#1a1a1a' }}>Active</option>
                    <option value="expired" style={{ background: '#1a1a1a' }}>Expired</option>
                </select>
                <select
                    className="form-input"
                    value={filterPlan}
                    onChange={(e) => setFilterPlan(e.target.value)}
                    style={{ maxWidth: 150, cursor: 'pointer' }}
                >
                    <option value="all" style={{ background: '#1a1a1a' }}>All Plans</option>
                    {PLANS.map((p) => <option key={p} value={p} style={{ background: '#1a1a1a' }}>{p}</option>)}
                </select>
            </div>

            {/* Table */}
            <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, overflow: 'hidden',
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                                {[
                                    { label: 'Name', key: 'name' },
                                    { label: 'Phone', key: 'phone' },
                                    { label: 'Plan', key: 'plan' },
                                    { label: 'Join Date', key: 'join_date' },
                                    { label: 'Expiry', key: 'expiry_date' },
                                    { label: 'Amount', key: 'payment_amount' },
                                    { label: 'Status', key: 'status' },
                                    { label: 'Actions', key: null },
                                ].map(({ label, key }) => (
                                    <th key={label} style={thStyle(key)} onClick={() => key && handleSort(key)}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                            {label}
                                            {key && <SortIcon col={key} />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'rgba(255,255,255,0.35)' }}>
                                        Loading members...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'rgba(255,255,255,0.35)' }}>
                                        {search || filterStatus !== 'all' || filterPlan !== 'all' ? 'No members match the filters.' : 'No members yet. Add your first member!'}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((m, idx) => (
                                    <motion.tr
                                        key={m.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.04)',
                                            transition: 'background 0.15s',
                                        }}
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
                                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{m.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>{m.phone}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '4px 10px',
                                                background: 'rgba(255,255,255,0.07)', borderRadius: 6,
                                                color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600,
                                            }}>{m.plan}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
                                            {m.join_date ? new Date(m.join_date).toLocaleDateString('en-IN') : '—'}
                                        </td>
                                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>
                                            {m.expiry_date ? new Date(m.expiry_date).toLocaleDateString('en-IN') : '—'}
                                        </td>
                                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600 }}>
                                            {m.payment_amount ? `₹${Number(m.payment_amount).toLocaleString('en-IN')}` : '—'}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <Badge status={m.status} />
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button
                                                    onClick={() => { setEditMember(m); setModalOpen(true) }}
                                                    style={{
                                                        padding: '7px 14px', background: 'rgba(255,255,255,0.06)',
                                                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                                                        color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 13,
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                                                >
                                                    <Edit2 size={13} /> Edit
                                                </button>
                                                {deleteId === m.id ? (
                                                    <div style={{ display: 'flex', gap: 6 }}>
                                                        <button
                                                            onClick={() => handleDelete(m.id)}
                                                            style={{
                                                                padding: '7px 12px', background: 'rgba(239,68,68,0.15)',
                                                                border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8,
                                                                color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                                                            }}
                                                        >Confirm</button>
                                                        <button
                                                            onClick={() => setDeleteId(null)}
                                                            style={{
                                                                padding: '7px 10px', background: 'rgba(255,255,255,0.05)',
                                                                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                                                                color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 12,
                                                            }}
                                                        >Cancel</button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteId(m.id)}
                                                        style={{
                                                            padding: '7px 10px', background: 'rgba(239,68,68,0.08)',
                                                            border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8,
                                                            color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                        }}
                                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)' }}
                                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <MemberModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditMember(null) }}
                member={editMember}
                onSave={fetchMembers}
            />
        </div>
    )
}
