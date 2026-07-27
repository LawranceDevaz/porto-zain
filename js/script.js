/* ==============================
   ZAIN PORTFOLIO V2 — SCRIPTS
   ============================== */

// ---------- Cursor ----------
const ring = document.querySelector('.cursor-ring')
const dot = document.querySelector('.cursor-dot')
let mx = 0, my = 0, rx = 0, ry = 0

if (ring && dot) {
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px' })
  function follow() { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(follow) }
  follow()
  document.querySelectorAll('a, button, .project-card, .tool-item, .gallery-item, .testimonial-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'))
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'))
  })
}

// ---------- Split Text ----------
document.querySelectorAll('.reveal-text').forEach(el => {
  const txt = el.textContent.trim()
  el.textContent = ''
  ;[...txt].forEach(c => {
    const s = document.createElement('span')
    s.textContent = c === ' ' ? '\u00A0' : c
    s.className = 'char-reveal'
    el.appendChild(s)
  })
})

// ---------- Intersection Observer ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    const el = entry.target
    el.classList.add('visible')

    // Char reveal
    if (el.classList.contains('reveal-text')) {
      el.querySelectorAll('.char-reveal').forEach((ch, i) => setTimeout(() => ch.classList.add('visible'), i * 40))
    }
    // Counter
    if (el.classList.contains('counter')) animateCounter(el)
    // Skill bar
    if (el.classList.contains('skill-bar')) {
      setTimeout(() => { el.style.width = el.getAttribute('data-width') + '%' }, 200)
    }
    // Stagger children
    if (el.classList.contains('stagger-fade')) {
      el.querySelectorAll('> *').forEach((child, i) => setTimeout(() => child.classList.add('visible'), i * 100))
    }
  })
}, { threshold: 0.15 })

document.querySelectorAll('.fade-up, .counter, .reveal-text, .project-card, .tool-item, .testimonial-card, .stagger-fade, .skill-bar, .gallery-item, .contact-item').forEach(el => {
  el.classList.add('hidden-init')
  observer.observe(el)
})

// ---------- Counter ----------
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'))
  if (!target || el.classList.contains('done')) return
  el.classList.add('done')
  let cur = 0
  const inc = target / 50
  const t = setInterval(() => {
    cur += inc
    if (cur >= target) { el.textContent = target + '+'; clearInterval(t) }
    else { el.textContent = Math.floor(cur) + '+' }
  }, 20)
}

// ---------- Hero In ----------
const heroText = document.querySelector('.hero-text')
if (heroText) setTimeout(() => heroText.classList.add('visible'), 200)

// ---------- Typewriter ----------
const typeEl = document.getElementById('typewriter')
if (typeEl) {
  const roles = ['Full-Stack Developer', 'Cysec (SOC Analyst)', 'Tech Enthusiast', 'Builder']
  let ri = 0, ci = 0, deleting = false
  function type() {
    const current = roles[ri]
    if (!deleting) {
      typeEl.textContent = current.slice(0, ci + 1)
      ci++
      if (ci === current.length) { setTimeout(() => { deleting = true; setTimeout(type, 800) }, 1500); return }
    } else {
      typeEl.textContent = current.slice(0, ci - 1)
      ci--
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length }
    }
    setTimeout(type, deleting ? 30 : 80)
  }
  type()
}

// ---------- Nav ----------
const navbar = document.getElementById('navbar')
const sections = document.querySelectorAll('section[id]')
const navLinks = document.querySelectorAll('.nav-link')

window.addEventListener('scroll', () => {
  // Background
  if (window.scrollY > 60) navbar.classList.add('scrolled')
  else navbar.classList.remove('scrolled')

  // Active link
  let current = ''
  sections.forEach(s => {
    const top = s.offsetTop - 150
    if (window.scrollY >= top) current = s.getAttribute('id')
  })
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current)
  })
})

// ---------- Mobile Menu ----------
document.querySelector('.nav-toggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links')?.classList.toggle('open')
})

// ---------- Smooth Scroll ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    e.preventDefault()
    const t = document.querySelector(this.getAttribute('href'))
    if (t) t.scrollIntoView({ behavior: 'smooth' })
  })
})

// ---------- Particles ----------
const canvas = document.getElementById('particles')
if (canvas && !('ontouchstart' in window)) {
  const ctx = canvas.getContext('2d')
  let W, H
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
  resize()
  window.addEventListener('resize', resize)

  const pts = Array.from({ length: 60 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.5 + 0.5
  }))

  function draw() {
    ctx.clearRect(0, 0, W, H)
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0 || p.x > W) p.vx *= -1
      if (p.y < 0 || p.y > H) p.vy *= -1
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fill()
      pts.forEach(p2 => {
        const dx = p.x - p2.x, dy = p.y - p2.y, d = Math.sqrt(dx * dx + dy * dy)
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(255,255,255,${0.04 * (1 - d / 120)})`; ctx.lineWidth = 0.5; ctx.stroke()
        }
      })
    })
    requestAnimationFrame(draw)
  }
  draw()
}

// ---------- Project Tilt ----------
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect()
    const x = e.clientX - r.left, y = e.clientY - r.top
    const rx = (y - r.height / 2) / 15, ry = (r.width / 2 - x) / 15
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`
  })
  card.addEventListener('mouseleave', () => { card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)' })
})

// ---------- Marquee Clone ----------
document.querySelectorAll('.marquee-inner').forEach(m => {
  if (!m.closest('.marquee-content')) { // skip banner marquees (already cloned in html)
    const clone = m.cloneNode(true)
    m.parentElement.appendChild(clone)
  }
})

// ---------- Live Time ----------
function updateTime() {
  const el = document.getElementById('liveTime')
  if (!el) return
  const now = new Date()
  const wib = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
  el.textContent = 'WIB ' + wib.toLocaleTimeString('en-ID', { hour: '2-digit', minute: '2-digit' })
}
updateTime()
setInterval(updateTime, 1000)

// ---------- Banner Progress ----------
document.querySelector('.banner-progress') && setInterval(() => {
  const bar = document.querySelector('.banner-progress')
  if (!bar) return
  let w = parseFloat(bar.style.width) || 0
  w += 0.5; if (w > 100) w = 0
  bar.style.width = w + '%'
}, 50)

// ---------- Tool Card Glow ----------
document.querySelectorAll('.tool-item').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect()
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%')
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%')
  })
})

// ---------- Hero Mouse Parallax ----------
const hero = document.querySelector('#hero')
if (hero) {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth) * 20
    const y = (e.clientY / window.innerHeight) * 20
    hero.style.setProperty('--move-x', x + 'px')
    hero.style.setProperty('--move-y', y + 'px')
  })
}
