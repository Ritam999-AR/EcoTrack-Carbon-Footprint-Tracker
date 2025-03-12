document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Get Started buttons redirect
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Change 'main-app.html' to your main application URL
            window.location.href = 'main-app.html';
        });
    });
    
    // Sticky navigation
    const nav = document.querySelector('nav');
    const navHeight = nav.offsetHeight;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Reveal animations for sections
    const revealElements = document.querySelectorAll('section');
    
    function reveal() {
        revealElements.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', reveal);
    
    // Initialize reveal on page load
    reveal();

    // Initialize language
    initializeLanguage();
});

// Language translations
const translations = {
    en: {
        about: "About",
        problem: "The Problem",
        solution: "Solution",
        resources: "Resources",
        heroTitle: "Track Your Carbon Footprint",
        heroText: "Take control of your environmental impact and help create a sustainable future for our planet.",
        getStarted: "Get Started",
        // Add more translations as needed
        whatIsCarbon: "What is a Carbon Footprint?",
        carbonText: "A carbon footprint is the total amount of greenhouse gases...",
        globalWarming: "Global Warming",
        seaLevels: "Rising Sea Levels",
        extremeWeather: "Extreme Weather",
        biodiversity: "Biodiversity Loss",
        // ... add more keys as needed
    },
    es: {
        about: "Acerca de",
        problem: "El Problema",
        solution: "Solución",
        resources: "Recursos",
        heroTitle: "Rastrea Tu Huella de Carbono",
        heroText: "Toma el control de tu impacto ambiental y ayuda a crear un futuro sostenible para nuestro planeta.",
        getStarted: "Comenzar",
        whatIsCarbon: "¿Qué es la Huella de Carbono?",
        carbonText: "La huella de carbono es la totalidad de gases de efecto invernadero...",
        globalWarming: "Calentamiento Global",
        seaLevels: "Aumento del Nivel del Mar",
        extremeWeather: "Clima Extremo",
        biodiversity: "Pérdida de Biodiversidad",
        // ... add more translations
    },
    fr: {
        about: "À propos",
        problem: "Le Problème",
        solution: "Solution",
        resources: "Ressources",
        heroTitle: "Suivez Votre Empreinte Carbone",
        heroText: "Prenez le contrôle de votre impact environnemental et contribuez à créer un avenir durable pour notre planète.",
        getStarted: "Commencer",
        whatIsCarbon: "Qu'est-ce que l'Empreinte Carbone?",
        carbonText: "L'empreinte carbone est la totalité des gaz à effet de serre...",
        globalWarming: "Réchauffement Climatique",
        seaLevels: "Élévation du Niveau de la Mer",
        extremeWeather: "Météo Extrême",
        biodiversity: "Perte de Biodiversité",
        // ... add more translations
    },
    de: {
        about: "Über uns",
        problem: "Das Problem",
        solution: "Lösung",
        resources: "Ressourcen",
        heroTitle: "Verfolgen Sie Ihren CO2-Fußabdruck",
        heroText: "Übernehmen Sie die Kontrolle über Ihre Umweltauswirkungen und helfen Sie mit, eine nachhaltige Zukunft für unseren Planeten zu schaffen.",
        getStarted: "Loslegen",
        whatIsCarbon: "Was ist ein CO2-Fußabdruck?",
        carbonText: "Der CO2-Fußabdruck ist die Gesamtheit der Treibhausgase...",
        globalWarming: "Globale Erwärmung",
        seaLevels: "Anstieg des Meeresspiegels",
        extremeWeather: "Extremwetter",
        biodiversity: "Verlust der Biodiversität",
        // ... add more translations
    }
};

// Function to translate the page
function translatePage(lang) {
    // Store the selected language in localStorage
    localStorage.setItem('preferredLanguage', lang);

    // Get all elements with data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            // Check if element is an input with placeholder
            if (element.placeholder) {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update meta description if exists
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && translations[lang].metaDescription) {
        metaDescription.setAttribute('content', translations[lang].metaDescription);
    }
}

// Function to initialize the page with saved language preference
function initializeLanguage() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    const langSelector = document.querySelector('.language-selector');
    if (langSelector) {
        langSelector.value = savedLang;
    }
    translatePage(savedLang);
}