// ===== SCRIPT PRINCIPAL SOBAM PLANOS =====

document.addEventListener('DOMContentLoaded', function() {
    // ===== VARIÁVEIS GLOBAIS =====
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const contactForm = document.getElementById('contact-form');
    const header = document.querySelector('header');
    
    
    emailjs.init("DYP-ZCfj9GmFyfXd0"); 
    
    // ===== MENU MOBILE =====
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.className = 'fas fa-bars text-xl';
            } else {
                icon.className = 'fas fa-times text-xl';
            }
        });
        
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = 'fas fa-bars text-xl';
            });
        });
    }
    
    // ===== HEADER SCROLL EFFECT =====
    window.addEventListener('scroll', function() {
        const heroSection = document.getElementById('home');
        const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 0;
        
        if (window.scrollY > heroBottom - 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
    
    // ===== MÁSCARA PARA TELEFONE =====
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d)(\d{4})$/, '$1-$2');
                e.target.value = value;
            }
        });
    }
    
    // ===== FUNÇÕES DE STATUS DO FORMULÁRIO =====
    function showFormStatus(status) {
        const formStatus = document.getElementById('form-status');
        const loadingStatus = document.getElementById('loading-status');
        const successStatus = document.getElementById('success-status');
        const errorStatus = document.getElementById('error-status');
        const submitBtn = document.getElementById('submit-btn');
        
        // Esconder todos os status
        loadingStatus.classList.add('hidden');
        successStatus.classList.add('hidden');
        errorStatus.classList.add('hidden');
        
        // Mostrar o status apropriado
        formStatus.classList.remove('hidden');
        
        switch(status) {
            case 'loading':
                loadingStatus.classList.remove('hidden');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
                break;
            case 'success':
                successStatus.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Solicitar orçamento';
                // Limpar formulário após sucesso
                setTimeout(() => {
                    contactForm.reset();
                    formStatus.classList.add('hidden');
                }, 5000);
                break;
            case 'error':
                errorStatus.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Solicitar orçamento';
                break;
        }
    }
    
    // ===== VALIDAÇÃO E ENVIO DO FORMULÁRIO COM EMAILJS =====
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const nome = formData.get('nome').trim();
            const telefone = formData.get('telefone').trim();
            const email = formData.get('email').trim();
            const modalidade = formData.get('modalidade');
            
            // Validação dos campos obrigatórios
            if (!nome || !telefone || !email || !modalidade) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Validação do telefone
            const phoneRegex = /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/;
            if (!phoneRegex.test(telefone.replace(/\D/g, ''))) {
                alert('Por favor, insira um telefone válido.');
                return;
            }
            
            // Validação do email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }
            
            // Mostrar status de carregamento
            showFormStatus('loading');
            
            // Preparar template do EmailJS
            const templateParams = {
                to_name: "Equipe SOBAM",
                from_name: nome,
                from_email: email,
                from_phone: telefone,
                modalidade: modalidade,
                reply_to: email
            };
        
            // CONFIGURAÇÃO ATUAL (SUBSTITUA):
            emailjs.send(
                'service_7lksfa7', // Substitua pelo seu Service ID do EmailJS
                'template_fd93bol', // Substitua pelo seu Template ID do EmailJS
                templateParams
            )
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showFormStatus('success');
                
                // Enviar também para WhatsApp como backup
                const whatsappMessage = `Olá! Gostaria de solicitar um orçamento de plano de saúde.

Nome: ${nome}
Telefone: ${telefone}
E-mail: ${email}
Modalidade: ${modalidade}

Aguardo o contato!`;
                
                const encodedMessage = encodeURIComponent(whatsappMessage);
                const whatsappUrl = `https://api.whatsapp.com/send?phone=5511967660060&text=${encodedMessage}`;
                
                // Abrir WhatsApp em nova aba após 2 segundos
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                }, 2000);
                
            }, function(error) {
                console.log('FAILED...', error);
                showFormStatus('error');
                
                // Fallback para WhatsApp em caso de erro
                const whatsappMessage = `Olá! Gostaria de solicitar um orçamento de plano de saúde.

Nome: ${nome}
Telefone: ${telefone}
E-mail: ${email}
Modalidade: ${modalidade}

Aguardo o contato!`;
                
                const encodedMessage = encodeURIComponent(whatsappMessage);
                const whatsappUrl = `https://api.whatsapp.com/send?phone=5511967660060&text=${encodedMessage}`;
                
                // Abrir WhatsApp imediatamente em caso de erro
                window.open(whatsappUrl, '_blank');
            });
        });
    }
    
    // ===== SMOOTH SCROLL PARA LINKS INTERNOS =====
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            item.classList.toggle('active');
        });
    });
    
    // ===== CARROSSEL DE PARCEIROS =====
    
    // Elementos do carrossel
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryContents = document.querySelectorAll('.category-content');
    
    // Estado do carrossel
    let currentCategory = 'hospitais';
    let currentSlides = {
        hospitais: 0,
        policlinicas: 0,
        laboratorios: 0
    };
    
    // Função para obter número de slides visíveis
    function getSlidesPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }
    
    // Função para trocar categoria - MOSTRAR/ESCONDER CONTAINERS
    function switchCategory(category) {
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
        currentSlides[category] = 0;
        
        // Atualizar posição do carrossel para a categoria atual
        updateCarouselPosition(category);
        
        // Reconfigurar navegação para a nova categoria
        setupCarouselNavigation();
    }
    
    // Função para atualizar posição do carrossel
    function updateCarouselPosition(category) {
        const activeContent = document.querySelector(`.category-content[data-category="${category}"]`);
        if (!activeContent) return;
        
        const track = activeContent.querySelector('.carousel-track');
        const slides = activeContent.querySelectorAll('.carousel-slide');
        
        if (track && slides.length > 0) {
            const slideWidth = slides[0].offsetWidth;
            const translateX = currentSlides[category] * slideWidth;
            
            // Verificar se é desktop (>= 768px)
            const isDesktop = window.innerWidth >= 768;
            
            // Para hospitais no desktop: centralizar as 2 imagens
            if (category === 'hospitais' && isDesktop) {
                track.style.transform = 'translateX(0)';
                track.style.justifyContent = 'center';
            } else {
                // Mobile ou outras categorias: navegação normal
                track.style.transform = `translateX(-${translateX}px)`;
                track.style.justifyContent = 'flex-start';
            }
            
            // Atualizar estado dos botões de navegação
            const prevBtn = activeContent.querySelector('.carousel-btn.prev');
            const nextBtn = activeContent.querySelector('.carousel-btn.next');
            
            if (prevBtn) {
                // Para hospitais no desktop: desabilitar os botões
                if (category === 'hospitais' && window.innerWidth >= 768) {
                    prevBtn.disabled = true;
                    prevBtn.style.opacity = '0.3';
                } else {
                    prevBtn.disabled = currentSlides[category] === 0;
                    prevBtn.style.opacity = currentSlides[category] === 0 ? '0.3' : '1';
                }
            }
            
            if (nextBtn) {
                // Para hospitais no desktop: desabilitar os botões
                if (category === 'hospitais' && window.innerWidth >= 768) {
                    nextBtn.disabled = true;
                    nextBtn.style.opacity = '0.3';
                } else {
                    const maxSlide = slides.length - getSlidesPerView();
                    nextBtn.disabled = currentSlides[category] >= maxSlide;
                    nextBtn.style.opacity = currentSlides[category] >= maxSlide ? '0.3' : '1';
                }
            }
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
    function setupCarouselNavigation() {
        const activeContent = document.querySelector(`.category-content[data-category="${currentCategory}"]`);
        if (!activeContent) return;
        
        const prevBtn = activeContent.querySelector('.carousel-btn.prev');
        const nextBtn = activeContent.querySelector('.carousel-btn.next');
        
        // Remover event listeners antigos para evitar duplicação
        if (prevBtn) {
            prevBtn.replaceWith(prevBtn.cloneNode(true));
        }
        if (nextBtn) {
            nextBtn.replaceWith(nextBtn.cloneNode(true));
        }
        
        // Obter os novos botões após a clonagem
        const newPrevBtn = activeContent.querySelector('.carousel-btn.prev');
        const newNextBtn = activeContent.querySelector('.carousel-btn.next');
        
        if (newPrevBtn) {
            newPrevBtn.addEventListener('click', () => {
                // Para hospitais no desktop: não permitir navegação (imagens fixas)
                if (currentCategory === 'hospitais' && window.innerWidth >= 768) {
                    return;
                }
                
                if (currentSlides[currentCategory] > 0) {
                    currentSlides[currentCategory]--;
                    updateCarouselPosition(currentCategory);
                }
            });
        }
        
        if (newNextBtn) {
            newNextBtn.addEventListener('click', () => {
                // Para hospitais no desktop: não permitir navegação (imagens fixas)
                if (currentCategory === 'hospitais' && window.innerWidth >= 768) {
                    return;
                }
                
                const slides = activeContent.querySelectorAll('.carousel-slide');
                const maxSlide = slides.length - getSlidesPerView();
                
                if (currentSlides[currentCategory] < maxSlide) {
                    currentSlides[currentCategory]++;
                    updateCarouselPosition(currentCategory);
                }
            });
        }
    }
    
    // Configurar navegação inicial
    setupCarouselNavigation();
    
    // Atualizar carrossel no resize da janela
    window.addEventListener('resize', () => {
        updateCarouselPosition(currentCategory);
        
        // Reconfigurar navegação após resize
        setupCarouselNavigation();
    });
    
    // Inicializar posição inicial
    setTimeout(() => {
        updateCarouselPosition(currentCategory);
        
        // Forçar aplicação das regras de hospitais no carregamento inicial
        if (currentCategory === 'hospitais') {
            const activeContent = document.querySelector(`.category-content[data-category="${currentCategory}"]`);
            if (activeContent && window.innerWidth >= 768) {
                const track = activeContent.querySelector('.carousel-track');
                const prevBtn = activeContent.querySelector('.carousel-btn.prev');
                const nextBtn = activeContent.querySelector('.carousel-btn.next');
                
                // Desktop: aplicar regras de hospitais
                if (track) {
                    track.style.transform = 'translateX(0)';
                    track.style.justifyContent = 'center';
                }
                if (prevBtn) {
                    prevBtn.disabled = true;
                    prevBtn.style.opacity = '0.3';
                }
                if (nextBtn) {
                    nextBtn.disabled = true;
                    nextBtn.style.opacity = '0.3';
                }
            }
        }
    }, 100);
});

// ===== FUNÇÕES UTILITÁRIAS =====

// Função para formatar preços
function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

// Função para validar CPF
function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit1 = remainder < 2 ? 0 : remainder;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    let digit2 = remainder < 2 ? 0 : remainder;
    
    return parseInt(cpf.charAt(9)) === digit1 && parseInt(cpf.charAt(10)) === digit2;
}

// Função para copiar texto para clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            // Texto copiado com sucesso
        });
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
} 