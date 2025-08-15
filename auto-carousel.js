// ===== CARROSSEL AUTOMÁTICO DE PARCEIROS =====

// Elementos do carrossel
const categoryButtons = document.querySelectorAll('.category-btn');
const categoryContents = document.querySelectorAll('.category-content');

// Estado do carrossel
let currentCategory = 'hospitais';
let autoCarouselIntervals = {};
let isPaused = false;
let currentPositions = {}; // Posição atual de cada categoria
let isDragging = false;
let startX = 0;
let currentX = 0;

// Função para trocar categoria
function switchCategory(category) {
    // Parar o carrossel automático da categoria anterior
    if (autoCarouselIntervals[currentCategory]) {
        clearInterval(autoCarouselIntervals[currentCategory]);
    }
    
    // Esconder todos os containers de categoria
    categoryContents.forEach(content => {
        content.classList.add('hidden');
        content.classList.remove('active');
    });
    
    // Mostrar o container da categoria selecionada
    const targetContent = document.querySelector(`.category-content[data-category="${category}"]`);
    if (targetContent) {
        targetContent.classList.remove('hidden');
        targetContent.classList.add('active');
    }
    
    // Atualizar botões de categoria
    categoryButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`.category-btn[data-category="${category}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    currentCategory = category;
    
    // Iniciar carrossel automático para a nova categoria
    startAutoCarousel(category);
}

// Função para iniciar carrossel automático
function startAutoCarousel(category) {
    const track = document.querySelector(`.auto-carousel-track[data-category="${category}"]`);
    if (!track) return;
    
    const slides = track.querySelectorAll('.carousel-slide');
    
    if (slides.length <= 1) {
        return;
    }
    
    // Inicializar posição se não existir
    if (typeof currentPositions[category] === 'undefined') {
        currentPositions[category] = 0;
    }
    
    let currentPosition = currentPositions[category];
    
    // Função para calcular a largura do slide + gap
    function getSlideWidthLocal() {
        return getSlideWidth(category);
    }
    
    // Função para mover o carrossel
    function moveCarousel() {
        if (isPaused) return;
        
        const slideWidth = getSlideWidthLocal();
        currentPosition += slideWidth;
        
        // Se chegou ao final, voltar para o início
        if (currentPosition >= (slides.length - 1) * slideWidth) {
            currentPosition = 0;
        }
        
        // Salvar posição atual
        currentPositions[category] = currentPosition;
        
        // Aplicar a transformação
        track.style.transform = `translateX(-${currentPosition}px)`;
    }
    
    // Iniciar intervalo automático
    autoCarouselIntervals[category] = setInterval(moveCarousel, 3000); // Mover a cada 3 segundos
}

// Função para navegar para o slide anterior
function goToPreviousSlide(category) {
    const track = document.querySelector(`.auto-carousel-track[data-category="${category}"]`);
    if (!track) return;
    
    const slides = track.querySelectorAll('.carousel-slide');
    if (slides.length <= 1) return;
    
    const slideWidth = getSlideWidth(category);
    let currentPosition = currentPositions[category] || 0;
    
    currentPosition -= slideWidth;
    if (currentPosition < 0) {
        currentPosition = (slides.length - 1) * slideWidth;
    }
    
    currentPositions[category] = currentPosition;
    track.style.transform = `translateX(-${currentPosition}px)`;
    
    // Pausar temporariamente o carrossel automático
    pauseCarousel(category);
    setTimeout(() => resumeCarousel(category), 5000);
}

// Função para navegar para o próximo slide
function goToNextSlide(category) {
    const track = document.querySelector(`.auto-carousel-track[data-category="${category}"]`);
    if (!track) return;
    
    const slides = track.querySelectorAll('.carousel-slide');
    if (slides.length <= 1) return;
    
    const slideWidth = getSlideWidth(category);
    let currentPosition = currentPositions[category] || 0;
    
    currentPosition += slideWidth;
    if (currentPosition >= slides.length * slideWidth) {
        currentPosition = 0;
    }
    
    currentPositions[category] = currentPosition;
    track.style.transform = `translateX(-${currentPosition}px)`;
    
    // Pausar temporariamente o carrossel automático
    pauseCarousel(category);
    setTimeout(() => resumeCarousel(category), 5000);
}

// Função para pausar carrossel
function pauseCarousel(category) {
    if (autoCarouselIntervals[category]) {
        clearInterval(autoCarouselIntervals[category]);
        autoCarouselIntervals[category] = null;
    }
}

// Função para resumir carrossel
function resumeCarousel(category) {
    if (!autoCarouselIntervals[category]) {
        startAutoCarousel(category);
    }
}

// Função para calcular largura do slide (reutilizável)
function getSlideWidth(category) {
    const track = document.querySelector(`.auto-carousel-track[data-category="${category}"]`);
    if (!track) return 0;
    
    const slides = track.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return 0;
    
    const slide = slides[0];
    if (window.innerWidth <= 768) {
        return slide.offsetWidth;
    } else {
        const gap = window.innerWidth >= 1024 ? 24 : 32;
        return slide.offsetWidth + gap;
    }
}

// Event listeners para botões de categoria
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        switchCategory(category);
    });
});

// Event listeners para botões de navegação
document.addEventListener('click', (e) => {
    if (e.target.closest('.carousel-nav-btn')) {
        const btn = e.target.closest('.carousel-nav-btn');
        const category = btn.dataset.category;
        
        if (btn.classList.contains('prev-btn')) {
            goToPreviousSlide(category);
        } else if (btn.classList.contains('next-btn')) {
            goToNextSlide(category);
        }
    }
});

// ===== FUNCIONALIDADE DE SWIPE TOUCH =====
function setupTouchEvents() {
    const carouselTracks = document.querySelectorAll('.auto-carousel-track');
    
    carouselTracks.forEach(track => {
        track.addEventListener('touchstart', handleTouchStart, { passive: false });
        track.addEventListener('touchmove', handleTouchMove, { passive: false });
        track.addEventListener('touchend', handleTouchEnd, { passive: false });
    });
}

function handleTouchStart(e) {
    isDragging = true;
    startX = e.touches[0].clientX;
    currentX = startX;
    
    // Pausar carrossel automático
    const category = e.currentTarget.dataset.category;
    pauseCarousel(category);
}

function handleTouchMove(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    currentX = e.touches[0].clientX;
    
    const track = e.currentTarget;
    const category = track.dataset.category;
    const currentPosition = currentPositions[category] || 0;
    const deltaX = currentX - startX;
    
    // Aplicar movimento em tempo real
    track.style.transform = `translateX(calc(-${currentPosition}px + ${deltaX}px))`;
}

function handleTouchEnd(e) {
    if (!isDragging) return;
    
    isDragging = false;
    const track = e.currentTarget;
    const category = track.dataset.category;
    const deltaX = currentX - startX;
    const threshold = 50; // Mínimo de pixels para considerar como swipe
    
    if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
            // Swipe para direita - slide anterior
            goToPreviousSlide(category);
        } else {
            // Swipe para esquerda - próximo slide
            goToNextSlide(category);
        }
    } else {
        // Voltar para posição original
        const currentPosition = currentPositions[category] || 0;
        track.style.transform = `translateX(-${currentPosition}px)`;
    }
    
    // Resumir carrossel automático após um tempo
    setTimeout(() => resumeCarousel(category), 5000);
}

// Pausar carrossel quando o mouse estiver sobre ele
document.addEventListener('mouseenter', function(e) {
    if (e.target.closest('.auto-carousel-container')) {
        isPaused = true;
    }
}, true);

document.addEventListener('mouseleave', function(e) {
    if (e.target.closest('.auto-carousel-container')) {
        isPaused = false;
    }
}, true);

// Pausar carrossel quando a janela perder o foco
window.addEventListener('blur', () => {
    isPaused = true;
});

window.addEventListener('focus', () => {
    isPaused = false;
});

// Atualizar carrossel no resize da janela
window.addEventListener('resize', () => {
    // Aguardar um pouco para o resize terminar
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        // Reiniciar carrossel automático para a categoria atual
        if (autoCarouselIntervals[currentCategory]) {
            clearInterval(autoCarouselIntervals[currentCategory]);
        }
        
        // Resetar posição do carrossel
        const track = document.querySelector(`.auto-carousel-track[data-category="${currentCategory}"]`);
        if (track) {
            track.style.transform = 'translateX(0)';
        }
        
        startAutoCarousel(currentCategory);
    }, 250);
});

// Função para inicializar o carrossel após o DOM estar completamente carregado
function initializeCarousel() {
    // Aguardar um pouco para garantir que todos os elementos estejam renderizados
    setTimeout(() => {
        startAutoCarousel(currentCategory);
        
        // Configurar eventos de touch
        setupTouchEvents();
        
        // Verificar se o carrossel está funcionando corretamente
        setTimeout(() => {
            checkCarouselStatus(currentCategory);
        }, 1000);
    }, 500);
}

// Função para verificar o status do carrossel
function checkCarouselStatus(category) {
    const track = document.querySelector(`.auto-carousel-track[data-category="${category}"]`);
    if (!track) return;
    
    const slides = track.querySelectorAll('.carousel-slide');
    const isMobile = window.innerWidth <= 768;
    
    // Função silenciosa para verificação interna
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCarousel);
} else {
    initializeCarousel();
}

// Também inicializar quando a página estiver completamente carregada
window.addEventListener('load', () => {
    if (!autoCarouselIntervals[currentCategory]) {
        startAutoCarousel(currentCategory);
    }
    
    // Verificar novamente após um tempo para garantir funcionamento
    setTimeout(() => {
        if (!autoCarouselIntervals[currentCategory]) {
            startAutoCarousel(currentCategory);
        }
    }, 2000);
}); 