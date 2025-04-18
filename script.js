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
        role: "Cliente",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        quote: "Nunca encontrei alguém tão detalhista como a Celyne. Os designs são únicos e ela tem uma paciência incrível para fazer exatamente o que eu quero.",
        name: "Mariana Silva",
        role: "Cliente",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
        quote: "Depois que conheci o trabalho da Celyne, nunca mais fui em outra profissional. Minhas unhas estão sempre impecáveis e recebo muitos elogios!",
        name: "Juliana Santos",
        role: "Cliente",
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

// =============================================
// CADASTRO NO WHATSAPP E GOOGLE SHEETS
// =============================================

document.getElementById("formContato").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const servico = document.getElementById("servico").value;
  const mensagem = document.getElementById("mensagem").value;
  const botao = document.querySelector(".cta-button");
  const dataHora = document.getElementById("dataHora").value;

  const dados = {
    nome,
    telefone,
    servico,
    mensagem,
    dataHora
  };

  // Envia para Google Sheets (usando no-cors se necessário)
  fetch("https://script.google.com/macros/s/AKfycbwYKF2QaqIXRD7zmjfnZFJzWlbzV2xUUJdq-vH83RMitdEg2BqAK_Y4BEvbf_59IeEqPg/exec", {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify(dados),
    headers: {
      "Content-Type": "application/json"
    }
  });

  // Prepara o link do WhatsApp
  const mensagemWhatsApp = `*Agendamento via site*\n\n*Nome:* ${nome}\n*Telefone:* ${telefone}\n*Serviço:* ${servico}\n*Data/Hora:* ${dataHora}\n*Mensagem:* ${mensagem}`;

  const telefoneDestino = "5561985879423"; // Altere para o número correto
  const linkWhatsApp = `https://wa.me/${telefoneDestino}?text=${encodeURIComponent(mensagemWhatsApp)}`;

  // 1. Exibir alerta de sucesso
  Swal.fire({
    title: 'Agendamento enviado!',
    text: 'Você será redirecionado para o WhatsApp.',
    icon: 'success',
    confirmButtonColor: '#D4AFB9'
  }).then(() => {
    // 2. Redireciona pro WhatsApp
    window.open(linkWhatsApp, "_blank");

    // 3. Desabilita o botão e muda o texto
    botao.disabled = true;
    botao.style.backgroundColor = '#ccc';
    botao.innerText = 'Enviado';

    // 4. Limpa o formulário
    document.getElementById("formContato").reset();

    // (Opcional) Reativa botão depois de alguns segundos:
    setTimeout(() => {
      botao.disabled = false;
      botao.style.backgroundColor = ''; // volta ao normal
      botao.innerText = 'Enviar Agendamento';
    }, 5000); // reativa em 5 segundos
  });
});
