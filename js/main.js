/**
 * ============================================
 * AGROCONSULTING - JAVASCRIPT PRINCIPAL
 * ============================================
 * Ce fichier gère toutes les interactions utilisateur :
 * - Navigation et menu mobile
 * - Animations au scroll
 * - Compteurs animés
 * - Formulaire de contact
 * - Défilement fluide
 */

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser tous les modules
    Navbar.init();
    MobileMenu.init();
    ScrollAnimations.init();
    CounterAnimation.init();
    ContactForm.init();
    SmoothScroll.init();
    ServicesSlider.init();
});

/* ============================================
 * MODULE: NAVBAR
 * ============================================
 * Gère l'apparence de la barre de navigation au scroll
 */
const Navbar = {
    /**
     * Initialisation du module
     */
    init() {
        this.navbar = document.getElementById('navbar');
        this.bindEvents();
    },

    /**
     * Attache les écouteurs d'événements
     */
    bindEvents() {
        window.addEventListener('scroll', () => this.onScroll());
    },

    /**
     * Gère l'événement de scroll
     * Ajoute/retire la classe 'scrolled' selon la position
     */
    onScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
};

/* ============================================
 * MODULE: MOBILE MENU
 * ============================================
 * Gère l'ouverture/fermeture du menu sur mobile
 */
const MobileMenu = {
    /**
     * Initialisation du module
     */
    init() {
        this.mobileToggle = document.getElementById('mobileToggle');
        this.navLinks = document.getElementById('navLinks');
        this.bindEvents();
    },

    /**
     * Attache les écouteurs d'événements
     */
    bindEvents() {
        this.mobileToggle.addEventListener('click', () => this.toggle());
        
        // Fermer le menu quand on clique sur un lien
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    },

    /**
     * Bascule l'état du menu (ouvert/fermé)
     */
    toggle() {
        this.mobileToggle.classList.toggle('active');
        this.navLinks.classList.toggle('active');
    },

    /**
     * Ferme le menu
     */
    close() {
        this.mobileToggle.classList.remove('active');
        this.navLinks.classList.remove('active');
    }
};

/* ============================================
 * MODULE: SCROLL ANIMATIONS
 * ============================================
 * Anime les éléments lorsqu'ils apparaissent à l'écran
 */
const ScrollAnimations = {
    /**
     * Initialisation du module
     */
    init() {
        this.fadeElements = document.querySelectorAll('.fade-in');
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,      // Déclenche quand 10% de l'élément est visible
                rootMargin: '0px 0px -50px 0px'  // Marge de détection
            }
        );
        this.observe();
    },

    /**
     * Commence à observer tous les éléments à animer
     */
    observe() {
        this.fadeElements.forEach(el => this.observer.observe(el));
    },

    /**
     * Gère l'intersection des éléments avec le viewport
     * @param {Array} entries - Éléments observés
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }
};

/* ============================================
 * MODULE: COUNTER ANIMATION
 * ============================================
 * Anime les compteurs de statistiques
 */
const CounterAnimation = {
    /**
     * Initialisation du module
     */
    init() {
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.5 }  // Déclenche quand 50% est visible
        );
        this.observe();
    },

    /**
     * Commence à observer tous les compteurs
     */
    observe() {
        this.statNumbers.forEach(stat => this.observer.observe(stat));
    },

    /**
     * Gère l'intersection des compteurs
     * @param {Array} entries - Éléments observés
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animateCounter(entry.target);
                this.observer.unobserve(entry.target); // Ne pas ré-animer
            }
        });
    },

    /**
     * Anime un compteur de 0 à sa valeur cible
     * @param {HTMLElement} element - Élément à animer
     */
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 secondes
        const step = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                // Déterminer le suffixe selon le label
                const label = element.parentElement.querySelector('.stat-label').textContent;
                const suffix = label.includes('%') ? '%' : '+';
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
};

/* ============================================
 * MODULE: CONTACT FORM
 * ============================================
 * Gère la soumission du formulaire de contact
 */
const ContactForm = {
    /**
     * Initialisation du module
     */
    init() {
        this.form = document.getElementById('contactForm');
        if (this.form) {
            this.bindEvents();
        }
    },

    /**
     * Attache les écouteurs d'événements
     */
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    /**
     * Gère la soumission du formulaire
     * @param {Event} e - Événement de soumission
     */
    async handleSubmit(e) {
        e.preventDefault(); // Empêcher le rechargement de la page
        
        const formData = new FormData(this.form);
        const submitBtn = this.form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        
        // Afficher l'état de chargement
        submitBtn.textContent = 'Envoi en cours...';
        submitBtn.disabled = true;
        
        try {
            // Envoi des données au serveur PHP
            const response = await fetch('php/contact.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showMessage('Merci pour votre message ! Notre équipe vous contactera dans les plus brefs délais.', 'success');
                this.form.reset(); // Vider le formulaire
            } else {
                this.showMessage('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.', 'error');
            }
        } catch (error) {
            console.error('Erreur:', error);
            this.showMessage('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.', 'error');
        } finally {
            // Restaurer le bouton
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    },

    /**
     * Affiche un message de confirmation ou d'erreur
     * @param {string} message - Message à afficher
     * @param {string} type - Type de message ('success' ou 'error')
     */
    showMessage(message, type) {
        // Supprimer l'ancien message s'il existe
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Créer l'élément de message
        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        
        // Styles selon le type
        const styles = type === 'success' 
            ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
            : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;';
        
        messageEl.style.cssText = `
            padding: 1rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            font-weight: 500;
            text-align: center;
            ${styles}
        `;
        
        // Insérer au début du formulaire
        this.form.insertBefore(messageEl, this.form.firstChild);
        
        // Supprimer automatiquement après 5 secondes
        setTimeout(() => messageEl.remove(), 5000);
    }
};

/* ============================================
 * MODULE: SMOOTH SCROLL
 * ============================================
 * Gère le défilement fluide vers les ancres
 */
const SmoothScroll = {
    /**
     * Initialisation du module
     */
    init() {
        this.bindEvents();
    },

    /**
     * Attache les écouteurs d'événements
     */
    bindEvents() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e));
        });
    },

    /**
     * Gère le clic sur les liens d'ancre
     * @param {Event} e - Événement de clic
     */
    handleClick(e) {
        const targetId = e.currentTarget.getAttribute('href');
        if (targetId === '#') return; // Ignorer les liens vides

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            // Calculer la position avec offset pour la navbar
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
};

/* ============================================
 * MODULE: SERVICES SLIDER
 * ============================================
 * Gère le défilement des cartes de services
 */
const ServicesSlider = {
    init() {
        this.slider = document.querySelector('.services-slider');
        this.track = document.querySelector('.services-track');
        this.prevBtn = document.querySelector('.slider-btn.prev');
        this.nextBtn = document.querySelector('.slider-btn.next');
        
        if (this.slider && this.track) {
            this.bindEvents();
        }
    },

    bindEvents() {
        this.prevBtn?.addEventListener('click', () => this.scroll('prev'));
        this.nextBtn?.addEventListener('click', () => this.scroll('next'));
    },

    scroll(direction) {
        const cardWidth = 290; // Largeur d'une carte + gap
        const scrollAmount = direction === 'prev' ? -cardWidth : cardWidth;
        
        this.track.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }
};
