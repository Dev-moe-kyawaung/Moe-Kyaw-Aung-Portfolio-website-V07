import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  profile,
  stats,
  socialLinks,
  githubAccounts,
  lovableLinks,
  projects,
  certificates,
  faq,
  pricing,
  testimonials
} from './data/content'

function useIntersectionFade() {
  useEffect(() => {
    const items = document.querySelectorAll('.fade')
    const io = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('show')),
      { threshold: 0.12 }
    )
    items.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Counter({ value }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let cur = 0
    const step = Math.max(1, Math.ceil(value / 120))
    const id = setInterval(() => {
      cur += step
      if (cur >= value) {
        cur = value
        clearInterval(id)
      }
      setCount(cur)
    }, 16)
    return () => clearInterval(id)
  }, [value])
  return <strong>{count}{value === 100 ? '%' : '+'}</strong>
}

function ParticleCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = 0, H = 0, pts = []

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = canvas.clientHeight
      pts = Array.from({ length: Math.min(120, Math.floor(W / 12)) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.4
      }))
    }

    const tick = () => {
      ctx.clearRect(0, 0, W, H)
      pts.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        ctx.beginPath()
        ctx.fillStyle = 'rgba(0,217,255,.7)'
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 125) {
            ctx.strokeStyle = `rgba(255,0,170,${1 - d / 125})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      requestAnimationFrame(tick)
    }

    window.addEventListener('resize', resize, { passive: true })
    resize()
    tick()
    return () => window.removeEventListener('resize', resize)
  }, [])
  return <canvas ref={canvasRef} aria-hidden="true" />
}

function App() {
  const [theme, setTheme] = useState('dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const [slide, setSlide] = useState(0)
  const [formMsg, setFormMsg] = useState('')
  const [lightbox, setLightbox] = useState(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [cursor2, setCursor2] = useState({ x: 0, y: 0 })

  useIntersectionFade()

  useEffect(() => {
    const saved = localStorage.getItem('mk_theme')
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('mk_theme', theme)
  }, [theme])

  useEffect(() => {
    const pre = document.getElementById('preloader')
    const t = setTimeout(() => { if (pre) pre.style.display = 'none' }, 500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const move = e => {
      setCursor({ x: e.clientX, y: e.clientY })
      setCursor2({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    const els = document.querySelectorAll('[data-parallax]')
    const onScroll = () => {
      const y = window.scrollY
      els.forEach(el => {
        const s = parseFloat(el.dataset.parallax || '0')
        el.style.transform = `translateY(${y * s * -0.12}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const slideCount = testimonials.length
  const currentTestimonial = useMemo(() => testimonials[slide], [slide])

  const submitForm = e => {
    e.preventDefault()
    const form = e.currentTarget
    const name = form.name.value.trim()
    const email = form.email.value.trim()
    const message = form.message.value.trim()
    if (!name || !email.includes('@') || !message) {
      setFormMsg('Please complete all fields with a valid email.')
      return
    }
    setFormMsg('Thanks — your message is ready to connect to a backend or email service.')
    form.reset()
  }

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="preloader" id="preloader"><div className="ring" aria-label="Loading" /></div>

      <div className="cursor" style={{ left: cursor.x, top: cursor.y }} />
      <div className="cursor2" style={{ left: cursor2.x, top: cursor2.y }} />

      <header>
        <div className="nav glass">
          <a className="brand" href="#home" onClick={() => setMenuOpen(false)}>
            <span className="brand-badge">M</span>
            <span>
              <span style={{ fontWeight: 800 }}>Moe-Kyaw-Aung-Portfolio V7</span><br />
              <small style={{ color: 'var(--muted)' }}>{profile.tag}</small>
            </span>
          </a>

          <nav className={`nav-links ${menuOpen ? 'open' : ''}`} id="navLinks">
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
            <a href="#collections" onClick={() => setMenuOpen(false)}>Collections</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>

          <div className="nav-actions">
            <button className="btn" id="themeToggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
              <i className={`fa-solid ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`} />
            </button>
            <button className="btn menu-btn" id="menuToggle" onClick={() => setMenuOpen(v => !v)} aria-label="Open menu">
              <i className="fa-solid fa-bars" />
            </button>
            <a className="btn primary" href="#contact"><i className="fa-solid fa-paper-plane" /> Hire Me</a>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="home">
          <ParticleCanvas />
          <div className="container hero-grid">
            <div className="fade parallax" data-parallax="0.18">
              <div className="eyebrow"><i className="fa-solid fa-bolt" /> Senior Android Developer | Kotlin | Jetpack Compose | Clean Architecture</div>
              <h1>⭐MOE KYAW AUNG ⭐<span className="grad">{profile.tag}</span></h1>
              <p className="lead">{profile.bio}</p>

              <div className="cta-row">
                <a className="btn primary" href="#projects">Explore Work</a>
                <a className="btn" href="https://github.com/Dev-moe-kyawaung/" target="_blank" rel="noreferrer"><i className="fa-brands fa-github" /> GitHub</a>
                <a className="btn" href="https://gravatar.com/moekyawaung13721" target="_blank" rel="noreferrer"><i className="fa-solid fa-id-card" /> Gravatar</a>
              </div>

              <div className="stats">
                {stats.map(s => (
                  <div className="stat glass" key={s.label}>
                    <Counter value={s.value} />
                    <span style={{ color: 'var(--muted)' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="profile glass fade parallax" data-parallax="0.12">
              <div className="shot">
                <img src="https://res.cloudinary.com/dye5qpwii/image/upload/v1778763535/MKA_25_lbx6fb.webp" alt="Moe Kyaw Aung profile" />
                <div className="ptext glass">
                  <strong>မိုးကျော်အောင် · Moe Kyaw Aung</strong>
                  <div style={{ color: 'var(--muted)', marginTop: 4 }}>{profile.location}</div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="about">
          <div className="container">
            <div className="section-head fade">
              <h2>Advanced About Section</h2>
              <p>Professional identity, timeline, and the tech-heavy focus that matches a senior Android engineer profile.</p>
            </div>

            <div className="grid masonry">
              <article className="card glass col-6 fade">
                <span className="badge"><i className="fa-solid fa-person-rays" /> Timeline</span>
                <div className="timeline">
                  <div className="timeline-item glass"><strong>2014 - 2018</strong><p style={{ color: 'var(--muted)' }}>Started Android development and shipped early UI-driven apps.</p></div>
                  <div className="timeline-item glass"><strong>2019 - 2022</strong><p style={{ color: 'var(--muted)' }}>Expanded into Kotlin, Jetpack, MVVM, Room, Retrofit, and Firebase.</p></div>
                  <div className="timeline-item glass"><strong>2023 - 2026</strong><p style={{ color: 'var(--muted)' }}>Focused on Compose, modular architecture, performance, CI/CD, and security.</p></div>
                </div>
              </article>

              <article className="card glass col-6 fade">
                <span className="badge"><i className="fa-solid fa-layer-group" /> Focus Areas</span>
                <div className="chip-wrap">
                  {profile.focus.map(item => <span className="chip" key={item}>{item}</span>)}
                </div>
                <p style={{ color: 'var(--muted)', marginTop: 12 }}>Code with culture. Build with purpose.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="features">
          <div className="container">
            <div className="section-head fade">
              <h2>Features</h2>
              <p>Compact, polished, and responsive interactions designed for a premium landing page experience.</p>
            </div>
            <div className="grid masonry">
              <article className="card glass col-4 fade"><span className="badge">Feature</span><h3>Performance Optimization</h3><p style={{ color: 'var(--muted)' }}>Lazy loading patterns, efficient visual depth, and lightweight motion for smooth UX.</p></article>
              <article className="card glass col-4 fade"><span className="badge">Feature</span><h3>Burmese Language Support</h3><p style={{ color: 'var(--muted)' }}>Supported through structured bilingual sections and localized presentation blocks.</p></article>
              <article className="card glass col-4 fade"><span className="badge">Feature</span><h3>Scroll UX</h3><p style={{ color: 'var(--muted)' }}>Smooth scroll navigation, fade-in reveals, sticky CTA, and back-to-top quick access.</p></article>
            </div>
          </div>
        </section>

        <section id="projects">
          <div className="container">
            <div className="section-head fade">
              <h2>My Create App Collection</h2>
              <p>Senior-level app examples and portfolio-grade concepts.</p>
            </div>
            <div className="grid masonry">
              {projects.map((p, i) => (
                <article className={`card glass ${i === 0 ? 'col-8' : 'col-4'} fade`} key={p.title}>
                  <img src={p.image} alt={p.title} />
                  <h3>{p.title}</h3>
                  <p style={{ color: 'var(--muted)' }}>{p.desc}</p>
                  <div className="cta-row">
                    <a className="btn" href={p.href} target="_blank" rel="noreferrer">Source</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="collections">
          <div className="container">
            <div className="section-head fade">
              <h2>Organization and Links</h2>
              <p>GitHub accounts, Lovable links, Gravatar profile, and social identity collection.</p>
            </div>
            <div className="grid collections fade">
              <article className="card glass">
                <span className="badge"><i className="fa-brands fa-github" /> GitHub Account Collections</span>
                <div className="mini-list">
                  {githubAccounts.slice(0, 12).map(link => (
                    <a className="mini-link" href={link} target="_blank" rel="noreferrer" key={link}>
                      <span>{link.replace('https://', '').replace('http://', '')}</span><span>↗</span>
                    </a>
                  ))}
                </div>
              </article>

              <article className="card glass">
                <span className="badge"><i className="fa-solid fa-rocket" /> Lovable WPA Links</span>
                <div className="mini-list">
                  {lovableLinks.slice(0, 10).map(link => (
                    <a className="mini-link" href={link} target="_blank" rel="noreferrer" key={link}>
                      <span>{link.replace('https://', '').replace('http://', '')}</span><span>↗</span>
                    </a>
                  ))}
                </div>
              </article>

              <article className="card glass">
                <span className="badge"><i className="fa-solid fa-id-card" /> Gravatar & Social Icons</span>
                <div className="socials">
                  {socialLinks.map(link => (
                    <a className="glass" href={link.href} target={link.href.startsWith('mailto:') || link.href.startsWith('tel:') ? '_self' : '_blank'} rel="noreferrer" key={link.label} aria-label={link.label}>
                      <i className={link.icon} />
                    </a>
                  ))}
                </div>
              </article>

              <article className="card glass">
                <span className="badge"><i className="fa-solid fa-building" /> Organization</span>
                <p style={{ color: 'var(--muted)' }}>This area can show team, company, or community groups, including open source contributions and project identities.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="certificates">
          <div className="container">
            <div className="section-head fade">
              <h2>Certificate Collections</h2>
              <p>Selected certificate gallery designed as a lightbox-ready collection for large content support and scalable display.</p>
            </div>
            <div className="gallery fade">
              {certificates.map((src, idx) => (
                <a href={src} key={src} onClick={(e) => { e.preventDefault(); setLightbox(src) }}>
                  <img src={src} alt={`certificate ${idx + 1}`} />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="section-head fade">
              <h2>Animated About Counters</h2>
              <p>A compact proof-of-experience block that reinforces seniority and confidence.</p>
            </div>
            <div className="grid masonry">
              {stats.map(s => (
                <div className="card glass col-4 fade" key={s.label}>
                  <div style={{ fontSize: '2rem', fontWeight: 900 }}><Counter value={s.value} /></div>
                  <div style={{ color: 'var(--muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing">
          <div className="container">
            <div className="section-head fade">
              <h2>Pricing Table</h2>
              <p>Useful for service packages, consulting offers, or app development engagements.</p>
            </div>
            <div className="grid pricing">
              {pricing.map(p => (
                <article className="card glass price fade" key={p.title}>
                  <span className="badge">{p.title}</span>
                  <strong>{p.price}</strong>
                  <p style={{ color: 'var(--muted)' }}>{p.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq">
          <div className="container">
            <div className="section-head fade">
              <h2>FAQ Accordion</h2>
              <p>Short answers help visitors understand the value and process quickly.</p>
            </div>
            <div className="grid faq">
              {faq.map(item => (
                <details className="fade" key={item.q}>
                  <summary>{item.q}</summary>
                  <p style={{ color: 'var(--muted)' }}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials">
          <div className="container">
            <div className="section-head fade">
              <h2>Testimonial Carousel</h2>
              <p>Simple slider for credibility and movement.</p>
            </div>
            <div className="card glass carousel fade">
              <div className="slides" style={{ transform: `translateX(-${slide * 100}%)` }}>
                {testimonials.map(t => (
                  <div className="slide" key={t.title}>
                    <h3>{t.title}</h3>
                    <p style={{ color: 'var(--muted)' }}>{t.text}</p>
                  </div>
                ))}
              </div>
              <div className="cta-row" style={{ marginTop: 12 }}>
                <button className="btn" onClick={() => setSlide((slide - 1 + slideCount) % slideCount)}>Prev</button>
                <button className="btn" onClick={() => setSlide((slide + 1) % slideCount)}>Next</button>
              </div>
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="container">
            <div className="section-head fade">
              <h2>Contact and Newsletter</h2>
              <p>Includes validation, newsletter signup, and direct contact routes.</p>
            </div>
            <div className="grid masonry">
              <form className="card glass col-6 fade form" onSubmit={submitForm}>
                <input name="name" type="text" placeholder="Your Name" required />
                <input name="email" type="email" placeholder="Email Address" required />
                <textarea name="message" placeholder="Tell me about your project..." required />
                <button className="btn primary" type="submit">Send Message</button>
                <p style={{ margin: 0, color: 'var(--muted)' }}>{formMsg}</p>
              </form>

              <div className="card glass col-6 fade">
                <span className="badge"><i className="fa-solid fa-bullhorn" /> Direct Links</span>
                <p><strong>Email:</strong> <a href="mailto:moekyawaung@programmer.net">moekyawaung@programmer.net</a></p>
                <p><strong>Phone:</strong> <a href="tel:+959889000889">+95 9 889 000 889</a> / <a href="tel:+959666000050">+959 666 000 050</a></p>
                <p><strong>Location:</strong> Tachileik, Myanmar 🇲🇲 ↔ Bangkok, Thailand 🇹🇭</p>
                <iframe className="map" title="Google Maps" src="https://www.google.com/maps?q=Bangkok%20Thailand&output=embed" loading="lazy" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h3>Moe-Kyaw-Aung-Portfolio V7</h3>
            <p style={{ color: 'var(--muted)' }}>Glasspunk single-page SaaS / Landing Page crafted for a Senior Android Developer brand.</p>
          </div>
          <div>
            <h4>Links</h4>
            <div className="mini-list">
              <a className="mini-link" href="#about"><span>About</span><span>↗</span></a>
              <a className="mini-link" href="#projects"><span>Projects</span><span>↗</span></a>
              <a className="mini-link" href="#contact"><span>Contact</span><span>↗</span></a>
            </div>
          </div>
          <div>
            <h4>Social</h4>
            <div className="socials">
              {socialLinks.slice(0, 4).map(link => (
                <a className="glass" href={link.href} target={link.href.startsWith('mailto:') || link.href.startsWith('tel:') ? '_self' : '_blank'} rel="noreferrer" key={link.label} aria-label={link.label}>
                  <i className={link.icon} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4>Newsletter</h4>
            <form className="form" onSubmit={e => { e.preventDefault(); alert('Subscribed successfully!') }}>
              <input type="email" placeholder="Enter email" />
              <button className="btn primary" type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </footer>

      <div className="sticky-cta">
        <a className="btn primary" href="#contact"><i className="fa-solid fa-message" /> Contact</a>
        <a className="btn glass to-top" href="#home" aria-label="Back to top"><i className="fa-solid fa-arrow-up" /></a>
      </div>

      {lightbox && (
        <div className="lightbox show" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Expanded certificate" onClick={e => e.stopPropagation()} />
          <button className="btn" style={{ position: 'absolute', top: 18, right: 18 }} onClick={() => setLightbox(null)}>Close</button>
        </div>
      )}
    </>
  )
}

export default App
