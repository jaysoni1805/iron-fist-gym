import { useRef, useState, lazy, Suspense } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Star, ChevronRight, ChevronDown, Phone, Award, Users, Dumbbell, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'

const DumbbellScene = lazy(() => import('../components/DumbbellScene'))


function FadingSection({ children, delay = 0 }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-80px' })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, delay, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    )
}

// FAQ Item
function FAQItem({ question, answer }) {
    const [open, setOpen] = useState(false)
    return (
        <div style={{
            background: open ? 'rgba(255,0,51,0.05)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${open ? 'rgba(255,0,51,0.25)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: 14,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            marginBottom: 12,
        }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '20px 24px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left', gap: 16,
                }}
            >
                <span style={{ color: 'white', fontWeight: 600, fontSize: 16, lineHeight: 1.4 }}>{question}</span>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} style={{ flexShrink: 0 }}>
                    <ChevronDown size={20} color={open ? '#ff0033' : 'rgba(255,255,255,0.4)'} />
                </motion.div>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <p style={{
                            color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.75,
                            padding: '0 24px 20px', margin: 0,
                        }}>
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const programs = [
    {
        title: 'Strength & Power',
        description: 'Build raw strength with heavy compound lifts, progressive overload principles, and expert programming.',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
        tag: 'Popular',
        duration: '60 min / session',
    },
    {
        title: 'HIIT Cardio Blast',
        description: 'Torch fat and boost endurance with high-intensity interval training designed for maximum results.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
        tag: 'Fat Burn',
        duration: '45 min / session',
    },
    {
        title: 'Personal Training',
        description: 'One-on-one coaching with certified trainers. Custom plans tailored to your unique goals and fitness level.',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80',
        tag: 'Premium',
        duration: 'Flexible',
    },
]

const plans = [
    {
        name: 'Basic',
        price: 999,
        period: 'month',
        description: 'Perfect for beginners starting their fitness journey.',
        features: ['Gym Access (6 AM – 10 PM)', 'Locker Room Access', 'Basic Equipment', '1 Group Class/Week', 'Fitness Assessment'],
        notIncluded: ['Personal Trainer', 'Nutrition Plan'],
        highlight: false,
    },
    {
        name: 'Standard',
        price: 1999,
        period: 'month',
        description: 'The most popular plan for serious fitness enthusiasts.',
        features: ['Gym Access (24/7)', 'All Equipment Access', 'Unlimited Group Classes', '2 PT Sessions/Month', 'Nutrition Consultation', 'Progress Tracking'],
        notIncluded: ['Unlimited PT'],
        highlight: true,
    },
    {
        name: 'Premium',
        price: 3999,
        period: 'month',
        description: 'The ultimate fitness experience with dedicated support.',
        features: ['Gym Access (24/7)', 'All Equipment Access', 'Unlimited Group Classes', 'Unlimited PT Sessions', 'Custom Meal Plan', 'Priority Booking', 'Spa Access'],
        notIncluded: [],
        highlight: false,
    },
]

const testimonials = [
    {
        name: 'Priya Sharma',
        role: 'Lost 18kg in 6 months',
        text: 'IronFit completely transformed my life. The trainers here are world-class and the facility is absolutely premium. I feel unstoppable!',
        rating: 5,
        avatar: 'PS',
        avatarColor: 'linear-gradient(135deg, #ff0033, #cc0025)',
    },
    {
        name: 'Rahul Verma',
        role: 'Gained 12kg muscle mass',
        text: 'Best gym in Bhopal, no question. The equipment is top-notch, the environment is electric, and the results speak for themselves.',
        rating: 5,
        avatar: 'RV',
        avatarColor: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
    },
    {
        name: 'Ananya Singh',
        role: 'Marathon runner',
        text: 'The HIIT classes here are incredible. My stamina has doubled and I finished my first marathon. The coaches truly care about your progress.',
        rating: 5,
        avatar: 'AS',
        avatarColor: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
    },
    {
        name: 'Vikram Patel',
        role: 'Lost 10kg in 3 months',
        text: 'Joined IronFit after trying 3 other gyms. Nothing compares. The 24/7 access and personalized plans are exactly what I needed to stay consistent.',
        rating: 5,
        avatar: 'VP',
        avatarColor: 'linear-gradient(135deg, #10b981, #059669)',
    },
]

const faqs = [
    {
        question: 'What are the gym timings?',
        answer: 'Our Standard and Premium plan members enjoy 24/7 gym access. Basic plan members can access the gym from 6 AM to 10 PM, seven days a week including weekends and public holidays.',
    },
    {
        question: 'Do you offer personal training sessions?',
        answer: 'Yes! Our certified personal trainers are available for one-on-one sessions. Standard plan includes 2 sessions/month, while Premium plan offers unlimited PT sessions. You can also book additional sessions separately.',
    },
    {
        question: 'Can I freeze my membership?',
        answer: 'Absolutely. We offer membership freeze options for up to 30 days per year. Simply visit the front desk or contact us via WhatsApp to request a freeze.',
    },
    {
        question: 'Do you provide nutrition guidance?',
        answer: 'Standard and Premium members get access to nutrition consultation sessions. Our trainers can help you build a custom meal plan aligned with your fitness goals.',
    },
    {
        question: 'Is there a joining fee?',
        answer: 'There is a one-time registration fee of ₹500 for all new members which covers your fitness assessment, locker assignment, and welcome kit.',
    },
]

const whatsappNumber = '+919876543210'
const whatsappMessage = 'Hello! I am interested in joining IronFit Gym. Could you please share more details about your membership plans?'

export default function Home() {
    const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' })
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formError, setFormError] = useState('')
    const [testimonialIdx, setTestimonialIdx] = useState(0)

    const handleContactSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        if (!contactForm.name || !contactForm.email || !contactForm.message) {
            setFormError('Please fill in all required fields.')
            return
        }
        setSubmitting(true)
        try {
            const { error } = await supabase.from('contacts').insert([{
                name: contactForm.name,
                email: contactForm.email,
                phone: contactForm.phone,
                message: contactForm.message,
            }])
            if (error) {
                setFormError('Failed to send message. Please try again later.')
                setSubmitting(false)
                return
            }
            setSubmitting(false)
            setSubmitted(true)
            setContactForm({ name: '', email: '', phone: '', message: '' })
        } catch {
            setFormError('An unexpected error occurred. Please try again.')
            setSubmitting(false)
        }
    }

    const nextTestimonial = () => setTestimonialIdx((i) => (i + 1) % testimonials.length)
    const prevTestimonial = () => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length)

    return (
        <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
            <Navbar />

            {/* ===== HERO SECTION ===== */}
            <section
                id="home"
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '100px 24px 80px',
                }}
            >
                {/* Animated background glow */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse 70% 55% at 50% -5%, rgba(255,0,51,0.22) 0%, transparent 65%)',
                }} />
                <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
                        width: 700, height: 700, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,0,51,0.15), transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
                    background: 'linear-gradient(to top, #0a0a0a, transparent)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }} />

                <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
                    <div className="hero-grid">

                        {/* Left content */}
                        <motion.div
                            className="hero-text"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="section-badge"
                                style={{ marginBottom: 24 }}
                            >
                                🔥 #1 Premium Gym in Bhopal
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.7 }}
                                style={{
                                    fontFamily: 'Outfit, sans-serif',
                                    fontWeight: 900,
                                    fontSize: 'clamp(48px, 6.5vw, 84px)',
                                    lineHeight: 1.0,
                                    letterSpacing: '-2.5px',
                                    color: 'white',
                                    marginBottom: 28,
                                }}
                            >
                                YOUR BEST
                                <br />
                                <span style={{ color: '#ff0033' }}>SELF STARTS</span>
                                <br />
                                HERE
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45, duration: 0.6 }}
                                style={{
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: 18,
                                    lineHeight: 1.75,
                                    maxWidth: 500,
                                    marginBottom: 40,
                                }}
                            >
                                Join the most elite fitness facility in the city. Expert trainers, cutting-edge equipment, and a community that pushes you beyond your limits every single day.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="hero-ctas"
                            >
                                <a href="#pricing" className="btn-primary" style={{ fontSize: 16 }}>
                                    Start Your Journey <ArrowRight size={18} />
                                </a>
                                <a href="#programs" className="btn-outline" style={{ fontSize: 16 }}>
                                    View Programs <ChevronRight size={18} />
                                </a>
                            </motion.div>

                            {/* Stats row */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.6 }}
                                className="hero-stats"
                            >
                                {[
                                    { value: '2000+', label: 'Members' },
                                    { value: '50+', label: 'Expert Trainers' },
                                    { value: '98%', label: 'Success Rate' },
                                ].map(({ value, label }) => (
                                    <div key={label}>
                                        <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 32, color: '#ff0033' }}>{value}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 2 }}>{label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Right 3D Canvas */}
                        <motion.div
                            className="hero-canvas"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                            style={{ position: 'relative' }}
                        >
                            <Suspense fallback={
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ width: 60, height: 60, border: '3px solid rgba(255,0,51,0.3)', borderTopColor: '#ff0033', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                </div>
                            }>
                                <DumbbellScene />
                            </Suspense>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    }}
                >
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll</span>
                    <div style={{
                        width: 22, height: 36, border: '2px solid rgba(255,255,255,0.15)',
                        borderRadius: 12, display: 'flex', justifyContent: 'center', paddingTop: 6,
                    }}>
                        <motion.div
                            animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ width: 4, height: 8, background: '#ff0033', borderRadius: 2 }}
                        />
                    </div>
                </motion.div>
            </section>

            {/* ===== WHY CHOOSE US ===== */}
            <section className="section-pad" style={{ position: 'relative', background: '#080808' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <FadingSection>
                        <div style={{ textAlign: 'center', marginBottom: 72 }}>
                            <div className="section-badge">Why Choose Us</div>
                            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', color: 'white', letterSpacing: '-1px' }}>
                                The IronFit Difference
                            </h2>
                        </div>
                    </FadingSection>

                    <div className="grid-4">
                        {[
                            {
                                icon: Award,
                                title: 'Certified Trainers',
                                description: 'Every trainer at IronFit holds internationally recognized certifications. Your safety, form, and results are always our top priority.',
                                color: '#ff0033',
                            },
                            {
                                icon: Users,
                                title: 'Personalized Plans',
                                description: 'No two bodies are the same. Get fully customized workout and nutrition plans designed specifically for your goals.',
                                color: '#ff6600',
                            },
                            {
                                icon: Dumbbell,
                                title: 'Modern Equipment',
                                description: 'State-of-the-art machines and free weights from the world\'s top manufacturers. Everything you need for peak performance.',
                                color: '#ffcc00',
                            },
                            {
                                icon: Clock,
                                title: 'Flexible Membership',
                                description: '24/7 access, multiple plan options, and zero lock-in contracts. Fitness that fits your lifestyle — not the other way around.',
                                color: '#22c55e',
                            },
                        ].map(({ icon: Icon, title, description, color }, i) => (
                            <FadingSection key={title} delay={i * 0.12}>
                                <div
                                    className="glass-card"
                                    style={{ padding: 36, height: '100%', transition: 'all 0.3s ease', cursor: 'default' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = `${color}40`
                                        e.currentTarget.style.transform = 'translateY(-6px)'
                                        e.currentTarget.style.boxShadow = `0 20px 50px ${color}15`
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                                        e.currentTarget.style.transform = 'translateY(0)'
                                        e.currentTarget.style.boxShadow = 'none'
                                    }}
                                >
                                    <div style={{
                                        width: 58, height: 58,
                                        background: `${color}18`,
                                        border: `1px solid ${color}30`,
                                        borderRadius: 16,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: 24,
                                    }}>
                                        <Icon size={26} color={color} />
                                    </div>
                                    <h3 style={{ color: 'white', fontWeight: 700, fontSize: 20, marginBottom: 14, fontFamily: 'Outfit, sans-serif' }}>{title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, fontSize: 15 }}>{description}</p>
                                </div>
                            </FadingSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TRANSFORMATION SECTION ===== */}
            <section className="section-pad" style={{ background: '#0a0a0a', overflow: 'hidden' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <FadingSection>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <div className="section-badge">Transformations</div>
                            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', color: 'white', letterSpacing: '-1px' }}>
                                Real Results, Real People
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 16, fontSize: 17 }}>
                                See what's possible in just 90 days at IronFit.
                            </p>
                        </div>
                    </FadingSection>
                    <div className="transform-grid">
                        {[
                            { name: 'Priya S.', time: '6 months', before: 82, after: 64, unit: 'kg', tag: 'Fat Loss' },
                            { name: 'Rahul V.', time: '4 months', before: 68, after: 80, unit: 'kg', tag: 'Muscle Gain' },
                            { name: 'Amit K.', time: '3 months', before: 29, after: 22, unit: '% body fat', tag: 'Body Recomp' },
                        ].map((t, i) => (
                            <FadingSection key={t.name} delay={i * 0.15}>
                                <div style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: 20, overflow: 'hidden',
                                    transition: 'transform 0.3s ease',
                                }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                                >
                                    {/* Before / After visual */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 160, position: 'relative' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Before</span>
                                            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 36, color: 'rgba(255,255,255,0.5)' }}>{t.before}</span>
                                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{t.unit}</span>
                                        </div>
                                        <div style={{ background: 'rgba(255,0,51,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                            <span style={{ color: '#ff0033', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>After</span>
                                            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 36, color: 'white' }}>{t.after}</span>
                                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{t.unit}</span>
                                        </div>
                                        {/* Divider */}
                                        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'rgba(255,0,51,0.4)', transform: 'translateX(-50%)' }} />
                                        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', background: '#ff0033', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, boxShadow: '0 0 16px rgba(255,0,51,0.5)' }}>
                                            <ArrowRight size={14} color="white" />
                                        </div>
                                    </div>
                                    <div style={{ padding: '20px 24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{t.name}</div>
                                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 2 }}>{t.time} journey</div>
                                            </div>
                                            <span style={{
                                                padding: '4px 12px', background: 'rgba(255,0,51,0.12)',
                                                border: '1px solid rgba(255,0,51,0.25)', borderRadius: 100,
                                                color: '#ff0033', fontSize: 12, fontWeight: 700,
                                            }}>{t.tag}</span>
                                        </div>
                                    </div>
                                </div>
                            </FadingSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PROGRAMS SECTION ===== */}
            <section id="programs" className="section-pad" style={{ background: '#080808' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <FadingSection>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <div className="section-badge">Our Programs</div>
                            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', color: 'white', letterSpacing: '-1px' }}>
                                Find Your Perfect Program
                            </h2>
                        </div>
                    </FadingSection>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        {programs.map((program, i) => (
                            <FadingSection key={program.title} delay={0.1}>
                                <div
                                    className={`glass-card program-card${i % 2 !== 0 ? ' reverse' : ''}`}
                                    style={{ padding: 0, border: '1px solid rgba(255,255,255,0.08)' }}
                                >
                                    <img
                                        src={program.image}
                                        alt={program.title}
                                        loading="lazy"
                                        className="program-img"
                                    />
                                    <div className="program-body">
                                        <span style={{
                                            display: 'inline-block', padding: '4px 12px',
                                            background: 'rgba(255,0,51,0.15)', border: '1px solid rgba(255,0,51,0.3)',
                                            borderRadius: 100, color: '#ff0033', fontSize: 12, fontWeight: 700,
                                            letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16, width: 'fit-content',
                                        }}>
                                            {program.tag}
                                        </span>
                                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 28, color: 'white', marginBottom: 16, letterSpacing: '-0.5px' }}>
                                            {program.title}
                                        </h3>
                                        <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontSize: 16, marginBottom: 24 }}>
                                            {program.description}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <span style={{ color: '#ff0033', fontWeight: 600, fontSize: 14 }}>⏱ {program.duration}</span>
                                            <a href="#pricing" className="btn-primary" style={{ padding: '10px 24px', fontSize: 14 }}>
                                                Get Started <ArrowRight size={14} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </FadingSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PRICING SECTION ===== */}
            <section id="pricing" className="section-pad">
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <FadingSection>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <div className="section-badge">Pricing Plans</div>
                            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', color: 'white', letterSpacing: '-1px' }}>
                                Invest In Yourself
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 16, fontSize: 17 }}>
                                No commitment required. Cancel anytime.
                            </p>
                        </div>
                    </FadingSection>

                    <div className="grid-3">
                        {plans.map((plan, i) => (
                            <FadingSection key={plan.name} delay={i * 0.1}>
                                <div
                                    style={{
                                        background: plan.highlight ? 'rgba(255,0,51,0.06)' : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${plan.highlight ? 'rgba(255,0,51,0.4)' : 'rgba(255,255,255,0.08)'}`,
                                        borderRadius: 20, padding: '36px 32px',
                                        position: 'relative', height: '100%',
                                        transition: 'transform 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)' }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                                >
                                    {plan.highlight && (
                                        <div style={{
                                            position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                                            padding: '6px 20px', background: 'linear-gradient(135deg,#ff0033,#cc0025)',
                                            borderRadius: 100, color: 'white', fontSize: 12, fontWeight: 700,
                                            letterSpacing: '1px', whiteSpace: 'nowrap',
                                        }}>
                                            MOST POPULAR
                                        </div>
                                    )}
                                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 22, color: 'white', marginBottom: 8 }}>
                                        {plan.name}
                                    </h3>
                                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 24 }}>{plan.description}</p>
                                    <div style={{ marginBottom: 28 }}>
                                        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 52, color: 'white' }}>
                                            ₹{plan.price.toLocaleString('en-IN')}
                                        </span>
                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>/{plan.period}</span>
                                    </div>
                                    <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {plan.features.map((f) => (
                                            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,0,51,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <Check size={11} color="#ff0033" strokeWidth={3} />
                                                </div>
                                                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{f}</span>
                                            </div>
                                        ))}
                                        {plan.notIncluded.map((f) => (
                                            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: 0.4 }}>
                                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <span style={{ fontSize: 12, color: 'white' }}>-</span>
                                                </div>
                                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textDecoration: 'line-through' }}>{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <a
                                        href="#contact"
                                        style={{
                                            display: 'block', textAlign: 'center', padding: '14px 24px',
                                            background: plan.highlight ? 'linear-gradient(135deg, #ff0033, #cc0025)' : 'rgba(255,255,255,0.06)',
                                            color: 'white', fontWeight: 600, fontSize: 15,
                                            borderRadius: 10, textDecoration: 'none',
                                            border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.12)',
                                            transition: 'all 0.3s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!plan.highlight) {
                                                e.currentTarget.style.background = 'rgba(255,0,51,0.1)'
                                                e.currentTarget.style.borderColor = 'rgba(255,0,51,0.4)'
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!plan.highlight) {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                                            }
                                        }}
                                    >
                                        Get Started
                                    </a>
                                </div>
                            </FadingSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS SECTION ===== */}
            <section id="testimonials" className="section-pad" style={{ background: '#080808' }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <FadingSection>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <div className="section-badge">Testimonials</div>
                            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', color: 'white', letterSpacing: '-1px' }}>
                                Real People, Real Results
                            </h2>
                        </div>
                    </FadingSection>

                    {/* Carousel */}
                    <div style={{ position: 'relative' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={testimonialIdx}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className="glass-card testimonial-card"
                                style={{ textAlign: 'center' }}
                            >
                                {/* Stars */}
                                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 28 }}>
                                    {Array.from({ length: testimonials[testimonialIdx].rating }).map((_, j) => (
                                        <Star key={j} size={20} fill="#ff0033" color="#ff0033" />
                                    ))}
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, fontSize: 18, fontStyle: 'italic', marginBottom: 36, maxWidth: 640, margin: '0 auto 36px' }}>
                                    "{testimonials[testimonialIdx].text}"
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center' }}>
                                    <div style={{
                                        width: 52, height: 52, borderRadius: '50%',
                                        background: testimonials[testimonialIdx].avatarColor,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 700, fontSize: 16, color: 'white', flexShrink: 0,
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                                    }}>
                                        {testimonials[testimonialIdx].avatar}
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>{testimonials[testimonialIdx].name}</div>
                                        <div style={{ color: '#ff0033', fontSize: 14, fontWeight: 500, marginTop: 2 }}>{testimonials[testimonialIdx].role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginTop: 32 }}>
                            <button
                                onClick={prevTestimonial}
                                style={{
                                    width: 40, height: 40, borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,0,51,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,0,51,0.3)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                            >
                                <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
                            </button>
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setTestimonialIdx(i)}
                                    style={{
                                        width: i === testimonialIdx ? 24 : 8, height: 8, borderRadius: 4,
                                        background: i === testimonialIdx ? '#ff0033' : 'rgba(255,255,255,0.2)',
                                        border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0,
                                    }}
                                />
                            ))}
                            <button
                                onClick={nextTestimonial}
                                style={{
                                    width: 40, height: 40, borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,0,51,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,0,51,0.3)' }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FAQ SECTION ===== */}
            <section className="section-pad" style={{ background: '#0a0a0a' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <FadingSection>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <div className="section-badge">FAQ</div>
                            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', color: 'white', letterSpacing: '-1px' }}>
                                Frequently Asked Questions
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 16, fontSize: 17 }}>
                                Everything you need to know before joining.
                            </p>
                        </div>
                    </FadingSection>
                    <FadingSection delay={0.15}>
                        <div>
                            {faqs.map((faq) => (
                                <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                    </FadingSection>
                </div>
            </section>

            {/* ===== CONTACT SECTION ===== */}
            <section id="contact" className="section-pad" style={{ background: '#080808' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <FadingSection>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <div className="section-badge">Contact Us</div>
                            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', color: 'white', letterSpacing: '-1px' }}>
                                Start Your Journey Today
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 14, fontSize: 16 }}>
                                Fill out the form and we'll get back to you within 24 hours.
                            </p>
                        </div>
                    </FadingSection>

                    <div className="contact-grid">
                        {/* Contact Form */}
                        <FadingSection delay={0.1}>
                            <div className="glass-card" style={{ padding: '44px 48px' }}>
                                {submitted ? (
                                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                                        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                                        <h3 style={{ color: 'white', fontWeight: 700, fontSize: 24, marginBottom: 10 }}>Message Received!</h3>
                                        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15 }}>
                                            Thank you! Our team will reach out to you within 24 hours.
                                        </p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="btn-primary"
                                            style={{ marginTop: 28 }}
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="Full Name"
                                                value={contactForm.name}
                                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                            />
                                            <input
                                                type="tel"
                                                className="form-input"
                                                placeholder="Phone Number"
                                                value={contactForm.phone}
                                                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                            />
                                        </div>
                                        <input
                                            type="email"
                                            className="form-input"
                                            placeholder="Email Address"
                                            value={contactForm.email}
                                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                        />
                                        <textarea
                                            className="form-input"
                                            placeholder="Your Message"
                                            rows={5}
                                            value={contactForm.message}
                                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                            style={{ resize: 'vertical' }}
                                        />
                                        {formError && (
                                            <p style={{ color: '#ff0033', fontSize: 14, textAlign: 'center' }}>{formError}</p>
                                        )}
                                        <button
                                            type="submit"
                                            className="btn-primary"
                                            disabled={submitting}
                                            style={{ justifyContent: 'center', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'wait' : 'pointer' }}
                                        >
                                            {submitting ? 'Sending...' : 'Send Message'}
                                            {!submitting && <ArrowRight size={18} />}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </FadingSection>

                        {/* Map + Info */}
                        <FadingSection delay={0.2}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {/* Google Maps Embed */}
                                <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', height: 280 }}>
                                    <iframe
                                        title="IronFit Gym Location"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117834.90476523178!2d77.3545!3d23.2599!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c428f8fd68fbd%3A0x2155716d572d4f8!2sBhopal%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1640000000000"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, filter: 'grayscale(30%) invert(90%) hue-rotate(180deg)' }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                                {/* Contact info */}
                                <div className="glass-card" style={{ padding: '28px 32px' }}>
                                    {[
                                        { icon: '📍', label: 'Address', value: '123 Fitness Street, Bhopal, MP 462001' },
                                        { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
                                        { icon: '📧', label: 'Email', value: 'badmosh559@gmail.com' },
                                        { icon: '🕐', label: 'Hours', value: 'Mon–Sun: 24/7 (Standard & Premium)' },
                                    ].map((item) => (
                                        <div key={item.label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
                                            <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                                            <div>
                                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</div>
                                                <div style={{ color: 'white', fontSize: 14 }}>{item.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadingSection>
                    </div>
                </div>
            </section>

            <Footer />

            {/* ===== WHATSAPP FLOATING BUTTON ===== */}
            <motion.a
                href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2, duration: 0.5, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #25d366, #128c7e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(37,211,102,0.4)',
                    textDecoration: 'none',
                }}
                title="Chat with us on WhatsApp"
            >
                <Phone size={26} color="white" fill="white" />
            </motion.a>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
