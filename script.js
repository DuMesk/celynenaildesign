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

    // =============================================
    // SISTEMA DE AGENDAMENTO - VERSÃO CORRIGIDA
    // =============================================
    const initBookingSystem = () => {
        // URLs da API
        const URL_DISPONIBILIDADE = "https://script.google.com/macros/s/AKfycbwJFkaEIvPNjkXfQ9_9J0CqKCY-9GcaQePzA9nq4uL0jaIji-UBu3ekwTB43XOYJxF2Uw/exec";
        const URL_AGENDAMENTO = "https://script.google.com/macros/s/AKfycbwJFkaEIvPNjkXfQ9_9J0CqKCY-9GcaQePzA9nq4uL0jaIji-UBu3ekwTB43XOYJxF2Uw/exec";
        const TELEFONE_WHATSAPP = "5561985879423";

        // Elementos do formulário
        const formContato = document.getElementById("formContato");
        const dataInput = document.getElementById("data");
        const horariosDiv = document.getElementById("horarios");
        const dataHoraInput = document.getElementById("dataHora");
        const telefoneInput = document.getElementById("telefone");

        if (!formContato || !dataInput || !horariosDiv || !dataHoraInput || !telefoneInput) return;

        // Máscara para telefone
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) value = `(${value.substring(0,2)}) ${value.substring(2)}`;
            if (value.length > 10) value = `${value.substring(0,10)}-${value.substring(10,14)}`;
            e.target.value = value;
        });

        // Configuração do Flatpickr
        const flatpickrInstance = flatpickr(dataInput, {
            dateFormat: "d/m/Y",
            minDate: "today",
            disableMobile: true,
            locale: "pt",
            onChange: function(selectedDates, dateStr) {
                if (!selectedDates[0]) return;
                const dataISO = selectedDates[0].toISOString().split('T')[0];
                carregarHorariosDisponiveis(dataISO);
            }
        });

        // Função para filtrar horários por data selecionada
        const filtrarHorariosPorData = (horarios, dataSelecionada) => {
            return horarios.filter(horarioISO => {
                const horarioDate = new Date(horarioISO);
                const horarioDataStr = horarioDate.toISOString().split('T')[0];
                return horarioDataStr === dataSelecionada;
            });
        };

        // Função para formatar hora (HH:MM)
        const formatarHora = (isoString) => {
            const date = new Date(isoString);
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        };

        // Carrega horários disponíveis
        const carregarHorariosDisponiveis = async (dataSelecionada) => {
            horariosDiv.innerHTML = '<div class="horario-placeholder">Carregando horários...</div>';
            dataHoraInput.value = '';

            try {
                // Busca TODOS os horários disponíveis da API
                const response = await fetch(URL_DISPONIBILIDADE);
                if (!response.ok) throw new Error('Erro na resposta da API');
                
                const todosHorarios = await response.json();
                
                // Filtra apenas os horários da data selecionada
                const horariosDaData = filtrarHorariosPorData(todosHorarios, dataSelecionada);
                
                horariosDiv.innerHTML = '';
                
                if (horariosDaData.length === 0) {
                    horariosDiv.innerHTML = '<div class="horario-placeholder">Nenhum horário disponível para esta data</div>';
                    return;
                }
                
                // Ordena os horários e cria os botões
                horariosDaData
                    .sort((a, b) => new Date(a) - new Date(b)) // Ordena por horário
                    .forEach(horarioISO => {
                        const botao = document.createElement("button");
                        botao.type = "button";
                        botao.className = "botao-horario";
                        botao.textContent = formatarHora(horarioISO);
                        
                        botao.addEventListener("click", () => {
                            document.querySelectorAll(".botao-horario").forEach(btn => {
                                btn.classList.remove("selecionado");
                            });
                            botao.classList.add("selecionado");
                            dataHoraInput.value = horarioISO;
                        });
                        
                        horariosDiv.appendChild(botao);
                    });
                    
            } catch (error) {
                console.error("Erro ao carregar horários:", error);
                horariosDiv.innerHTML = '<div class="horario-placeholder">Erro ao carregar horários</div>';
                
                Swal.fire({
                    title: 'Erro',
                    text: 'Não foi possível carregar os horários. Por favor, tente novamente.',
                    icon: 'error',
                    confirmButtonColor: '#D4AFB9'
                });
            }
        };

        // Envio do formulário
formContato.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    // Validação
    if (!dataHoraInput.value) {
        Swal.fire({
            title: 'Atenção!',
            text: 'Por favor, selecione um horário disponível.',
            icon: 'warning',
            confirmButtonColor: '#D4AFB9'
        });
        return;
    }
    
    const formData = {
        nome: document.getElementById("nome").value.trim(),
        telefone: telefoneInput.value.trim(),
        servico: document.getElementById("servico").value,
        mensagem: document.getElementById("mensagem").value.trim(),
        dataHora: dataHoraInput.value
    };
    
    const botaoEnviar = formContato.querySelector('button[type="submit"]');
    const textoOriginal = botaoEnviar.innerHTML;
    
    try {
        // Mostra loading no botão
        botaoEnviar.disabled = true;
        botaoEnviar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        // Envia para o Google Sheets - MODIFICAÇÃO IMPORTANTE AQUI
        const response = await fetch(URL_AGENDAMENTO, {
            method: "POST",
            mode: 'no-cors', // Adicionado para evitar problemas de CORS
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });
        
        
        console.log("Agendamento enviado:", formData); // Para debug
        
        // Prepara mensagem para WhatsApp
        const dataObj = new Date(formData.dataHora);
        const dataFormatada = dataObj.toLocaleDateString('pt-BR');
        const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        const mensagemWhatsApp = `*Agendamento via site*\n\n*Nome:* ${formData.nome}\n*Telefone:* ${formData.telefone}\n*Serviço:* ${formData.servico}\n*Data:* ${dataFormatada}\n*Horário:* ${horaFormatada}\n*Mensagem:* ${formData.mensagem || 'Nenhuma mensagem adicional'}`;
        
        const linkWhatsApp = `https://wa.me/${TELEFONE_WHATSAPP}?text=${encodeURIComponent(mensagemWhatsApp)}`;
        
        // Mostra confirmação
        await Swal.fire({
            title: 'Agendamento confirmado!',
            html: `Seu horário foi reservado para <strong>${dataFormatada} às ${horaFormatada}</strong>. Você será redirecionado para o WhatsApp.`,
            icon: 'success',
            confirmButtonColor: '#D4AFB9'
        });
        
        // Redireciona para WhatsApp
        window.open(linkWhatsApp, "_blank");
        
        // Reseta o formulário
        formContato.reset();
        horariosDiv.innerHTML = '';
        dataHoraInput.value = '';
        flatpickrInstance.clear();
        
    } catch (error) {
        console.error("Erro ao enviar agendamento:", error);
        Swal.fire({
            title: 'Erro!',
            text: 'Ocorreu um erro ao enviar seu agendamento. Por favor, tente novamente ou entre em contato diretamente pelo WhatsApp.',
            icon: 'error',
            confirmButtonColor: '#D4AFB9'
        });
    } finally {
        // Restaura o botão
        botaoEnviar.disabled = false;
        botaoEnviar.innerHTML = textoOriginal;
    }
});
    };

    // =============================================
    // INICIALIZAÇÃO DE TODOS OS COMPONENTES
    // =============================================
    initTestimonialSlider();
    initScrollAnimations();
    initGalleryLightbox();
    initBookingSystem();
});
