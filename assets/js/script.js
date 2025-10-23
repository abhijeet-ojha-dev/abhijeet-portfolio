/*
  Portfolio interaction scripts
  - Theme toggle, navigation, smooth scrolling, and active-section highlighting
  - Hero title animation, filters, and modal helpers
  - Certification carousel with autoplay, keyboard, and touch support
  - Certificate viewer/download, contact form submission, and field validation
*/

const THEME_CONFIG = {
    DEFAULT_THEME: 'dark',
    THEMES: {
        DARK: 'dark',
        LIGHT: 'light'
    }
};

const ANIMATION_CONFIG = {
    THEME_TOGGLE_ROTATION_DURATION: 300,
    TITLE_ANIMATION: {
        FADE_OUT_DELAY: 500,
        FADE_IN_DELAY: 50,
        SLIDE_OFFSET: 20,
        INTERVAL: 3000
    },
    ANIMATION_RESTART_DELAY: 10,
    SCROLL_OFFSET: 100
};

const SCROLL_CONFIG = {
    NAVBAR_SHADOW_THRESHOLD: 50,
    LIGHT_THEME_SHADOWS: {
        ACTIVE: '0 4px 20px rgba(0, 0, 0, 0.12)',
        INACTIVE: '0 2px 20px rgba(0, 0, 0, 0.08)'
    },
    DARK_THEME_SHADOWS: {
        ACTIVE: '0 4px 20px rgba(239, 68, 68, 0.2)',
        INACTIVE: '0 2px 20px rgba(239, 68, 68, 0.1)'
    }
};

const CAROUSEL_CONFIG = {
    AUTO_PLAY_DELAY: 4000,
    TOUCH_THRESHOLD: 50
};

const FORM_CONFIG = {
    MESSAGE_DISPLAY_DURATION: 5000,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[\d\s\-\+\(\)]+$/
};

const FILE_CONFIG = {
    CERTIFICATE_PATH: 'assets/images/certificates/abhijeet-pd1-certificate.jpg',
    CERTIFICATE_DOWNLOAD_NAME: 'abhijeet-ojha-salesforce-platform-developer-i-certificate.jpg'
};

const CONTENT_CONFIG = {
    HERO_TITLES: [
        'Salesforce Developer',
        'Salesforce Administrator',
        'Salesforce Consultant'
    ],
    FORM_BUTTON_STATES: {
        SENDING: 'Sending...',
        DEFAULT: 'Send Message'
    }
};

const CSS_CLASSES = {
    ACTIVE: 'active',
    HIDDEN: 'hidden',
    INVALID: 'invalid',
    VALID: 'valid',
    SHOW: 'show'
};

const FORM_VALIDATION_STYLES = `
    .contact-form input.invalid,
    .contact-form textarea.invalid {
        border-color: #ef4444 !important;
    }
    
    .contact-form input.valid,
    .contact-form textarea.valid {
        border-color: #22c55e !important;
    }
`;

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('themeToggle');
const sections = document.querySelectorAll('.section');
const dynamicTitle = document.getElementById('dynamicTitle');
const filterBtns = document.querySelectorAll('.filter-btn');
const timelineItems = document.querySelectorAll('.timeline-item');
const knowMoreBtns = document.querySelectorAll('.know-more-btn');
const modals = document.querySelectorAll('.modal');
const modalCloseBtns = document.querySelectorAll('.modal-close');
const skillsFilterBtns = document.querySelectorAll('.skills-filter-btn');
const skillBadges = document.querySelectorAll('.skill-badge');
const viewCertBtn = document.getElementById('viewCertBtn');
const certModal = document.getElementById('certModal');
const certModalClose = document.querySelector('.cert-modal-close');
const certImageWrapper = document.querySelector('.cert-image-wrapper');
const downloadBtn = document.querySelector('.cert-download-btn');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');

const currentTheme = localStorage.getItem('theme') || THEME_CONFIG.DEFAULT_THEME;
let titleIndex = 0;
let scrollTimeout;

document.documentElement.setAttribute('data-theme', currentTheme);

const style = document.createElement('style');
style.textContent = FORM_VALIDATION_STYLES;
document.head.appendChild(style);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === THEME_CONFIG.THEMES.DARK ? THEME_CONFIG.THEMES.LIGHT : THEME_CONFIG.THEMES.DARK;
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, ANIMATION_CONFIG.THEME_TOGGLE_ROTATION_DURATION);
    });
}

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle(CSS_CLASSES.ACTIVE);
    navMenu.classList.toggle(CSS_CLASSES.ACTIVE);
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove(CSS_CLASSES.ACTIVE);
        navMenu.classList.remove(CSS_CLASSES.ACTIVE);
    });
});

document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove(CSS_CLASSES.ACTIVE);
        navMenu.classList.remove(CSS_CLASSES.ACTIVE);
    }
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navHeight = navbar.offsetHeight;
            const isMobile = window.innerWidth <= 768;
            const extraOffset = isMobile ? 20 : 0;
            const targetPosition = targetSection.offsetTop - navHeight - extraOffset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

const highlightActiveSection = () => {
    const isMobile = window.innerWidth <= 768;
    const extraOffset = isMobile ? 20 : 0;
    const scrollPosition = window.scrollY + navbar.offsetHeight + ANIMATION_CONFIG.SCROLL_OFFSET + extraOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove(CSS_CLASSES.ACTIVE);
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add(CSS_CLASSES.ACTIVE);
                }
            });
        }
    });
};

window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        highlightActiveSection();
    });
});

window.addEventListener('scroll', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const isLightTheme = theme === THEME_CONFIG.THEMES.LIGHT;
    
    if (window.scrollY > SCROLL_CONFIG.NAVBAR_SHADOW_THRESHOLD) {
        navbar.style.boxShadow = isLightTheme 
            ? SCROLL_CONFIG.LIGHT_THEME_SHADOWS.ACTIVE
            : SCROLL_CONFIG.DARK_THEME_SHADOWS.ACTIVE;
    } else {
        navbar.style.boxShadow = isLightTheme 
            ? SCROLL_CONFIG.LIGHT_THEME_SHADOWS.INACTIVE
            : SCROLL_CONFIG.DARK_THEME_SHADOWS.INACTIVE;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    highlightActiveSection();
});

function animateTitle() {
    if (!dynamicTitle) return;
    
    dynamicTitle.style.opacity = '0';
    dynamicTitle.style.transform = `translateY(-${ANIMATION_CONFIG.TITLE_ANIMATION.SLIDE_OFFSET}px)`;
    
    setTimeout(() => {
        titleIndex = (titleIndex + 1) % CONTENT_CONFIG.HERO_TITLES.length;
        dynamicTitle.textContent = CONTENT_CONFIG.HERO_TITLES[titleIndex];
        dynamicTitle.style.transform = `translateY(${ANIMATION_CONFIG.TITLE_ANIMATION.SLIDE_OFFSET}px)`;
        
        setTimeout(() => {
            dynamicTitle.style.opacity = '1';
            dynamicTitle.style.transform = 'translateY(0)';
        }, ANIMATION_CONFIG.TITLE_ANIMATION.FADE_IN_DELAY);
    }, ANIMATION_CONFIG.TITLE_ANIMATION.FADE_OUT_DELAY);
}

if (dynamicTitle) {
    dynamicTitle.textContent = CONTENT_CONFIG.HERO_TITLES[0];
    dynamicTitle.style.opacity = '1';
    dynamicTitle.style.transform = 'translateY(0)';
    setInterval(animateTitle, ANIMATION_CONFIG.TITLE_ANIMATION.INTERVAL);
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove(CSS_CLASSES.ACTIVE));
        btn.classList.add(CSS_CLASSES.ACTIVE);
        const filterValue = btn.getAttribute('data-filter');
        timelineItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filterValue === 'all') {
                item.classList.remove(CSS_CLASSES.HIDDEN);
                item.style.animation = 'none';
                setTimeout(() => {
                    item.style.animation = '';
                }, ANIMATION_CONFIG.ANIMATION_RESTART_DELAY);
            } else if (category === filterValue) {
                item.classList.remove(CSS_CLASSES.HIDDEN);
                item.style.animation = 'none';
                setTimeout(() => {
                    item.style.animation = '';
                }, ANIMATION_CONFIG.ANIMATION_RESTART_DELAY);
            } else {
                item.classList.add(CSS_CLASSES.HIDDEN);
            }
        });
    });
});

function closeModalWithAnimation(modal) {
    if (!modal) return;
    
    modal.classList.add('closing');
    
    setTimeout(() => {
        modal.classList.remove(CSS_CLASSES.ACTIVE);
        modal.classList.remove('closing');
        document.body.style.overflow = '';
    }, 300);
}

knowMoreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add(CSS_CLASSES.ACTIVE);
            document.body.style.overflow = 'hidden';
        }
    });
});

modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModalWithAnimation(modal);
    });
});

modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalWithAnimation(modal);
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            if (modal.classList.contains(CSS_CLASSES.ACTIVE)) {
                closeModalWithAnimation(modal);
            }
        });
    }
});

skillsFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        skillsFilterBtns.forEach(b => b.classList.remove(CSS_CLASSES.ACTIVE));
        btn.classList.add(CSS_CLASSES.ACTIVE);
        const category = btn.getAttribute('data-category');
        skillBadges.forEach(badge => {
            const badgeCategory = badge.getAttribute('data-category');
            
            if (category === 'all') {
                badge.classList.remove(CSS_CLASSES.HIDDEN);
                badge.style.animation = 'none';
                setTimeout(() => {
                    badge.style.animation = '';
                }, ANIMATION_CONFIG.ANIMATION_RESTART_DELAY);
            } else if (badgeCategory === category) {
                badge.classList.remove(CSS_CLASSES.HIDDEN);
                badge.style.animation = 'none';
                setTimeout(() => {
                    badge.style.animation = '';
                }, ANIMATION_CONFIG.ANIMATION_RESTART_DELAY);
            } else {
                badge.classList.add(CSS_CLASSES.HIDDEN);
            }
        });
    });
});

class CertificationCarousel {
    /*
     Certification carousel controller
     - Wires up prev/next, indicators, keyboard arrows, and touch gestures
     - Manages autoplay with pause on hover and resume on leave
    */
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-slide');
        this.totalSlides = this.slides.length;
        this.prevBtn = document.getElementById('certPrevBtn');
        this.nextBtn = document.getElementById('certNextBtn');
        this.indicators = document.querySelectorAll('.carousel-indicator');
        this.autoPlayInterval = null;
        this.autoPlayDelay = CAROUSEL_CONFIG.AUTO_PLAY_DELAY;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateCarousel();
        this.startAutoPlay();
    }
    
    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        this.setupTouchEvents();
        
        const carousel = document.querySelector('.certification-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
            carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    setupTouchEvents() {
        const track = document.getElementById('certCarouselTrack');
        if (!track) return;
        
        let startX = 0;
        let endX = 0;
        let isDragging = false;
        
        track.addEventListener('touchstart', (e) => {
            // Check if touch is on a certificate action button
            const target = e.target.closest('.cert-view-btn, .cert-download-btn, .cert-image-wrapper');
            if (target) {
                return; // Don't handle carousel touch if it's on a certificate button
            }
            
            startX = e.touches[0].clientX;
            isDragging = true;
            this.stopAutoPlay();
        });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            endX = e.touches[0].clientX;
        });
        
        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            // Check if touch end is on a certificate action button
            const target = e.target.closest('.cert-view-btn, .cert-download-btn, .cert-image-wrapper');
            if (target) {
                return; // Don't handle carousel touch if it's on a certificate button
            }
            
            const diffX = startX - endX;
            const threshold = CAROUSEL_CONFIG.TOUCH_THRESHOLD;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            this.startAutoPlay();
        });
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
        this.restartAutoPlay();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
        this.restartAutoPlay();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateCarousel();
        this.restartAutoPlay();
    }
    
    updateCarousel() {
        this.slides.forEach((slide, index) => {
            if (index === this.currentSlide) {
                slide.classList.add(CSS_CLASSES.ACTIVE);
            } else {
                slide.classList.remove(CSS_CLASSES.ACTIVE);
            }
        });
        
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle(CSS_CLASSES.ACTIVE, index === this.currentSlide);
        });
        
        if (this.prevBtn) {
            this.prevBtn.disabled = false;
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = false;
        }
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    restartAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CertificationCarousel();
    
    // Prevent event propagation for all certificate action buttons
    const certActionButtons = document.querySelectorAll('.cert-view-btn, .cert-download-btn, .cert-image-wrapper');
    certActionButtons.forEach(button => {
        // Prevent click event propagation
        button.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Prevent touch event propagation for mobile devices
        button.addEventListener('touchstart', (e) => {
            e.stopPropagation();
        });
        
        button.addEventListener('touchend', (e) => {
            e.stopPropagation();
        });
        
        // Prevent mouse event propagation
        button.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
    });
});

function closeCertModalWithAnimation(modal) {
    if (!modal) return;
    
    modal.classList.add('closing');
    
    setTimeout(() => {
        modal.classList.remove(CSS_CLASSES.ACTIVE);
        modal.classList.remove('closing');
        document.body.style.overflow = '';
    }, 300);
}

if (viewCertBtn) {
    const handleViewCertClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        certModal.classList.add(CSS_CLASSES.ACTIVE);
        document.body.style.overflow = 'hidden';
    };
    
    viewCertBtn.addEventListener('click', handleViewCertClick);
    viewCertBtn.addEventListener('touchend', handleViewCertClick);
}

if (certModalClose) {
    certModalClose.addEventListener('click', () => {
        closeCertModalWithAnimation(certModal);
    });
}

if (certModal) {
    certModal.addEventListener('click', (e) => {
        if (e.target === certModal) {
            closeCertModalWithAnimation(certModal);
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains(CSS_CLASSES.ACTIVE)) {
        closeCertModalWithAnimation(certModal);
    }
});

function downloadCertificate() {
    const link = document.createElement('a');
    link.href = FILE_CONFIG.CERTIFICATE_PATH;
    link.download = FILE_CONFIG.CERTIFICATE_DOWNLOAD_NAME;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

if (certImageWrapper) {
    const handleImageClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        certModal.classList.add(CSS_CLASSES.ACTIVE);
        document.body.style.overflow = 'hidden';
    };
    
    certImageWrapper.addEventListener('click', handleImageClick);
    certImageWrapper.addEventListener('touchend', handleImageClick);
}

if (downloadBtn) {
    const handleDownloadClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        downloadCertificate();
    };
    
    downloadBtn.addEventListener('click', handleDownloadClick);
    downloadBtn.addEventListener('touchend', handleDownloadClick);
}

// Submit contact form via Web3Forms with optimistic UI and graceful error states
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        successMessage.classList.remove(CSS_CLASSES.SHOW);
        errorMessage.classList.remove(CSS_CLASSES.SHOW);
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.querySelector('.btn-text').textContent;
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = CONTENT_CONFIG.FORM_BUTTON_STATES.SENDING;
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                successMessage.classList.add(CSS_CLASSES.SHOW);
                contactForm.reset();
                
                formInputs.forEach(input => {
                    input.classList.remove(CSS_CLASSES.INVALID, CSS_CLASSES.VALID);
                });
                
                setTimeout(() => {
                    successMessage.classList.remove(CSS_CLASSES.SHOW);
                }, FORM_CONFIG.MESSAGE_DISPLAY_DURATION);
            } else {
                throw new Error(result.message || 'Submission failed');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            errorMessage.classList.add(CSS_CLASSES.SHOW);
            
            setTimeout(() => {
                errorMessage.classList.remove(CSS_CLASSES.SHOW);
            }, FORM_CONFIG.MESSAGE_DISPLAY_DURATION);
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = originalBtnText;
        }
    });
}

formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateInput(input);
    });
    
    input.addEventListener('input', () => {
        if (input.classList.contains(CSS_CLASSES.INVALID)) {
            validateInput(input);
        }
    });
});

// Validate a single input against required, email, and phone constraints
function validateInput(input) {
    const value = input.value.trim();
    
    input.classList.remove(CSS_CLASSES.INVALID, CSS_CLASSES.VALID);
    
    if (input.hasAttribute('required') && value === '') {
        input.classList.add(CSS_CLASSES.INVALID);
        return false;
    }
    
    if (input.type === 'email' && value !== '') {
        if (!FORM_CONFIG.EMAIL_REGEX.test(value)) {
            input.classList.add(CSS_CLASSES.INVALID);
            return false;
        }
    }
    
    if (input.type === 'tel' && value !== '') {
        if (!FORM_CONFIG.PHONE_REGEX.test(value) || value.length < 10) {
            input.classList.add(CSS_CLASSES.INVALID);
            return false;
        }
    }
    
    if (value !== '') {
        input.classList.add(CSS_CLASSES.VALID);
    }
    
    return true;
}