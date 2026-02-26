import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Text, Center, OrbitControls, Float } from '@react-three/drei'
import { ArrowRight, Check, Star, ChevronRight, Flame, Users, Trophy, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'


// Animated Dumbbell 3D Component
function Dumbbell3D() {
    return (
        <group rotation={[0, 0, 0]}>
            {/* Main bar - rotated to X axis */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.06, 3.2, 16]} />
                <meshStandardMaterial color="#666" metalness={1} roughness={0.1} />
            </mesh>

            {/* Left weights */}
            <group position={[-1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <mesh position={[0, 0.15, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.4, 32]} />
                    <meshStandardMaterial color="#ff0033" metalness={0.7} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.5, 0]}>
                    <cylinderGeometry args={[0.42, 0.42, 0.3, 32]} />
                    <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
                </mesh>
            </group>

            {/* Right weights */}
            <group position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <mesh position={[0, -0.15, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 0.4, 32]} />
                    <meshStandardMaterial color="#ff0033" metalness={0.7} roughness={0.2} />
                </mesh>
                <mesh position={[0, -0.5, 0]}>
                    <cylinderGeometry args={[0.42, 0.42, 0.3, 32]} />
                    <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
                </mesh>
            </group>

            {/* Knurling / Grips details */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.08, 1.2, 16]} />
                <meshStandardMaterial color="#222" metalness={0.5} roughness={0.8} />
            </mesh>
        </group>
    )
}

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
    },
    {
        name: 'Rahul Verma',
        role: 'Gained 12kg muscle mass',
        text: 'Best gym in Bhopal, no question. The equipment is top-notch, the environment is electric, and the results speak for themselves.',
        rating: 5,
        avatar: 'RV',
    },
    {
        name: 'Ananya Singh',
        role: 'Marathon runner',
        text: 'The HIIT classes here are incredible. My stamina has doubled and I finished my first marathon. The coaches truly care about your progress.',
        rating: 5,
        avatar: 'AS',
    },
]

export default function Home() {
    const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' })
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formError, setFormError] = useState('')

    const handleContactSubmit = async (e) => {
        e.preventDefault()
        setFormError('')
        if (!contactForm.name || !contactForm.email || !contactForm.message) {
            setFormError('Please fill in all required fields.')
            return
        }
        setSubmitting(true)
        // Store contact in Supabase contacts table (best effort)
        try {
            await supabase.from('contacts').insert([{
                name: contactForm.name,
                email: contactForm.email,
                phone: contactForm.phone,
                message: contactForm.message,
            }])
        } catch (_) { }
        setTimeout(() => {
            setSubmitting(false)
            setSubmitted(true)
            setContactForm({ name: '', email: '', phone: '', message: '' })
        }, 1000)
    }

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
                    padding: '80px 24px 60px',
                }}
            >
                {/* Background gradients */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(255,0,51,0.2) 0%, transparent 70%)',
                }} />
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
                    background: 'linear-gradient(to top, #0a0a0a, transparent)',
                    pointerEvents: 'none',
                }} />

                {/* Grid pattern overlay */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }} />

                <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}
                        className="grid-cols-1 lg:grid-cols-2">

                        {/* Left content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                        >
                            <div className="section-badge" style={{ marginBottom: 24 }}>
                                🔥 #1 Premium Gym in Bhopal
                            </div>

                            <h1 style={{
                                fontFamily: 'Outfit, sans-serif',
                                fontWeight: 900,
                                fontSize: 'clamp(42px, 6vw, 76px)',
                                lineHeight: 1.05,
                                letterSpacing: '-2px',
                                color: 'white',
                                marginBottom: 28,
                            }}>
                                YOUR BEST
                                <br />
                                <span style={{ color: '#ff0033' }}>SELF STARTS</span>
                                <br />
                                HERE
                            </h1>

                            <p style={{
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: 18,
                                lineHeight: 1.7,
                                maxWidth: 500,
                                marginBottom: 40,
                            }}>
                                Join the most elite fitness facility in the city. Expert trainers, cutting-edge equipment, and a community that pushes you beyond your limits every single day.
                            </p>

                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                <a href="#pricing" className="btn-primary" style={{ fontSize: 16 }}>
                                    Start Your Journey <ArrowRight size={18} />
                                </a>
                                <a href="#programs" className="btn-outline" style={{ fontSize: 16 }}>
                                    View Programs <ChevronRight size={18} />
                                </a>
                            </div>

                            {/* Stats row */}
                            <div style={{ display: 'flex', gap: 40, marginTop: 48, flexWrap: 'wrap' }}>
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
                            </div>
                        </motion.div>

                        {/* Right 3D Canvas */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                            style={{ height: 420, position: 'relative' }}
                        >
                            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                                <ambientLight intensity={0.5} />
                                <directionalLight position={[5, 5, 5]} intensity={1.5} />
                                <pointLight position={[-3, -3, -3]} color="#ff0033" intensity={2} />
                                <pointLight position={[3, 3, 0]} color="#ffffff" intensity={0.5} />
                                <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.8}>
                                    <Dumbbell3D />
                                </Float>
                                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
                            </Canvas>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== WHY CHOOSE US ===== */}
            <section style={{ padding: '100px 24px', position: 'relative' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <FadingSection>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <div className="section-badge">Why Choose Us</div>
                            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', color: 'white', letterSpacing: '-1px' }}>
                                The IronFit Difference
                            </h2>
                        </div>
                    </FadingSection>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                        {[
                            {
                                icon: Flame,
                                title: 'Elite Equipment',
                                description: 'State-of-the-art machines and free weights from the world\'s top manufacturers. Everything you need to achieve peak performance.',
                                color: '#ff0033',
                            },
                            {
                                icon: Users,
                                title: 'Expert Coaching',
                                description: 'Certified trainers with years of experience in strength, cardio, nutrition, and sports rehabilitation. Your goals are our mission.',
                                color: '#ff6600',
                            },
                            {
                                icon: Trophy,
                                title: 'Proven Results',
                                description: 'Over 98% member satisfaction rate. Thousands of transformation stories. We don\'t just promise results — we deliver them.',
                                color: '#ffcc00',
                            },
                        ].map(({ icon: Icon, title, description, color }, i) => (
                            <FadingSection key={title} delay={i * 0.15}>
                                <div
                                    className="glass-card"
                                    style={{ padding: 36 }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255,0,51,0.3)'
                                        e.currentTarget.style.transform = 'translateY(-4px)'
                                        e.currentTarget.style.transition = 'all 0.3s ease'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                                        e.currentTarget.style.transform = 'translateY(0)'
                                    }}
                                >
                                    <div style={{
                                        width: 56, height: 56,
                                        background: `rgba(255,0,51,0.1)`,
                                        border: `1px solid rgba(255,0,51,0.2)`,
                                        borderRadius: 14,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: 24,
                                    }}>
                                        <Icon size={26} color={color} />
                                    </div>
                                    <h3 style={{ color: 'white', fontWeight: 700, fontSize: 20, marginBottom: 14, fontFamily: 'Outfit, sans-serif' }}>{title}</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontSize: 15 }}>{description}</p>
                                </div>
                            </FadingSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PROGRAMS SECTION ===== */}
            <section id="programs" style={{ padding: '100px 24px', background: '#080808' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <FadingSection>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <div className="section-badge">Our Programs</div>
                            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', color: 'white', letterSpacing: '-1px' }}>
                                Find Your Perfect Program
                            </h2>
                        </div>
                    </FadingSection>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
                        {programs.map((program, i) => (
                            <FadingSection key={program.title} delay={0.1}>
                                <div
                                    className="glass-card"
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: i % 2 === 0 ? '380px 1fr' : '1fr 380px',
                                        gap: 0,
                                        overflow: 'hidden',
                                        padding: 0,
                                    }}
                                >
                                    <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                                        <img
                                            src={program.image}
                                            alt={program.title}
                                            style={{
                                                width: '100%', height: '100%', minHeight: 260,
                                                objectFit: 'cover', display: 'block',
                                            }}
                                        />
                                    </div>
                                    <div style={{ padding: '40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center', order: i % 2 === 0 ? 1 : 0 }}>
                                        <span style={{
                                            display: 'inline-block', padding: '4px 12px',
                                            background: 'rgba(255,0,51,0.15)', border: '1px solid rgba(255,0,51,0.3)',
                                            borderRadius: 100, color: '#ff0033', fontSize: 12, fontWeight: 700,
                                            letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16,
                                            width: 'fit-content',
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
            <section id="pricing" style={{ padding: '100px 24px' }}>
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

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                        {plans.map((plan, i) => (
                            <FadingSection key={plan.name} delay={i * 0.1}>
                                <div
                                    style={{
                                        background: plan.highlight ? 'rgba(255,0,51,0.06)' : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${plan.highlight ? 'rgba(255,0,51,0.4)' : 'rgba(255,255,255,0.08)'}`,
                                        borderRadius: 20,
                                        padding: '36px 32px',
                                        position: 'relative',
                                        height: '100%',
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
                                            display: 'block', textAlign: 'center',
                                            padding: '14px 24px',
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
            <section id="testimonials" style={{ padding: '100px 24px', background: '#080808' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <FadingSection>
                        <div style={{ textAlign: 'center', marginBottom: 64 }}>
                            <div className="section-badge">Testimonials</div>
                            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', color: 'white', letterSpacing: '-1px' }}>
                                Real People, Real Results
                            </h2>
                        </div>
                    </FadingSection>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
                        {testimonials.map((t, i) => (
                            <FadingSection key={t.name} delay={i * 0.1}>
                                <div className="glass-card" style={{ padding: 32 }}>
                                    <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                                        {Array.from({ length: t.rating }).map((_, j) => (
                                            <Star key={j} size={16} fill="#ff0033" color="#ff0033" />
                                        ))}
                                    </div>
                                    <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, fontSize: 15, marginBottom: 24, fontStyle: 'italic' }}>
                                        "{t.text}"
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #ff0033, #cc0025)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700, fontSize: 14, color: 'white', flexShrink: 0,
                                        }}>
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <div style={{ color: 'white', fontWeight: 600, fontSize: 15 }}>{t.name}</div>
                                            <div style={{ color: '#ff0033', fontSize: 13, fontWeight: 500 }}>{t.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </FadingSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CONTACT SECTION ===== */}
            <section id="contact" style={{ padding: '100px 24px' }}>
                <div style={{ maxWidth: 700, margin: '0 auto' }}>
                    <FadingSection>
                        <div style={{ textAlign: 'center', marginBottom: 48 }}>
                            <div className="section-badge">Contact Us</div>
                            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 4vw, 52px)', color: 'white', letterSpacing: '-1px' }}>
                                Start Your Journey Today
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 14, fontSize: 16 }}>
                                Fill out the form and we'll get back to you within 24 hours.
                            </p>
                        </div>
                    </FadingSection>

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
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="Full Name"
                                                value={contactForm.name}
                                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <input
                                                type="tel"
                                                className="form-input"
                                                placeholder="Phone Number"
                                                value={contactForm.phone}
                                                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <input
                                            type="email"
                                            className="form-input"
                                            placeholder="Email Address"
                                            value={contactForm.email}
                                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        <textarea
                                            className="form-input"
                                            placeholder="Your Message"
                                            rows={5}
                                            value={contactForm.message}
                                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>

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
                </div>
            </section>

            <Footer />
        </div>
    )
}
