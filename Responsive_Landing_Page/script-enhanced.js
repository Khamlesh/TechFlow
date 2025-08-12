// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Initialize Swiper for testimonials
const testimonialsSwiper = new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        }
    }
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);

darkModeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Track theme change
    if (typeof gtag !== 'undefined') {
        gtag('event', 'theme_change', {
            'event_category': 'User Interaction',
            'event_label': newTheme
        });
    }
});

// Typewriter Effect
class Typewriter {
    constructor(element, words, speed = 100) {
        this.element = element;
        this.words = words;
        this.speed = speed;
        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentWord = this.words[this.currentWordIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentWord.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.currentCharIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize Typewriter
const typewriterElement = document.getElementById('typewriter');
if (typewriterElement) {
    new Typewriter(typewriterElement, ['TechFlow', 'Innovation', 'Success'], 150);
}

// Animated Counter for Hero Stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Intersection Observer for counter animation
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(counter => {
    counterObserver.observe(counter);
});

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Track navigation clicks
            if (typeof gtag !== 'undefined') {
                gtag('event', 'navigation_click', {
                    'event_category': 'Navigation',
                    'event_label': this.getAttribute('href')
                });
            }
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    // Dark mode navbar
    if (body.getAttribute('data-theme') === 'dark') {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(17, 24, 39, 0.98)';
        } else {
            navbar.style.background = 'rgba(17, 24, 39, 0.95)';
        }
    }
});

// Testimonial Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const testimonialSlides = document.querySelectorAll('.testimonial-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter testimonials
        testimonialSlides.forEach(slide => {
            const rating = slide.dataset.rating;
            const featured = slide.dataset.featured;
            
            let show = false;
            
            switch(filter) {
                case 'all':
                    show = true;
                    break;
                case '5':
                    show = rating === '5';
                    break;
                case '4':
                    show = parseInt(rating) >= 4;
                    break;
                case 'feature':
                    show = featured === 'true';
                    break;
            }
            
            if (show) {
                slide.style.display = 'block';
            } else {
                slide.style.display = 'none';
            }
        });
        
        // Update swiper
        testimonialsSwiper.update();
        
        // Track filter usage
        if (typeof gtag !== 'undefined') {
            gtag('event', 'testimonial_filter', {
                'event_category': 'User Interaction',
                'event_label': filter
            });
        }
    });
});

// Enhanced Form Validation
const signupForm = document.getElementById('signup-form');
const formInputs = signupForm.querySelectorAll('input, select');

// Real-time validation
formInputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
});

function validateField(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    let isValid = true;
    let errorMessage = '';

    // Remove existing error styling
    field.classList.remove('error');

    // Validation rules
    switch(field.type) {
        case 'email':
            if (!isValidEmail(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
        case 'text':
            if (field.value.trim().length < 2) {
                isValid = false;
                errorMessage = 'This field is required';
            }
            break;
    }

    // Select validation
    if (field.tagName === 'SELECT' && !field.value) {
        isValid = false;
        errorMessage = 'Please select an option';
    }

    // Show/hide error
    if (!isValid) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
    } else {
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    return isValid;
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validate all fields
    let isFormValid = true;
    formInputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    if (isFormValid) {
        // Collect form data
        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showNotification('Thank you! We\'ll be in touch soon.', 'success');
            signupForm.reset();
            
            // Track form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'Lead Generation',
                    'event_label': 'Signup Form'
                });
            }
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    } else {
        showNotification('Please fix the errors above.', 'error');
    }
});

// Cookie Consent
const cookieConsent = document.getElementById('cookie-consent');
const acceptCookies = document.getElementById('accept-cookies');
const declineCookies = document.getElementById('decline-cookies');

// Check if user has already made a choice
if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieConsent.classList.add('show');
    }, 2000);
}

acceptCookies.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieConsent.classList.remove('show');
    
    // Enable analytics
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        });
    }
});

declineCookies.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    cookieConsent.classList.remove('show');
    
    // Disable analytics
    if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
            'analytics_storage': 'denied'
        });
    }
});

// Language Switcher
const languageButtons = document.querySelectorAll('.lang-btn');
const translations = {
    en: {
        'nav.home': 'Home',
        'nav.features': 'Features',
        'nav.testimonials': 'Testimonials',
        'nav.contact': 'Contact',
        'hero.title': 'Transform Your Business with',
        'hero.subtitle': 'Revolutionary software solutions that streamline operations, boost productivity, and drive growth for modern businesses.',
        'cta.title': 'Ready to Transform Your Business?',
        'cta.subtitle': 'Join thousands of businesses already using TechFlow to streamline their operations and boost productivity.'
    },
    es: {
        'nav.home': 'Inicio',
        'nav.features': 'Características',
        'nav.testimonials': 'Testimonios',
        'nav.contact': 'Contacto',
        'hero.title': 'Transforma tu Negocio con',
        'hero.subtitle': 'Soluciones de software revolucionarias que optimizan operaciones, aumentan la productividad e impulsan el crecimiento para empresas modernas.',
        'cta.title': '¿Listo para Transformar tu Negocio?',
        'cta.subtitle': 'Únete a miles de empresas que ya usan TechFlow para optimizar sus operaciones y aumentar la productividad.'
    },
    fr: {
        'nav.home': 'Accueil',
        'nav.features': 'Fonctionnalités',
        'nav.testimonials': 'Témoignages',
        'nav.contact': 'Contact',
        'hero.title': 'Transformez votre Entreprise avec',
        'hero.subtitle': 'Des solutions logicielles révolutionnaires qui rationalisent les opérations, stimulent la productivité et favorisent la croissance des entreprises modernes.',
        'cta.title': 'Prêt à Transformer votre Entreprise ?',
        'cta.subtitle': 'Rejoignez des milliers d\'entreprises qui utilisent déjà TechFlow pour rationaliser leurs opérations et stimuler la productivité.'
    }
};

languageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        
        // Update active button
        languageButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update content
        updateLanguage(lang);
        
        // Track language change
        if (typeof gtag !== 'undefined') {
            gtag('event', 'language_change', {
                'event_category': 'User Interaction',
                'event_label': lang
            });
        }
    });
});

function updateLanguage(lang) {
    const currentLang = translations[lang];
    if (!currentLang) return;
    
    // Update navigation
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (currentLang[key]) {
            element.textContent = currentLang[key];
        }
    });
}

// Legal Modals
const modalTriggers = {
    'privacy-policy-link': 'privacy-modal',
    'terms-link': 'terms-modal',
    'cookies-link': 'cookie-consent'
};

Object.entries(modalTriggers).forEach(([triggerId, modalId]) => {
    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);
    
    if (trigger && modal) {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (modalId === 'cookie-consent') {
                cookieConsent.classList.add('show');
            } else {
                modal.style.display = 'block';
            }
        });
    }
});

// Close modals
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeBtn.closest('.modal').style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    document.querySelectorAll('.modal').forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    // Set background color based on type
    if (type === 'success') {
        notification.style.background = '#10b981';
    } else if (type === 'error') {
        notification.style.background = '#ef4444';
    } else {
        notification.style.background = '#3b82f6';
    }

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Button click animations with ripple effect
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Track button clicks
        if (typeof gtag !== 'undefined') {
            gtag('event', 'button_click', {
                'event_category': 'User Interaction',
                'event_label': this.textContent.trim()
            });
        }
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroGraphic = document.querySelector('.hero-graphic');
    
    if (hero && heroGraphic) {
        const rate = scrolled * -0.5;
        heroGraphic.style.transform = `translateY(${rate}px)`;
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active state styles for navigation
const navStyle = document.createElement('style');
navStyle.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(navStyle);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    // Dark mode navbar
    if (body.getAttribute('data-theme') === 'dark') {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(17, 24, 39, 0.98)';
        } else {
            navbar.style.background = 'rgba(17, 24, 39, 0.95)';
        }
    }
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', () => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track scroll milestones
        if (typeof gtag !== 'undefined') {
            if (maxScroll >= 25 && maxScroll < 50) {
                gtag('event', 'scroll_depth', {
                    'event_category': 'Engagement',
                    'event_label': '25%'
                });
            } else if (maxScroll >= 50 && maxScroll < 75) {
                gtag('event', 'scroll_depth', {
                    'event_category': 'Engagement',
                    'event_label': '50%'
                });
            } else if (maxScroll >= 75 && maxScroll < 100) {
                gtag('event', 'scroll_depth', {
                    'event_category': 'Engagement',
                    'event_label': '75%'
                });
            } else if (maxScroll >= 100) {
                gtag('event', 'scroll_depth', {
                    'event_category': 'Engagement',
                    'event_label': '100%'
                });
            }
        }
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('TechFlow Landing Page loaded successfully!');
    
    // Add loading animation to hero section
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroContent.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Track page load
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            'page_title': document.title,
            'page_location': window.location.href
        });
    }
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 