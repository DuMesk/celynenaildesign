/**
 * Celyne Nail Design - Script Principal
 * 
 * Este script contém toda a funcionalidade do site:
 * - Menu mobile
 * - Scroll suave
 * - Slider de depoimentos
 * - Animações de scroll
 * - Galeria lightbox
 * - Sistema de agendamento completo
 */

document.addEventListener('DOMContentLoaded', function() {


    // =============================================
    // MENU MOBILE TOGGLE
    // =============================================


    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            const nav = document.getElementById('mainNav');
            const icon = this.querySelector('i');
            
            nav.classList.toggle('active');
            
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

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
                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });

                // Fechar menu mobile se estiver aberto
                const nav = document.getElementById('mainNav');
                if (nav?.classList.contains('active')) {
                    nav.classList.remove('active');
                    const icon = document.querySelector('#mobileMenu i');
                    if (icon) {
                        icon.classList.replace('fa-times', 'fa-bars');
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
            quote: "Nunca encontrei alguém tão detalhista como a Celyne. Os designs são únicos e ela tem uma paciência incrível para fazer exatamente o que eu quero.",
            name: "Mariana Silva",
            role: "Cliente",
            avatar: "https://randomuser.me/api/portraits/women/32.jpg"
        },
        {
            quote: "A Celyne é incrível! Minhas unhas ficam perfeitas e duram semanas. O atendimento é impecável e o ambiente super higiênico.",
            name: "Ana Carolina",
            role: "Cliente",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            quote: "Depois que conheci o trabalho da Celyne, nunca mais fui em outra profissional. Minhas unhas estão sempre impecáveis e recebo muitos elogios!",
            name: "Juliana Santos",
            role: "Cliente",
            avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }
    ];

    const initTestimonialSlider = () => {
        const testimonialContainer = document.querySelector('.testimonial-slider');
        if (!testimonialContainer) return;

        let currentTestimonial = 0;
        let testimonialInterval;
        
        const showTestimonial = (index) => {
            const testimonial = testimonials[index];
            testimonialContainer.innerHTML = `
                <div class="testimonial-card fade-in">
                    <p>"${testimonial.quote}"</p>
                    <div class="client-info">
                        <img src="${testimonial.avatar}" alt="${testimonial.name}" class="client-avatar" loading="lazy">
                        <div>
                            <div class="client-name">${testimonial.name}</div>
                            <div class="client-role">${testimonial.role}</div>
                        </div>
                    </div>
                </div>
            `;
        };

        const startSlider = () => {
            showTestimonial(currentTestimonial);
            testimonialInterval = setInterval(() => {
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                showTestimonial(currentTestimonial);
            }, 5000);
        };

        // Inicia o slider
        startSlider();

        // Pausa ao passar o mouse
        testimonialContainer.addEventListener('mouseenter', () => {
            clearInterval(testimonialInterval);
        });

        // Retoma quando o mouse sai
        testimonialContainer.addEventListener('mouseleave', startSlider);
    };

    // =============================================
    // ANIMAÇÃO DE SCROLL
    // =============================================

    const initScrollAnimations = () => {
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
        animateOnScroll(); // Executa uma vez ao carregar
    };

    // =============================================
    // GALERIA LIGHTBOX
    // =============================================
    
    const initGalleryLightbox = () => {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img')?.src;
                if (!imgSrc) return;
                
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox-content">
                        <img src="${imgSrc}" alt="Imagem ampliada" loading="lazy">
                        <button class="lightbox-close">&times;</button>
                    </div>
                `;
                
                document.body.appendChild(lightbox);
                document.body.style.overflow = 'hidden';
                
                lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
                    document.body.removeChild(lightbox);
                    document.body.style.overflow = '';
                });
            });
        });
    };

// Sistema de Agendamento

const formulario = document.getElementById('formulario');
const divDados = document.getElementById('dados');
const TELEFONE_WHATSAPP = "5561983740873";

// URL do seu Web App
const urlWebApp = 'https://script.google.com/macros/s/AKfycbxZMSj_JPcpS_HJrKyiLta7yE8aLCaffqcljA42J1Kp9gIZ5JHpu_HOOwBRLQIzfW4rhg/exec';

// Inicializa o calendário com Flatpickr
flatpickr("#dataEscolhida", {
    dateFormat: "d/m/Y",  // VISUAL para o cliente
    altInput: true,       // campo bonito
    altFormat: "d/m/Y",   // o que aparece
    locale: "pt",
    onChange: function(selectedDates, dateStr, instance) {
        // Salva internamente no formato ISO (usado para buscas e backend)
        const valorDataISO = instance.formatDate(selectedDates[0], "Y-m-d");
        formulario.dataEscolhida.value = valorDataISO; // isso será enviado para o backend
        mostrarHorarios(valorDataISO); // usa ISO para buscar horários bloqueados
    }
});


// Função para mostrar horários disponíveis
function mostrarHorarios(dataEscolhida) {
    const horariosDiv = document.getElementById("horarios");
    horariosDiv.innerHTML = "<p>Carregando...</p>";

    const horariosPossiveis = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

    const script = document.createElement("script");
    script.src = `${urlWebApp}?acao=listarHorarios&data=${dataEscolhida}&callback=preencherHorarios`;
    document.body.appendChild(script);

    window.preencherHorarios = (dados) => {
        horariosDiv.innerHTML = '';

        const ocupados = dados.horariosOcupados || [];

        const horariosDisponiveis = horariosPossiveis.filter(h => !ocupados.includes(h));

        if (horariosDisponiveis.length === 0) {
            horariosDiv.innerHTML = "<p><em>Todos os horários estão ocupados nesse dia.</em></p>";
            return;
        }

        horariosDisponiveis.forEach(horario => {
            const botao = document.createElement("button");
            botao.textContent = horario;
            botao.type = "button";
            botao.classList.add("botao-horario");

            botao.onclick = function () {
                document.querySelectorAll('.botao-horario').forEach(btn => btn.classList.remove('selecionado'));
                botao.classList.add('selecionado');
                document.getElementById("horarioEscolhido").value = horario;
            };

            horariosDiv.appendChild(botao);
        });
    };
}

// Carregar as mensagens já recebidas
function carregarDados() {
    const script = document.createElement("script");
    script.src = `https://script.google.com/macros/s/AKfycbxZMSj_JPcpS_HJrKyiLta7yE8aLCaffqcljA42J1Kp9gIZ5JHpu_HOOwBRLQIzfW4rhg/exec?acao=listarTodos&callback=preencherDados`;
    document.body.appendChild(script);

    window.preencherDados = (dados) => {
        const divDados = document.getElementById("dados");
        divDados.innerHTML = "";

        dados.forEach(item => {
            divDados.innerHTML += `<p>
                Nome: <strong>${item.nome}</strong><br> 
                Telefone: ${item.telefone}<br> 
                Serviço: <strong>${item.servico}</strong><br>
                Cadastrado em: ${new Date(item.timestamp).toLocaleString('pt-BR')}<br> 
                Mensagem: ${item.mensagem}<br>
                Data escolhida: <strong>${formatarData(item.dataEscolhida)}</strong><br>
                Hora escolhida: <strong>${formatarHorario(item.horarioEscolhido)}</strong>
            </p><hr>`;
        });
    };
}

// Quando enviar o formulário
formulario.addEventListener("submit", function(e) {
    e.preventDefault();

    if (!formulario.horarioEscolhido.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Selecione um horário!',
            text: 'Por favor, escolha um horário antes de confirmar o agendamento.'
        });
        return;
    }

    const dados = {
        acao: 'salvar',
        nome: formulario.nome.value,
        telefone: formulario.telefone.value,
        mensagem: formulario.mensagem.value || "Nenhuma observação.",
        dataEscolhida: formulario.dataEscolhida.value,
        horarioEscolhido: formulario.horarioEscolhido.value,
        servico: formulario.servico.value
    };

    // Exibir resumo de confirmação
    Swal.fire({
        title: 'Confirmar Agendamento?',
        html: `
            <p><strong>Nome:</strong> ${dados.nome}</p>
            <p><strong>Telefone:</strong> ${dados.telefone}</p>
            <p><strong>Serviço:</strong> ${dados.servico}</p>
            <p><strong>Data:</strong> ${formatarData(dados.dataEscolhida)}</p>
            <p><strong>Horário:</strong> ${formatarHorario(dados.horarioEscolhido)}</p>
            <p><strong>Observações:</strong> ${dados.mensagem}</p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Corrigir Dados',
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33'
    }).then(result => {
        if (result.isConfirmed) {
            // Envia os dados se a pessoa confirmou
            function enviarAgendamento() {
    if (!formulario.horarioEscolhido.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Selecione um horário!',
            text: 'Por favor, escolha um horário antes de confirmar o agendamento.'
        });
        return;
    }

    const dados = {
        nome: formulario.nome.value,
        telefone: formulario.telefone.value,
        mensagem: formulario.mensagem.value || "Nenhuma observação.",
        dataEscolhida: formulario.dataEscolhida.value,
        horarioEscolhido: formulario.horarioEscolhido.value,
        servico: formulario.servico.value
    };

    const url = `${urlWebApp}?acao=salvar&callback=retorno&` +
        `nome=${encodeURIComponent(dados.nome)}` +
        `&telefone=${encodeURIComponent(dados.telefone)}` +
        `&mensagem=${encodeURIComponent(dados.mensagem)}` +
        `&dataEscolhida=${encodeURIComponent(dados.dataEscolhida)}` +
        `&horarioEscolhido=${encodeURIComponent(dados.horarioEscolhido)}` +
        `&servico=${encodeURIComponent(dados.servico)}`;

    const script = document.createElement("script");
    script.src = url;
    document.body.appendChild(script);

    window.retorno = function(response) {
        if (response.status === "sucesso") {
            Swal.fire({
                title: 'Agendamento Confirmado!',
                text: 'Você será redirecionado para o WhatsApp para finalização.',
                icon: 'success',
                confirmButtonText: 'Ir para o WhatsApp',
                confirmButtonColor: '#25D366'
            }).then(() => {
                const mensagem = `🌸 *Celyne Nail Design* 🌸\nhttps://celyne.com.br\n\n` +
                    `Olá! Gostaria de confirmar meu agendamento:\n\n` +
                    `• Nome: ${dados.nome}\n` +
                    `• WhatsApp: ${dados.telefone}\n` +
                    `• Serviço: ${dados.servico}\n` +
                    `• Data: ${formatarData(dados.dataEscolhida)}\n` +
                    `• Horário: ${formatarHorario(dados.horarioEscolhido)}\n` +
                    `• Observações: ${dados.mensagem}\n\n` +
                    `Mensagem enviada automaticamente pelo site.`;

                const linkWhatsApp = `https://wa.me/${TELEFONE_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
                window.open(linkWhatsApp, "_blank");

                formulario.reset();
                document.getElementById("horarios").innerHTML = '';
            });
        } else {
            Swal.fire({
                title: 'Erro!',
                text: response.mensagem || 'Houve um problema ao enviar seu agendamento. Tente novamente.',
                icon: 'error'
            });
        }
    };
}

function formatarData(dataISO) {
    if (!dataISO) return '';
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
}

function formatarHorario(horario) {
    if (!horario) return '';

    // Se vier como tipo ISO (ex: "1899-12-30T10:00:00.000Z"), extrai a hora da string
    if (typeof horario === 'string' && horario.includes('T')) {
        const partes = horario.split('T')[1].split(':');
        const hora = partes[0];
        const minuto = partes[1];
        return `${hora}:${minuto}h`;
    }

    // Se vier como "10:00", apenas adiciona 'h'
    if (typeof horario === 'string' && horario.length >= 5) {
        return horario.slice(0, 5) + 'h';
    }

    return horario;
}

document.getElementById('telefone').addEventListener('input', function(e) {
    let valor = e.target.value.replace(/\D/g, ''); // remove tudo que não for número

    if (valor.length > 11) valor = valor.slice(0, 11); // limita a 11 dígitos

    let formatado = '';
    if (valor.length > 0) formatado = '(' + valor.slice(0, 2);
    if (valor.length >= 3) formatado += ') ' + valor.slice(2, 7);
    if (valor.length >= 8) formatado += '-' + valor.slice(7);

    e.target.value = formatado;
});

    // =============================================
    // INICIALIZAÇÃO DE TODOS OS COMPONENTES
    // =============================================
    initTestimonialSlider();
    initScrollAnimations();
    initGalleryLightbox();
});
