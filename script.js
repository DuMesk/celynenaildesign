// =============================================
// MENU MOBILE TOGGLE
// =============================================
document.getElementById('mobileMenu').addEventListener('click', function() {
    const nav = document.getElementById('mainNav');
    const icon = this.querySelector('i');
    
    nav.classList.toggle('active');
    
    if (icon) {
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

// =============================================
// SCROLL SUAVE
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            // Fechar menu mobile se estiver aberto
            const nav = document.getElementById('mainNav');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                const icon = document.querySelector('#mobileMenu i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });
});

// =============================================
// SLIDER DE DEPOIMENTOS
// =============================================
const testimonials = [
    {
        quote: "A Celyne é incrível! Minhas unhas ficam perfeitas e duram semanas. O atendimento é impecável e o ambiente super higiênico.",
        name: "Ana Carolina",
        role: "Cliente há 2 anos",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        quote: "Nunca encontrei alguém tão detalhista como a Celyne. Os designs são únicos e ela tem uma paciência incrível para fazer exatamente o que eu quero.",
        name: "Mariana Silva",
        role: "Cliente VIP",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
        quote: "Depois que conheci o trabalho da Celyne, nunca mais fui em outra profissional. Minhas unhas estão sempre impecáveis e recebo muitos elogios!",
        name: "Juliana Santos",
        role: "Cliente Mensal",
        avatar: "https://randomuser.me/api/portraits/women/28.jpg"
    }
];

let currentTestimonial = 0;
const testimonialContainer = document.querySelector('.testimonial-slider');

function showTestimonial(index) {
    if (!testimonialContainer) return;
    
    const testimonial = testimonials[index];
    testimonialContainer.innerHTML = `
        <div class="testimonial-card fade-in">
            <p>"${testimonial.quote}"</p>
            <div class="client-info">
                <img src="${testimonial.avatar}" alt="${testimonial.name}" class="client-avatar">
                <div>
                    <div class="client-name">${testimonial.name}</div>
                    <div class="client-role">${testimonial.role}</div>
                </div>
            </div>
        </div>
    `;
}

// Iniciar slider
if (testimonialContainer) {
    showTestimonial(currentTestimonial);
    
    // Trocar depoimento automaticamente a cada 5 segundos
    const testimonialInterval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

// =============================================
// FORMULÁRIO DE CONTATO
// =============================================
const formContato = document.getElementById('formContato');

if (formContato) {
    formContato.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        try {
            // 1. Preparar dados do formulário
            const formData = {
                nome: this.name.value.trim(),
                email: this.email.value.trim(),
                telefone: this.phone.value.trim() || 'Não informado',
                servico: this.service.value,
                mensagem: this.message.value.trim() || 'Nenhuma mensagem adicional'
            };

            // 2. Validação básica
            if (!formData.nome || !formData.telefone) {
                throw new Error("Por favor, preencha pelo menos seu nome e telefone!");
            }

            // 3. Desabilitar botão e mudar texto
            submitButton.disabled = true;
            submitButton.textContent = "Enviando...";

            // 4. Enviar mensagem pelo WhatsApp como fallback
            const whatsappNumber = "5561985879423";
            const whatsappMessage = `Olá Celyne! Gostaria de agendar um horário.\n\n*Nome:* ${formData.nome}\n*Telefone:* ${formData.telefone}\n*Serviço:* ${formData.servico}\n\n${formData.mensagem}`;
            
            // URL encode a mensagem
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // 5. Redirecionar para WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // 6. Resetar formulário
            this.reset();
            
            // 7. Feedback visual
            submitButton.textContent = "✓ Enviado!";
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);

        } catch (error) {
            console.error("Erro no envio:", error);
            alert(`⚠️ ${error.message}`);
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

// =============================================
// ANIMAÇÃO DE SCROLL
// =============================================
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.benefit-card, .service-card, .gallery-item, .section-title');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.classList.add('fade-in');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// =============================================
// GALERIA LIGHTBOX (OPCIONAL)
// =============================================
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        // Implementação básica de lightbox
        const imgSrc = this.querySelector('img').src;
        const lightbox = document.createElement('div');
        lightbox.style.position = 'fixed';
        lightbox.style.top = '0';
        lightbox.style.left = '0';
        lightbox.style.width = '100%';
        lightbox.style.height = '100%';
        lightbox.style.backgroundColor = 'rgba(0,0,0,0.9)';
        lightbox.style.display = 'flex';
        lightbox.style.justifyContent = 'center';
        lightbox.style.alignItems = 'center';
        lightbox.style.zIndex = '10000';
        lightbox.style.cursor = 'zoom-out';
        
        const img = document.createElement('img');
        img.src = imgSrc;
        img.style.maxHeight = '90vh';
        img.style.maxWidth = '90vw';
        img.style.objectFit = 'contain';
        
        lightbox.appendChild(img);
        document.body.appendChild(lightbox);
        
        lightbox.addEventListener('click', () => {
            document.body.removeChild(lightbox);
        });
    });
});

// =============================================
// EFEITO DE MÁQUINA DE ESCREVER (OPCIONAL)
// =============================================
const typeWriter = (element, text, speed = 50) => {
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
};

// Se quiser usar em algum título:
// const heroTitle = document.querySelector('.hero h1');
// if (heroTitle) {
//     heroTitle.innerHTML = '';
//     typeWriter(heroTitle, heroTitle.dataset.text || 'Design de Unhas que Realça Sua Beleza');
// }