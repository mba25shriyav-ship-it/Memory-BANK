/* =========================================================================
   MemoryBank 2050 - Interactive Scripts
   ========================================================================= */

   document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Neural Network Canvas Background
    initNeuralCanvas();

    // 2. GSAP Scroll Animations
    initScrollAnimations();

    // 3. Emotion Slider Logic
    initEmotionSlider();

    // 4. Live Preview Modal Logic
    initPreviewModal();

    // 5. Smooth Scroll for Navigation
    initNavigation();
});

/* ==============================================
   1. Neural Network Background Canvas
   ============================================== */
function initNeuralCanvas() {
    const canvas = document.getElementById('neural-bg');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Config
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const connectionDistance = 150;
    const baseColor = '80, 160, 255'; // Soft blue
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${baseColor}, 0.5)`;
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(${baseColor}, ${opacity * 0.2})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });
    
    resize();
    initParticles();
    animate();
}

/* ==============================================
   2. GSAP Scroll Animations
   ============================================== */
function initScrollAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Animation
    gsap.to('.hero-title, .hero-subtext, .hero-buttons, .badge', {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2
    });

    gsap.fromTo('.memory-orb-container', 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "back.out(1.2)", delay: 0.5 }
    );

    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleClass: "active",
                once: true
            }
        });
    });

    // Chart Bar Animation Trigger
    ScrollTrigger.create({
        trigger: ".financials",
        start: "top 70%",
        onEnter: () => {
            document.querySelectorAll('.css-chart .bar').forEach((bar, index) => {
                const targetHeight = bar.style.height;
                bar.style.height = '0%';
                setTimeout(() => {
                    bar.style.height = targetHeight;
                }, 100 + (index * 100));
            });
        },
        once: true
    });
}

/* ==============================================
   3. Emotion Slider Logic (Filter/Intensity UI)
   ============================================== */
function initEmotionSlider() {
    const slider = document.getElementById('emotion-slider');
    const intensityVal = document.getElementById('intensity-val');
    const cards = document.querySelectorAll('.market-item');
    
    if (!slider || !intensityVal) return;

    slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        intensityVal.textContent = `Level ${val}`;
        
        // Visual effect on value text
        intensityVal.style.transform = 'scale(1.2)';
        setTimeout(() => intensityVal.style.transform = 'scale(1)', 200);

        // Filter cards based on intensity (fading out ones that are > 3 levels away)
        cards.forEach(card => {
            const cardInt = parseInt(card.getAttribute('data-intensity'));
            if (Math.abs(cardInt - val) > 3) {
                card.style.opacity = '0.3';
                card.style.transform = 'scale(0.95)';
            } else {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }
        });
    });
}

/* ==============================================
   4. Live Preview Modal
   ============================================== */
function initPreviewModal() {
    const overlay = document.getElementById('preview-overlay');
    const closeBtn = document.querySelector('.close-preview');
    const previewBtns = document.querySelectorAll('.preview-btn');

    if (!overlay) return;

    previewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.add('active');
            
            // Re-trigger animation by resetting node
            const scanLine = overlay.querySelector('.scanning-line');
            if (scanLine) {
                scanLine.style.animation = 'none';
                scanLine.offsetHeight; /* trigger reflow */
                scanLine.style.animation = null; 
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
}

/* ==============================================
   5. Smooth Scroll Navigation
   ============================================== */
function initNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetEl.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.85)';
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.7)';
            navbar.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.07)';
        }
    });
}
