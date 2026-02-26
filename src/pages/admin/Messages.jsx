import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Trash2, Clock, User, Phone, Search, RefreshCw, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Messages() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [deleteId, setDeleteId] = useState(null)
    const [selectedMessage, setSelectedMessage] = useState(null)

    const fetchMessages = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching messages:', error)
        } else {
            setMessages(data || [])
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchMessages()
    }, [fetchMessages])

    const handleDelete = async (id) => {
        const { error } = await supabase.from('contacts').delete().eq('id', id)
        if (!error) {
            setMessages(messages.filter(m => m.id !== id))
            if (selectedMessage?.id === id) setSelectedMessage(null)
        }
        setDeleteId(null)
    }

    const filtered = messages.filter(m =>
        !search ||
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.email?.toLowerCase().includes(search.toLowerCase()) ||
        m.message?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <div>
                    <h1 className="font-display font-extrabold text-3xl text-white tracking-tight">
                        Messages
                    </h1>
                    <p className="text-white/40 text-sm mt-1">
                        Contact form submissions from your website
                    </p>
                </div>
                <button
                    onClick={fetchMessages}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            <div className="mb-6 relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                    type="text"
                    placeholder="Search by name, email or message..."
                    className="form-input pl-12"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
                {/* Messages List */}
                <div className="lg:col-span-5 xl:col-span-4 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col min-h-0">
                    <div className="p-4 border-b border-white/5 bg-white/5">
                        <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
                            Inbox ({filtered.length})
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-8 text-center text-white/30 text-sm italic">Loading messages...</div>
                        ) : filtered.length === 0 ? (
                            <div className="p-8 text-center text-white/30 text-sm italic">No messages found</div>
                        ) : (
                            filtered.map((m, idx) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => setSelectedMessage(m)}
                                    className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.08] ${selectedMessage?.id === m.id ? 'bg-white/10 border-l-4 border-l-red-accent' : 'border-l-4 border-l-transparent'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-white truncate text-sm">{m.name}</span>
                                        <span className="text-[10px] text-white/30 whitespace-nowrap ml-2">
                                            {new Date(m.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="text-xs text-white/50 truncate mb-1">{m.email}</div>
                                    <p className="text-xs text-white/40 line-clamp-2 italic">"{m.message}"</p>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-7 xl:col-span-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col min-h-0 overflow-hidden">
                    {selectedMessage ? (
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-white/5">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-red-accent/10 border border-red-accent/20 flex items-center justify-center text-red-accent shrink-0">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white leading-tight">{selectedMessage.name}</h2>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="flex items-center gap-1 text-xs text-white/50">
                                                <Mail size={12} /> {selectedMessage.email}
                                            </span>
                                            {selectedMessage.phone && (
                                                <span className="flex items-center gap-1 text-xs text-white/50">
                                                    <Phone size={12} /> {selectedMessage.phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-1 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-white/30 text-[10px] font-bold uppercase tracking-widest">
                                        <Clock size={10} /> {new Date(selectedMessage.created_at).toLocaleString()}
                                    </span>

                                    {deleteId === selectedMessage.id ? (
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleDelete(selectedMessage.id)}
                                                className="px-3 py-1 bg-red-accent/20 text-red-accent border border-red-accent/30 rounded-lg text-xs font-bold hover:bg-red-accent hover:text-white transition-all"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(null)}
                                                className="px-3 py-1 bg-white/10 text-white/50 rounded-lg text-xs"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteId(selectedMessage.id)}
                                            className="p-2 bg-white/5 text-white/30 hover:text-red-accent hover:bg-red-accent/10 border border-white/10 hover:border-red-accent/20 rounded-lg transition-all"
                                            title="Delete message"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <div className="max-w-3xl">
                                    <span className="text-[10px] font-bold text-red-accent/60 uppercase tracking-widest mb-4 block">
                                        Message Body
                                    </span>
                                    <p className="text-white/80 leading-relaxed text-lg whitespace-pre-wrap italic">
                                        "{selectedMessage.message}"
                                    </p>

                                    <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl">
                                        <h3 className="text-white font-bold text-sm mb-4">Quick Reply</h3>
                                        <div className="flex gap-4">
                                            <a
                                                href={`mailto:${selectedMessage.email}`}
                                                className="btn-primary flex-1 justify-center text-sm py-2"
                                            >
                                                Reply via Email
                                            </a>
                                            {selectedMessage.phone && (
                                                <a
                                                    href={`tel:${selectedMessage.phone}`}
                                                    className="btn-outline flex-1 justify-center text-sm py-2"
                                                >
                                                    Call
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 mb-4 border border-white/10">
                                <Mail size={32} />
                            </div>
                            <h3 className="text-white/40 font-bold">Select a message to view details</h3>
                            <p className="text-white/20 text-sm mt-2 max-w-xs">
                                Choose a conversation from the left inbox to read the full inquiry.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
