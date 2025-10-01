/* ========================================
   LUCIFER'S PORTFOLIO - INTERACTIVE FEATURES
   ======================================== */

// ===== GLOBAL VARIABLES =====
let isDarkMode = false;
let isMenuOpen = false;
let scrollTimeout;

// ===== DOM ELEMENTS (will be initialized after DOM loads) =====
let body, header, mobileMenu, mobileMenuBtn, backToTopBtn, scrollProgress, themeToggle, contactForm;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    initializeDOMElements();
    
    // Initialize all features
    initializeApp();
});

function initializeDOMElements() {
    body = document.body;
    header = document.querySelector('.header');
    mobileMenu = document.getElementById('mobile-menu');
    mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    backToTopBtn = document.getElementById('back-to-top');
    scrollProgress = document.getElementById('scroll-progress');
    themeToggle = document.getElementById('theme-toggle');
    contactForm = document.querySelector('form');
    
    console.log('DOM elements initialized');
}

function initializeApp() {
    // Initialize all features with error handling
    try {
        initSmoothScroll();
        initDarkMode();
        initScrollAnimations();
        initMobileMenu();
        initContactForm();
        initScrollEffects();
        initIntersectionObserver();
        
        // Set initial theme
        setInitialTheme();
        
        console.log('Portfolio initialized successfully! 🚀');
    } catch (error) {
        console.error('Error initializing portfolio:', error);
    }
}

// ===== SMOOTH SCROLL TO SECTIONS =====
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection && header) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (isMenuOpen) {
                    toggleMobileMenu();
                }
                
                // Add active state to clicked link
                setActiveNavLink(this);
            }
        });
    });
}

function setActiveNavLink(activeLink) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    activeLink.classList.add('active');
}

// ===== DARK/LIGHT MODE TOGGLE =====
function initDarkMode() {
    // Create theme toggle button if it doesn't exist
    if (!themeToggle) {
        createThemeToggleButton();
    }
    
    // Add click event to theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

function createThemeToggleButton() {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'theme-toggle';
    toggleBtn.className = 'theme-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
    
    // Add to header
    const nav = document.querySelector('nav .flex');
    if (nav) {
        nav.appendChild(toggleBtn);
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    setTheme(isDarkMode ? 'dark' : 'light');
}

function setTheme(theme) {
    isDarkMode = theme === 'dark';
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    } else {
        body.classList.remove('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme);
}

function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (systemPrefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
    });
}

function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for multiple elements
                if (entry.target.parentElement.classList.contains('grid')) {
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    
                    setTimeout(() => {
                        entry.target.style.animationDelay = `${index * 0.1}s`;
                    }, 100);
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation classes
    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .project-card, .skill-item, .contact-item').forEach(el => {
        observer.observe(el);
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && mobileMenu && mobileMenuBtn && 
            !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
        
        // Animate menu items
        if (isMenuOpen) {
            const menuItems = mobileMenu.querySelectorAll('a');
            menuItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
                item.classList.add('animate-slide-in');
            });
        }
    }
    
    // Update hamburger icon
    if (mobileMenuBtn) {
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.className = isMenuOpen ? 'fas fa-times' : 'fas fa-bars';
        }
    }
    
    // Prevent body scroll when menu is open
    body.style.overflow = isMenuOpen ? 'hidden' : '';
}

// ===== CONTACT FORM VALIDATION =====
function initContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    } else {
        console.log('Contact form not found');
    }
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(e);
    
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (!value) {
                errorMessage = 'Name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            }
            break;
            
        case 'email':
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!isValidEmail(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;
            
        case 'message':
            if (!value) {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();
    
    // Validate all fields
    let isFormValid = true;
    
    if (!name || name.length < 2) {
        showFieldError(contactForm.querySelector('[name="name"]'), 'Name is required');
        isFormValid = false;
    }
    
    if (!email || !isValidEmail(email)) {
        showFieldError(contactForm.querySelector('[name="email"]'), 'Please enter a valid email address');
        isFormValid = false;
    }
    
    if (!message || message.length < 10) {
        showFieldError(contactForm.querySelector('[name="message"]'), 'Message must be at least 10 characters');
        isFormValid = false;
    }
    
    if (!isFormValid) {
        showNotification('Please fix the errors above', 'error');
        return;
    }
    
    // Simulate form submission
    submitForm(name, email, message);
}

function submitForm(name, email, message) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        
        // Show success message
        showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
        
        // Reset form
        contactForm.reset();
        
        // Clear any error states
        contactForm.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        contactForm.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
        
    }, 2000);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to body
    body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    // Throttled scroll event
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            updateScrollProgress();
            updateHeaderOnScroll();
            updateBackToTopButton();
        }, 10);
    });
}

function updateScrollProgress() {
    if (scrollProgress) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgress.style.width = Math.min(scrollPercent, 100) + '%';
    }
}

function updateHeaderOnScroll() {
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

function updateBackToTopButton() {
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
}

// ===== BACK TO TOP FUNCTIONALITY =====
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ===== UTILITY FUNCTIONS =====
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    // Tab navigation for accessibility
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
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
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Portfolio Error:', e.error);
});

// ===== EXPORT FOR GLOBAL ACCESS =====
window.Portfolio = {
    toggleTheme,
    toggleMobileMenu,
    scrollToTop,
    showNotification
};

// ===== CSS FOR NOTIFICATIONS =====
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 16px;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 400px;
    border-left: 4px solid #6366f1;
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    border-left-color: #10b981;
}

.notification-error {
    border-left-color: #ef4444;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.notification-close {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    padding: 4px;
}

.notification-close:hover {
    color: #374151;
}

.error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.error-message {
    color: #ef4444;
    font-size: 14px;
    margin-top: 4px;
}

.loading {
    opacity: 0.7;
    cursor: not-allowed;
}

.theme-toggle {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.theme-toggle:hover {
    color: #6366f1;
    background: rgba(99, 102, 241, 0.1);
}

.animate-slide-in {
    animation: slideInFromRight 0.3s ease forwards;
}

@keyframes slideInFromRight {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.keyboard-navigation *:focus {
    outline: 2px solid #6366f1 !important;
    outline-offset: 2px !important;
}
</style>
`;

// Inject notification styles
document.head.insertAdjacentHTML('beforeend', notificationStyles);

console.log('Script.js loaded successfully! 🎉');
