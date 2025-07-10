// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');
const typingText = document.getElementById('typing-text');
const contactForm = document.getElementById('contact-form');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.getElementById('lightbox-close');
const galleryItems = document.querySelectorAll('.gallery-item');

// Typing Animation
const texts = [
    "Product Manager & Web Developer",
    "Over 10+ years of fintech product leadership",
    "Crafting AI-powered solutions that work",
    "Turning ideas into scalable fintech MVPs",
    "Building to empower, simplify and scale"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        // Pause at end
        setTimeout(() => {
            isDeleting = true;
        }, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
    }

    setTimeout(typeText, typingSpeed);
}

// Start typing animation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeText, 1000);
});

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .stat-item, .skill-category, .contact-method');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Project Cards Hover Effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Gallery Lightbox
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imageSrc = item.getAttribute('data-image');
        lightboxImage.src = imageSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Escape key to close lightbox
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// Contact Form Handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Reset form labels
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
            field.value = '';
        });
    }, 2000);
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        ${type === 'success' ? 'background: #10B981;' : 'background: #EF4444;'}
    `;
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Slide out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroScroll = document.querySelector('.hero-scroll');
    
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    if (heroScroll) {
        heroScroll.style.opacity = Math.max(0, 1 - scrolled / 300);
    }
});

// Skill badges animation
document.querySelectorAll('.skill-badge').forEach(badge => {
    badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'translateY(-5px) scale(1.05)';
    });
    
    badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'translateY(0) scale(1)';
    });
});

// Stats counter animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + '+';
    }, 20);
}

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const target = parseInt(statNumber.textContent);
            animateCounter(statNumber, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// Social links hover effects
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        // Set initial opacity
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});

// Carousel auto-pause on hover
const carouselTrack = document.getElementById('carousel-track');
if (carouselTrack) {
    carouselTrack.addEventListener('mouseenter', () => {
        carouselTrack.style.animationPlayState = 'paused';
    });
    
    carouselTrack.addEventListener('mouseleave', () => {
        carouselTrack.style.animationPlayState = 'running';
    });
}

// Form field focus effects
document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
    field.addEventListener('focus', () => {
        field.parentElement.classList.add('focused');
    });
    
    field.addEventListener('blur', () => {
        if (!field.value) {
            field.parentElement.classList.remove('focused');
        }
    });
    
    // Check if field has value on page load
    if (field.value) {
        field.parentElement.classList.add('focused');
    }
});

// Navbar active link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Add active nav link styles
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #4F46E5 !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
    .form-group.focused label {
        top: -0.5rem !important;
        left: 0.5rem !important;
        font-size: 0.8rem !important;
        color: #4F46E5 !important;
        background: white !important;
        padding: 0 0.5rem !important;
    }
`;
document.head.appendChild(style);

// Preloader (optional)
function createPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">Solomon</div>
            <div class="preloader-spinner"></div>
        </div>
    `;
    
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #4F46E5;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    const preloaderStyle = document.createElement('style');
    preloaderStyle.textContent = `
        .preloader-content {
            text-align: center;
            color: white;
        }
        .preloader-logo {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 2rem;
        }
        .preloader-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(preloaderStyle);
    document.body.appendChild(preloader);
    
    // Hide preloader when page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    });
}

// Initialize preloader
// createPreloader(); // Uncomment if you want the preloader

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
        img.style.opacity = '0.5';
        img.alt = 'Image not available';
    });
});

// Copy to clipboard functionality (for contact info)
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

// Add click to copy functionality to contact methods
document.querySelectorAll('.contact-method').forEach(method => {
    method.addEventListener('click', () => {
        const text = method.querySelector('p').textContent;
        if (text.includes('@') || text.includes('+')) {
            copyToClipboard(text);
        }
    });
    
    method.style.cursor = 'pointer';
    method.title = 'Click to copy';
});

// Scroll to top functionality
function createScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.id = 'scroll-to-top';
    
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: #4F46E5;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
    `;
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollBtn.addEventListener('mouseenter', () => {
        scrollBtn.style.transform = 'translateY(-3px)';
        scrollBtn.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.4)';
    });
    
    scrollBtn.addEventListener('mouseleave', () => {
        scrollBtn.style.transform = 'translateY(0)';
        scrollBtn.style.boxShadow = '0 4px 15px rgba(79, 70, 229, 0.3)';
    });
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
}

// Initialize scroll to top button
createScrollToTop();

// Performance optimization - lazy loading for images
function lazyLoadImages() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Initialize lazy loading
lazyLoadImages();

// Add resize handler for responsive adjustments
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate positions after resize
        updateActiveNavLink();
        
        // Close mobile menu if window is resized to desktop
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }, 250);
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio loaded successfully!');
    
    // Add entrance animations with stagger effect
    const elementsToAnimate = document.querySelectorAll('.project-card, .skill-category, .stat-item');
    elementsToAnimate.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Trigger initial scroll check
    updateActiveNavLink();
});

// Service Worker registration (for PWA capabilities)
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


//blog
document.querySelectorAll('.read-more').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const moreText = this.previousElementSibling;
    moreText.classList.toggle('hidden');
    this.textContent = moreText.classList.contains('hidden') ? 'Read More' : 'Show Less';
  });
});



//blog interactivity

document.querySelectorAll('.btn-read-more').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    alert("Full blog post coming soon!"); // Replace with navigation or modal logic
  });
});

//voice noterecorder

 class VoiceNoteRecorder {
            constructor() {
                this.mediaRecorder = null;
                this.audioChunks = [];
                this.isRecording = false;
                this.isPaused = false;
                this.recordingTime = 0;
                this.timerInterval = null;
                this.audioUrl = null;
                this.audioBlob = null;
                
                this.initializeElements();
                this.setupEventListeners();
                this.checkMicrophoneSupport();
            }
            
            initializeElements() {
                this.voiceNoteBtn = document.getElementById('voiceNoteBtn');
                this.voiceModal = document.getElementById('voiceModal');
                this.closeModal = document.getElementById('closeModal');
                this.recordBtn = document.getElementById('recordBtn');
                this.stopBtn = document.getElementById('stopBtn');
                this.playBtn = document.getElementById('playBtn');
                this.recordingStatus = document.getElementById('recordingStatus');
                this.recordingTimer = document.getElementById('recordingTimer');
                this.audioPlayer = document.getElementById('audioPlayer');
                this.sendVoiceNote = document.getElementById('sendVoiceNote');
                this.resetRecording = document.getElementById('resetRecording');
                this.errorMessage = document.getElementById('errorMessage');
                this.successMessage = document.getElementById('successMessage');
                this.waveformBars = document.getElementById('waveformBars');
                
                this.createWaveformBars();
            }
            
            createWaveformBars() {
                for (let i = 0; i < 50; i++) {
                    const bar = document.createElement('div');
                    bar.className = 'waveform-bar';
                    bar.style.height = '10px';
                    this.waveformBars.appendChild(bar);
                }
            }
            
            setupEventListeners() {
                this.voiceNoteBtn.addEventListener('click', () => this.openModal());
                this.closeModal.addEventListener('click', () => this.closeModalHandler());
                this.recordBtn.addEventListener('click', () => this.startRecording());
                this.stopBtn.addEventListener('click', () => this.stopRecording());
                this.playBtn.addEventListener('click', () => this.playRecording());
                this.sendVoiceNote.addEventListener('click', () => this.sendRecording());
                this.resetRecording.addEventListener('click', () => this.resetRecordingHandler());
                
                // Close modal when clicking outside
                this.voiceModal.addEventListener('click', (e) => {
                    if (e.target === this.voiceModal) {
                        this.closeModalHandler();
                    }
                });
            }
            
            checkMicrophoneSupport() {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    this.showError('Your browser does not support microphone recording. Please use a modern browser like Chrome, Firefox, or Safari.');
                    this.voiceNoteBtn.disabled = true;
                }
            }
            
            openModal() {
                this.voiceModal.classList.add('active');
                this.resetRecordingHandler();
            }
            
            closeModalHandler() {
                if (this.isRecording) {
                    this.stopRecording();
                }
                this.voiceModal.classList.remove('active');
            }
            
            async startRecording() {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ 
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            sampleRate: 44100
                        }
                    });
                    
                    this.mediaRecorder = new MediaRecorder(stream, {
                        mimeType: 'audio/webm;codecs=opus'
                    });
                    
                    this.audioChunks = [];
                    this.recordingTime = 0;
                    
                    this.mediaRecorder.ondataavailable = (event) => {
                        this.audioChunks.push(event.data);
                    };
                    
                    this.mediaRecorder.onstop = () => {
                        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                        this.audioUrl = URL.createObjectURL(this.audioBlob);
                        this.audioPlayer.src = this.audioUrl;
                        this.audioPlayer.style.display = 'block';
                        this.sendVoiceNote.disabled = false;
                        this.playBtn.disabled = false;
                        
                        // Stop all tracks
                        stream.getTracks().forEach(track => track.stop());
                    };
                    
                    this.mediaRecorder.start();
                    this.isRecording = true;
                    this.updateUI();
                    this.startTimer();
                    this.startWaveformAnimation();
                    
                } catch (error) {
                    this.showError('Could not access microphone. Please ensure you have granted microphone permissions.');
                    console.error('Error accessing microphone:', error);
                }
            }
            
            stopRecording() {
                if (this.mediaRecorder && this.isRecording) {
                    this.mediaRecorder.stop();
                    this.isRecording = false;
                    this.updateUI();
                    this.stopTimer();
                    this.stopWaveformAnimation();
                }
            }
            
            playRecording() {
                if (this.audioPlayer.paused) {
                    this.audioPlayer.play();
                    this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    this.audioPlayer.pause();
                    this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
                
                this.audioPlayer.onended = () => {
                    this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
                };
            }
            
            updateUI() {
                if (this.isRecording) {
                    this.recordingStatus.textContent = 'Recording...';
                    this.recordingStatus.classList.add('recording');
                    this.recordBtn.disabled = true;
                    this.stopBtn.disabled = false;
                    this.recordBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                } else {
                    this.recordingStatus.textContent = this.audioBlob ? 'Recording complete' : 'Click record to start';
                    this.recordingStatus.classList.remove('recording');
                    this.recordBtn.disabled = false;
                    this.stopBtn.disabled = true;
                    this.recordBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                }
            }
            
            startTimer() {
                this.timerInterval = setInterval(() => {
                    this.recordingTime++;
                    const minutes = Math.floor(this.recordingTime / 60);
                    const seconds = this.recordingTime % 60;
                    this.recordingTimer.textContent = 
                        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }, 1000);
            }
            
            stopTimer() {
                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                    this.timerInterval = null;
                }
            }
            
            startWaveformAnimation() {
                const bars = this.waveformBars.querySelectorAll('.waveform-bar');
                this.waveformInterval = setInterval(() => {
                    bars.forEach(bar => {
                        const height = Math.random() * 60 + 10;
                        bar.style.height = `${height}px`;
                    });
                }, 100);
            }
            
            stopWaveformAnimation() {
                if (this.waveformInterval) {
                    clearInterval(this.waveformInterval);
                    this.waveformInterval = null;
                }
                
                const bars = this.waveformBars.querySelectorAll('.waveform-bar');
                bars.forEach(bar => {
                    bar.style.height = '10px';
                });
            }
            
            async sendRecording() {
                if (!this.audioBlob) return;
                
                try {
                    // Create FormData to send the audio file
                    const formData = new FormData();
                    formData.append('voiceNote', this.audioBlob, 'voice-note.webm');
                    formData.append('senderName', document.getElementById('name').value || 'Anonymous');
                    formData.append('senderEmail', document.getElementById('email').value || 'Not provided');
                    formData.append('timestamp', new Date().toISOString());
                    
                    // For demonstration, we'll show a success message
                    // In a real implementation, you would send this to your server
                    this.showSuccess('Voice note recorded successfully! In a real implementation, this would be sent to your server or email.');
                    
                    // Example of how you might send to a server:
                    /*
                    const response = await fetch('/api/voice-notes', {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (response.ok) {
                        this.showSuccess('Voice note sent successfully!');
                        setTimeout(() => this.closeModalHandler(), 2000);
                    } else {
                        throw new Error('Failed to send voice note');
                    }
                    */
                    
                    // For now, create a download link for the user
                    const downloadLink = document.createElement('a');
                    downloadLink.href = this.audioUrl;
                    downloadLink.download = 'voice-note.webm';
                    downloadLink.click();
                    
                } catch (error) {
                    this.showError('Failed to send voice note. Please try again.');
                    console.error('Error sending voice note:', error);
                }
            }
            
            resetRecordingHandler() {
                this.stopRecording();
                this.audioChunks = [];
                this.recordingTime = 0;
                this.recordingTimer.textContent = '00:00';
                this.audioPlayer.style.display = 'none';
                this.sendVoiceNote.disabled = true;
                this.playBtn.disabled = true;
                this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
                this.updateUI();
                this.hideMessages();
                
                if (this.audioUrl) {
                    URL.revokeObjectURL(this.audioUrl);
                    this.audioUrl = null;
                }
                this.audioBlob = null;
            }
            
            showError(message) {
                this.errorMessage.textContent = message;
                this.errorMessage.style.display = 'block';
                this.successMessage.style.display = 'none';
            }
            
            showSuccess(message) {
                this.successMessage.textContent = message;
                this.successMessage.style.display = 'block';
                this.errorMessage.style.display = 'none';
            }
            
            hideMessages() {
                this.errorMessage.style.display = 'none';
                this.successMessage.style.display = 'none';
            }
        }
        
        // Initialize the voice note recorder when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new VoiceNoteRecorder();
            
            // Handle regular form submission
            document.getElementById('contact-form').addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Regular form submission would happen here. In a real implementation, this would send the form data to your server.');
            });
        });
