// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    this.applyTheme();
    this.bindEvents();
  }

  applyTheme() {
    if (this.theme === 'light') {
      document.body.classList.add('light-theme');
      document.querySelector('.theme-icon').textContent = '🌙';
    } else {
      document.body.classList.remove('light-theme');
      document.querySelector('.theme-icon').textContent = '☀️';
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
  }

  bindEvents() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }
}

// Mobile Navigation
class MobileNavigation {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.mobile-nav-toggle');
    
    if (this.isOpen) {
      nav.classList.add('mobile-open');
      toggle.classList.add('active');
    } else {
      nav.classList.remove('mobile-open');
      toggle.classList.remove('active');
    }
  }

  bindEvents() {
    const mobileToggle = document.getElementById('mobileNavToggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => this.toggle());
    }

    // Close on link click
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isOpen) this.toggle();
      });
    });
  }
}

// Smooth Scroll and ScrollSpy
class ScrollManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindSmoothScroll();
    this.initScrollSpy();
    this.initRevealOnScroll();
  }

  bindSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  initScrollSpy() {
    const tocLinks = document.querySelectorAll('.article-toc a');
    if (tocLinks.length === 0) return;

    const headings = document.querySelectorAll('.article-body h2, .article-body h3');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-50px 0px -80% 0px' });

    headings.forEach(heading => observer.observe(heading));
  }

  initRevealOnScroll() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card, .timeline-step, .feature-block').forEach(el => {
      observer.observe(el);
    });
  }
}

// Article Table of Contents Generator
class TableOfContents {
  constructor() {
    this.init();
  }

  init() {
    this.generateTOC();
  }

  generateTOC() {
    const tocContainer = document.getElementById('articleToc');
    const headings = document.querySelectorAll('.article-body h2, .article-body h3');
    
    if (!tocContainer || headings.length < 3) {
      if (tocContainer) tocContainer.style.display = 'none';
      return;
    }

    let tocHTML = '<h3>Table of Contents</h3><ul>';
    
    headings.forEach((heading, index) => {
      const id = `heading-${index}`;
      heading.id = id;
      
      const level = heading.tagName.toLowerCase();
      const text = heading.textContent;
      const className = level === 'h2' ? 'toc-h2' : 'toc-h3';
      
      tocHTML += `<li class="${className}"><a href="#${id}">${text}</a></li>`;
    });
    
    tocHTML += '</ul>';
    tocContainer.innerHTML = tocHTML;
  }
}

// Testimonials Slider
class TestimonialsSlider {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.testimonial-slide');
    this.totalSlides = this.slides.length;
    this.autoplayInterval = null;
    this.init();
  }

  init() {
    if (this.totalSlides === 0) return;
    
    this.createDots();
    this.bindEvents();
    this.startAutoplay();
  }

  createDots() {
    const dotsContainer = document.getElementById('testimonialDots');
    if (!dotsContainer) return;

    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = `testimonial-dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => this.goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  goToSlide(slideIndex) {
    this.slides[this.currentSlide].classList.remove('active');
    document.querySelectorAll('.testimonial-dot')[this.currentSlide].classList.remove('active');
    
    this.currentSlide = slideIndex;
    
    this.slides[this.currentSlide].classList.add('active');
    document.querySelectorAll('.testimonial-dot')[this.currentSlide].classList.add('active');
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.goToSlide(prevIndex);
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  bindEvents() {
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const slider = document.getElementById('testimonialSlider');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

    // Pause autoplay on hover
    if (slider) {
      slider.addEventListener('mouseenter', () => this.stopAutoplay());
      slider.addEventListener('mouseleave', () => this.startAutoplay());
    }
  }
}

// Accordion Manager
class AccordionManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all accordion items
        document.querySelectorAll('.accordion-item').forEach(accordionItem => {
          accordionItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }
}

// Form Validation
class FormValidator {
  constructor() {
    this.init();
  }

  init() {
    const form = document.getElementById('contactForm');
    if (form) {
      this.bindFormEvents(form);
    }
  }

  bindFormEvents(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validateForm(form);
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  validateForm(form) {
    const formData = new FormData(form);
    let isValid = true;

    // Clear previous errors
    this.clearAllErrors(form);

    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    // Email validation
    const emailField = form.querySelector('#email');
    if (emailField && !this.isValidEmail(emailField.value)) {
      this.showError(emailField, 'Please enter a valid email address');
      isValid = false;
    }

    if (isValid) {
      this.submitForm(form, formData);
    }
  }

  validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
      this.showError(field, 'This field is required');
      return false;
    }

    if (field.type === 'email' && value && !this.isValidEmail(value)) {
      this.showError(field, 'Please enter a valid email address');
      return false;
    }

    return true;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showError(field, message) {
    const errorElement = document.getElementById(field.name + 'Error') || 
                        document.getElementById(field.id + 'Error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
    field.style.borderColor = '#ef4444';
  }

  clearError(field) {
    const errorElement = document.getElementById(field.name + 'Error') || 
                        document.getElementById(field.id + 'Error');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
    field.style.borderColor = '';
  }

  clearAllErrors(form) {
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(el => el.style.display = 'none');
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => input.style.borderColor = '');
  }

  submitForm(form, formData) {
    const statusElement = document.getElementById('formStatus');
    
    // Since this is a static form, we'll show a success message
    // and provide instructions for the user
    const firstName = formData.get('firstName');
    const email = formData.get('email');
    const projectType = formData.get('projectType');
    const message = formData.get('message');
    
    // Create email body for mailto
    const emailBody = `
Name: ${firstName} ${formData.get('lastName')}
Email: ${email}
Phone: ${formData.get('phone') || 'Not provided'}
Project Type: ${projectType}
Location: ${formData.get('location') || 'Not provided'}
Budget: ${formData.get('budget') || 'Not specified'}

Message:
${message}
    `.trim();
    
    // Open email client
    const mailtoLink = `mailto:hello@canvasinteriors.com?subject=Project Enquiry from ${firstName}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
    
    // Show success message
    if (statusElement) {
      statusElement.className = 'form-status success';
      statusElement.textContent = 'Your email client should now open with your enquiry. If it doesn\'t, please copy the details and email us directly at hello@canvasinteriors.com';
      statusElement.style.display = 'block';
    }
    
    // Reset form after a delay
    setTimeout(() => {
      form.reset();
      if (statusElement) {
        statusElement.style.display = 'none';
      }
    }, 10000);
  }
}

// Panorama Viewer Mock Interaction
class PanoramaViewer {
  constructor() {
    this.currentRoom = 'living';
    this.rooms = {
      living: 'Living Room - Contemporary elegance with natural light',
      kitchen: 'Kitchen - Modern functionality meets timeless design',
      bedroom: 'Bedroom - Serene sanctuary with luxury finishes'
    };
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const controlDots = document.querySelectorAll('.control-dot');
    const overlay = document.querySelector('.panorama-overlay h3');
    
    controlDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const room = dot.dataset.room;
        if (room && this.rooms[room]) {
          // Update active dot
          controlDots.forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
          
          // Update room info
          if (overlay) {
            overlay.textContent = this.rooms[room];
          }
          
          this.currentRoom = room;
        }
      });
    });
  }
}

// Header Scroll Effect
class HeaderScrollEffect {
  constructor() {
    this.header = document.getElementById('header');
    this.init();
  }

  init() {
    if (!this.header) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    });
  }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Core functionality
  new ThemeManager();
  new MobileNavigation();
  new ScrollManager();
  new HeaderScrollEffect();
  
  // Page-specific functionality
  new TableOfContents();
  new TestimonialsSlider();
  new AccordionManager();
  new FormValidator();
  new PanoramaViewer();
  
  // Add loading animation completion
  document.body.classList.add('loaded');
});

// Utility functions for enhanced UX
const Utils = {
  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
  
  // Get current theme
  getCurrentTheme() {
    return document.body.classList.contains('light-theme') ? 'light' : 'dark';
  }
};

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThemeManager, ScrollManager, FormValidator, Utils };
}

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`Page loaded in ${pageLoadTime}ms`);
    }, 0);
  });
}
