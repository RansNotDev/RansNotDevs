// Typing Animation Text
const typingTexts = [
    "Crafting innovative digital experiences",
    "Building modern web applications",
    "Creating seamless user experiences",
    "Developing full-stack solutions"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

const typedTextElement = document.querySelector('.typed-text');

function typeText() {
    const currentText = typingTexts[textIndex];
    
    if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingDelay = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typingDelay = 200;
    } else {
        typingDelay = isDeleting ? 50 : 100;
    }
    
    setTimeout(typeText, typingDelay);
}

// Start typing animation
typeText();

// Three.js Background with enhanced particles
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg-canvas'),
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Create particles with custom geometry
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);
const scaleArray = new Float32Array(particlesCount);

for(let i = 0; i < particlesCount * 3; i += 3) {
    // Position
    posArray[i] = (Math.random() - 0.5) * 100;
    posArray[i + 1] = (Math.random() - 0.5) * 100;
    posArray[i + 2] = (Math.random() - 0.5) * 100;
    
    // Scale
    scaleArray[i / 3] = Math.random();
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));

// Custom shader material
const particlesMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0xffd700) }
    },
    vertexShader: `
        attribute float scale;
        uniform float time;
        
        void main() {
            vec3 pos = position;
            pos.y += sin(time + position.x) * 0.2;
            pos.x += cos(time + position.z) * 0.2;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = scale * 2.0 * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        
        void main() {
            float strength = distance(gl_PointCoord, vec2(0.5));
            strength = 1.0 - strength;
            strength = pow(strength, 3.0);
            
            vec3 finalColor = color * strength;
            gl_FragColor = vec4(finalColor, strength);
        }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    particlesMaterial.uniforms.time.value += 0.01;
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;
    
    renderer.render(scene, camera);
}

animate();

// Enhanced mouse movement effect
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

// Smooth particle movement
function updateParticles() {
    targetX += (mouseX - targetX) * 0.1;
    targetY += (mouseY - targetY) * 0.1;
    
    particlesMesh.rotation.x += targetY * 0.01;
    particlesMesh.rotation.y += targetX * 0.01;
    
    requestAnimationFrame(updateParticles);
}

updateParticles();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);

// Toggle theme with animation
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Add transition class
    document.body.classList.add('theme-transition');
    
    // Change theme
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update particle color
    particlesMaterial.uniforms.color.value.set(newTheme === 'dark' ? '#ffd700' : '#ffb700');
    
    // Remove transition class
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
});

// Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

// Toggle mobile menu with animation
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    gsap.from('.nav-links a', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out'
    });
});

// Close mobile menu when clicking on a link
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Enhanced Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Special animation for education cards
            if (entry.target.classList.contains('education-card')) {
                const highlights = entry.target.querySelectorAll('.education-highlights li');
                highlights.forEach((item, index) => {
                    item.style.animation = `fadeInRight 0.5s ${index * 0.1}s forwards`;
                });
            }
            
            // Special animation for achievement cards
            if (entry.target.classList.contains('achievement-card')) {
                entry.target.style.animation = 'bounceIn 0.8s forwards';
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-item, .project-card, .stat, .education-card, .achievement-card').forEach(el => {
    observer.observe(el);
});

// Enhanced typing animation in code block
const codeText = document.querySelector('.code-animation code');
const codeContent = codeText.innerHTML;
codeText.innerHTML = '';

let i = 0;
function typeCode() {
    if (i < codeContent.length) {
        codeText.innerHTML += codeContent.charAt(i);
        i++;
        setTimeout(typeCode, 30); // Faster typing speed
    }
}

// Start typing animation when the page loads
window.addEventListener('load', typeCode);

// Form submission with enhanced validation
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Thank you for your message! I will get back to you soon.';
    successMessage.style.color = 'var(--primary-color)';
    successMessage.style.marginTop = '1rem';
    
    contactForm.appendChild(successMessage);
    contactForm.reset();
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
});

// Active navigation highlight on scroll with smooth transition
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Enhanced skill hover effect with scale
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px) scale(1.05)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// Enhanced project image hover effect
document.querySelectorAll('.project-card').forEach(card => {
    const image = card.querySelector('img');
    
    card.addEventListener('mouseenter', () => {
        image.style.transform = 'scale(1.1)';
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        image.style.transform = 'scale(1)';
        card.style.transform = 'translateY(0)';
    });
});

// Smooth parallax effect for hero section
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
});

// Animate stats when they come into view with counting animation
const stats = document.querySelectorAll('.stat .number');
let animated = false;

function animateStats() {
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        
        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current) + '+';
                setTimeout(updateCount, 20);
            } else {
                stat.textContent = target + '+';
            }
        };
        
        updateCount();
    });
}

// Trigger stats animation when the about section is in view
const aboutSection = document.querySelector('.about');
const aboutObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
        animateStats();
        animated = true;
    }
}, { threshold: 0.5 });

aboutObserver.observe(aboutSection);

// Add custom cursor effect
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Enhanced animations with GSAP
gsap.from('.hero-content', {
    opacity: 0,
    y: 100,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.floating-cube', {
    opacity: 0,
    scale: 0,
    rotation: 720,
    duration: 1.5,
    ease: 'elastic.out(1, 0.3)'
});

gsap.from('.hero', {
    opacity: 0,
    duration: 1.5,
    ease: 'power3.out',
    y: -50
});

gsap.from('.project-card', {
    scrollTrigger: {
        trigger: '.project-card',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: 'power2.out'
});

// Scroll animations
const scrollAnimations = () => {
    gsap.utils.toArray('.skill-item, .project-card, .education-card, .achievement-card').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
};

scrollAnimations();

// Particle effect for sections
const createParticles = (container) => {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.setProperty('--x', `${Math.random() * 100}%`);
        particle.style.setProperty('--y', `${Math.random() * 100}%`);
        particle.style.setProperty('--duration', `${Math.random() * 2 + 1}s`);
        particle.style.setProperty('--delay', `${Math.random() * 2}s`);
        container.appendChild(particle);
    }
};

document.querySelectorAll('.particle-container').forEach(createParticles);

// Enhanced scroll animations
gsap.registerPlugin(ScrollTrigger);

// Hero section animations
gsap.from('.hero-content', {
    opacity: 0,
    y: 100,
    duration: 1.5,
    ease: 'power3.out'
});

gsap.from('.tech-stack-orbit', {
    opacity: 0,
    scale: 0,
    rotation: 720,
    duration: 2,
    ease: 'elastic.out(1, 0.3)'
});

// Animate code blocks with typing effect
const codeElements = document.querySelectorAll('.animated-code');
codeElements.forEach(code => {
    const text = code.textContent;
    code.textContent = '';
    let i = 0;
    
    function typeCode() {
        if (i < text.length) {
            code.textContent += text.charAt(i);
            i++;
            setTimeout(typeCode, 30);
        }
    }
    
    ScrollTrigger.create({
        trigger: code,
        start: 'top 80%',
        onEnter: () => typeCode()
    });
});

// Enhanced Tech Stack Animations
const techItems = document.querySelectorAll('.tech-item');
const orbitCircles = document.querySelectorAll('.orbit-circle');

// Pause animation on hover
techItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        techItems.forEach(tech => {
            tech.style.animationPlayState = 'paused';
        });
        orbitCircles.forEach(circle => {
            circle.style.animationPlayState = 'paused';
        });
        
        // Show tech details
        const techLabel = item.getAttribute('data-tech');
        const description = getTechDescription(techLabel);
        showTechDetails(item, description);
    });
    
    item.addEventListener('mouseleave', () => {
        techItems.forEach(tech => {
            tech.style.animationPlayState = 'running';
        });
        orbitCircles.forEach(circle => {
            circle.style.animationPlayState = 'running';
        });
        
        // Hide tech details
        hideTechDetails();
    });
});

// Tech descriptions
function getTechDescription(tech) {
    const descriptions = {
        'HTML5': 'Semantic markup and modern web standards',
        'CSS3': 'Styling and responsive design',
        'JavaScript': 'Dynamic frontend functionality',
        'PHP': 'Server-side scripting and backend logic',
        'MySQL': 'Database management and queries',
        'Java': 'Object-oriented programming',
        'VB.NET': 'Windows application development'
    };
    return descriptions[tech] || '';
}

// Show tech details tooltip
function showTechDetails(item, description) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tech-tooltip';
    tooltip.textContent = description;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--card-bg);
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 14px;
        color: var(--text-color);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        pointer-events: none;
        white-space: nowrap;
        border: 1px solid var(--primary-color);
    `;
    
    item.appendChild(tooltip);
    
    // Position the tooltip
    const itemRect = item.getBoundingClientRect();
    tooltip.style.top = `${itemRect.height + 30}px`;
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translateX(-50%)';
    
    // Animate in
    requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateX(-50%) translateY(0)';
    });
}

// Hide tech details tooltip
function hideTechDetails() {
    const tooltip = document.querySelector('.tech-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Add 3D tilt effect on hover
techItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 10;
        const angleY = (centerX - x) / 10;
        
        item.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.2) translateZ(20px)`;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
    });
});

// Enhanced Button Interactions
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
    });
});

// Education Section Enhanced Animations
const educationCard = document.querySelector('.education-card');
const achievementCards = document.querySelectorAll('.achievement-card');

// Add parallax effect to education card
educationCard.addEventListener('mousemove', (e) => {
    const rect = educationCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    educationCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
});

educationCard.addEventListener('mouseleave', () => {
    educationCard.style.transform = '';
});

// Achievement cards hover effect
achievementCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out',
            boxShadow: '0 15px 30px rgba(255, 215, 0, 0.3)'
        });
        
        // Animate icon
        const icon = card.querySelector('i');
        gsap.to(icon, {
            scale: 1.2,
            rotate: 360,
            duration: 0.5,
            ease: 'back.out'
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
        });
        
        // Reset icon
        const icon = card.querySelector('i');
        gsap.to(icon, {
            scale: 1,
            rotate: 0,
            duration: 0.5,
            ease: 'back.out'
        });
    });
});

// Animate education highlights with stagger
const educationHighlights = document.querySelectorAll('.education-highlights li');
gsap.from(educationHighlights, {
    scrollTrigger: {
        trigger: '.education-highlights',
        start: 'top 80%'
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
});

// Dynamic Text Rotation
document.addEventListener('DOMContentLoaded', () => {
    const animatedTextElement = document.querySelector('.animated-text-wrapper .animate-text');
    console.log('Animated text element:', animatedTextElement); // Debug log

    if (!animatedTextElement) {
        console.error('Could not find animated text element');
        return;
    }

    const descriptions = [
        'Full Stack Developer',
        'Freelance Developer', 
        'IT Student'
    ];
    let currentIndex = 0;

    // Set initial text immediately
    animatedTextElement.textContent = descriptions[0];
    animatedTextElement.style.opacity = '1';

    function rotateDescription() {
        // Fade out current text
        animatedTextElement.style.opacity = '0';
        
        // Wait for fade out, then change text
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % descriptions.length;
            animatedTextElement.textContent = descriptions[currentIndex];
            
            // Force a reflow
            animatedTextElement.offsetHeight;
            
            // Fade in new text
            animatedTextElement.style.opacity = '1';
            
            console.log('Text changed to:', descriptions[currentIndex]); // Debug log
        }, 300);
    }

    // Start the rotation after a short delay
    setTimeout(() => {
        setInterval(rotateDescription, 3000);
    }, 1000);
}); 