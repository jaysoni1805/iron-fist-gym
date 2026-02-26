import { Link } from 'react-router-dom'
import { Zap, Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
    return (
        <footer style={{
            background: '#080808',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '64px 24px 32px',
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 48,
                    marginBottom: 48,
                }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <div style={{
                                width: 36, height: 36,
                                background: 'linear-gradient(135deg, #ff0033, #cc0025)',
                                borderRadius: 8,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Zap size={18} color="white" strokeWidth={2.5} />
                            </div>
                            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22, color: 'white' }}>
                                IRON<span style={{ color: '#ff0033' }}>FIT</span>
                            </span>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontSize: 14, maxWidth: 280 }}>
                            Transform your body and mind at the most premium fitness facility in the city. Your best self starts here.
                        </p>
                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                                <a key={i} href="#" style={{
                                    width: 38, height: 38,
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 8,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'rgba(255,255,255,0.6)',
                                    transition: 'all 0.3s',
                                    textDecoration: 'none',
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,0,51,0.15)'
                                        e.currentTarget.style.borderColor = 'rgba(255,0,51,0.4)'
                                        e.currentTarget.style.color = '#ff0033'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                                    }}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 20, letterSpacing: '0.5px' }}>Quick Links</h4>
                        {['Home', 'Programs', 'Pricing', 'Testimonials', 'Contact'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} style={{
                                display: 'block', color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
                                fontSize: 14, marginBottom: 12, transition: 'color 0.2s',
                            }}
                                onMouseEnter={(e) => (e.target.style.color = '#ff0033')}
                                onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.5)')}
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Programs */}
                    <div>
                        <h4 style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 20, letterSpacing: '0.5px' }}>Programs</h4>
                        {['Strength Training', 'HIIT Cardio', 'Yoga & Flexibility', 'Personal Training', 'Group Classes'].map((item) => (
                            <a key={item} href="#programs" style={{
                                display: 'block', color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
                                fontSize: 14, marginBottom: 12, transition: 'color 0.2s',
                            }}
                                onMouseEnter={(e) => (e.target.style.color = '#ff0033')}
                                onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.5)')}
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 20, letterSpacing: '0.5px' }}>Contact Us</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {[
                                { icon: MapPin, text: '123 Fitness Street, Bhopal, MP 462001' },
                                { icon: Phone, text: '+91 98765 43210' },
                                { icon: Mail, text: 'hello@ironfit.in' },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                    <Icon size={16} color="#ff0033" style={{ marginTop: 2, flexShrink: 0 }} />
                                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.5 }}>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: 24,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 16,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
                        © {new Date().getFullYear()} IronFit Gym. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: 24 }}>
                        {['Privacy Policy', 'Terms of Service'].map((item) => (
                            <a key={item} href="#" style={{
                                color: 'rgba(255,255,255,0.35)', textDecoration: 'none', fontSize: 13,
                                transition: 'color 0.2s',
                            }}
                                onMouseEnter={(e) => (e.target.style.color = '#ff0033')}
                                onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.35)')}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
