// Estado da aplicação
let currentStep = 1;
let cart = JSON.parse(localStorage.getItem('familia_cart')) || [];
let selectedZone = localStorage.getItem('familia_zone') || 'sul';
let deliveryFee = 0;
let customerData = JSON.parse(localStorage.getItem('familia_customer')) || {
    name: '',
    phone: '',
    address: '',
    complement: '',
    payment: 'PIX'
};

// Dados dos produtos
const products = {
    1: { name: "Açúcar Mascavo Unão 1kg", price: 22.49, category: "alimentos" },
    2: { name: "Arroz Camil Tipo 1 1kg", price: 3.85, category: "alimentos" },
    3: { name: "Feijão Carioca Brasileirinho 1kg", price: 4.50, category: "alimentos" },
    4: { name: "Farinha de Mandioca Soberano 1kg", price: 4.40, category: "alimentos" },
    5: { name: "Atum Gomes Ralado Natural 170g", price: 5.90, category: "carnes" },
    6: { name: "Carne Mista Desfiar Target 320g", price: 8.68, category: "carnes" },
    7: { name: "Almôndegas ao Molho Target 420g", price: 8.70, category: "carnes" },
    8: { name: "Água Sanitária OBOA 2L", price: 5.99, category: "limpeza" },
    9: { name: "Amaciante Ypê Aconchego 2L", price: 7.70, category: "limpeza" },
    10: { name: "Biscoito Cream Cracker Marilan 350g", price: 4.99, category: "biscoitos" },
    11: { name: "Biscoito Recheado Bauducco 140g", price: 1.70, category: "biscoitos" }
};

// Taxas de entrega por zona
const zoneFees = {
    'sul': 0,
    'centro': 5,
    'leste': 8,
    'oeste': 8,
    'norte': 10
};

// Elementos do carrinho flutuante
const floatingCart = document.getElementById('floating-cart');
const openCartBtn = document.getElementById('open-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartOverlay = document.getElementById('cart-overlay');
const floatingCartBody = document.getElementById('floating-cart-body');
const floatingCartTotal = document.getElementById('floating-cart-total');
const cartCountBadge = document.getElementById('cart-count-badge');
const clearCartBtn = document.getElementById('clear-cart-btn');
const backToTopBtn = document.getElementById('back-to-top');

// Inicializar a página
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    updateCartDisplay();
    setupEventListeners();
    loadSelectedZone();
    loadCustomerData();
    setupFilters();
    updateProgressIndicator();
    updateStepButtons();
    updateFloatingCart();
    setupAccessibility();
    setupBackToTop();
}

// Configurar event listeners
function setupEventListeners() {
    // Botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            addToCart(id, name, price, this);
        });
        
        // Suporte para teclado
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const id = this.getAttribute('data-id');
                const name = this.getAttribute('data-name');
                const price = parseFloat(this.getAttribute('data-price'));
                
                addToCart(id, name, price, this);
            }
        });
    });
    
    // Controles de quantidade
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            increaseQuantity(id);
        });
    });
    
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            decreaseQuantity(id);
        });
    });
    
    // Seleção de zona
    document.querySelectorAll('.zone-option').forEach(option => {
        option.addEventListener('click', function() {
            selectZone(this);
        });
        
        // Suporte para teclado
        option.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectZone(this);
            }
        });
    });
    
    // Navegação entre passos
    document.getElementById('next-to-step2').addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Adicione produtos ao carrinho antes de continuar.', true);
            return;
        }
        goToStep(2);
    });
    
    document.getElementById('next-to-step3').addEventListener('click', function() {
        if (!validateStep2()) return;
        goToStep(3);
    });
    
    document.getElementById('finalize-order').addEventListener('click', finalizeOrder);
    
    // Inputs de dados do cliente
    document.getElementById('customer-name').addEventListener('input', saveCustomerData);
    document.getElementById('customer-phone').addEventListener('input', saveCustomerData);
    document.getElementById('customer-address').addEventListener('input', saveCustomerData);
    document.getElementById('customer-complement').addEventListener('input', saveCustomerData);
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', saveCustomerData);
    });
    
    // Busca de produtos
    document.getElementById('product-search').addEventListener('input', filterProducts);
    
    // Botão do WhatsApp no header
    document.getElementById('whatsapp-btn-header').addEventListener('click', function(e) {
        e.preventDefault();
        if (cart.length === 0) {
            goToStep(1);
        } else if (!customerData.name || !customerData.phone || !customerData.address) {
            goToStep(2);
        } else {
            goToStep(3);
        }
    });
    
    // Botões do carrinho flutuante
    openCartBtn.addEventListener('click', openFloatingCart);
    openCartBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFloatingCart();
        }
    });
    
    closeCartBtn.addEventListener('click', closeFloatingCart);
    cartOverlay.addEventListener('click', closeFloatingCart);
    clearCartBtn.addEventListener('click', clearCart);
    
    // Fechar carrinho com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && floatingCart.classList.contains('open')) {
            closeFloatingCart();
        }
    });
}

// Configurar acessibilidade
function setupAccessibility() {
    // Adicionar atributos ARIA dinamicamente
    document.querySelectorAll('.step').forEach((step, index) => {
        step.setAttribute('aria-labelledby', `step${index + 1}-tab`);
    });
    
    // Foco no carrinho quando aberto
    floatingCart.addEventListener('transitionend', function() {
        if (floatingCart.classList.contains('open')) {
            closeCartBtn.focus();
        }
    });
}

// Configurar botão voltar ao topo
function setupBackToTop() {
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    backToTopBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// Configurar filtros de categoria
function setupFilters() {
    document.querySelectorAll('.category-filter').forEach(filter => {
        filter.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Atualizar filtro ativo
            document.querySelectorAll('.category-filter').forEach(f => {
                f.classList.remove('active');
            });
            this.classList.add('active');
            
            // Mostrar/esconder categorias
            document.querySelectorAll('.category').forEach(categoryElement => {
                if (category === 'all' || categoryElement.getAttribute('data-category') === category) {
                    categoryElement.classList.remove('hidden');
                } else {
                    categoryElement.classList.add('hidden');
                }
            });
        });
    });
}

// Filtrar produtos
function filterProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    
    document.querySelectorAll('.product-item').forEach(item => {
        const productName = item.querySelector('.product-info h4').textContent.toLowerCase();
        const productDescription = item.querySelector('.product-description') ? 
            item.querySelector('.product-description').textContent.toLowerCase() : '';
        
        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Adicionar produto ao carrinho
function addToCart(id, name, price, button) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    // Feedback visual
    button.classList.add('added');
    button.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
    
    setTimeout(() => {
        button.classList.remove('added');
        button.innerHTML = '<i class="fas fa-cart-plus"></i> Adicionar';
    }, 1000);
    
    saveCart();
    updateCartDisplay();
    updateProductQuantities();
    updateStepButtons();
    updateFloatingCart();
    
    showNotification(`${name} adicionado ao carrinho!`);
    
    // Feedback para leitores de tela
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    announceToScreenReader(`${name} adicionado ao carrinho. Agora você tem ${totalItems} ${totalItems === 1 ? 'item' : 'itens'} no carrinho.`);
}

// Aumentar quantidade
function increaseQuantity(id) {
    const quantityElement = document.querySelector(`.quantity[data-id="${id}"]`);
    let quantity = parseInt(quantityElement.textContent);
    quantityElement.textContent = quantity + 1;
    
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const product = products[id];
        if (product) {
            cart.push({
                id: id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
    }
    
    saveCart();
    updateCartDisplay();
    updateStepButtons();
    updateFloatingCart();
    
    // Feedback para leitores de tela
    const product = products[id];
    if (product) {
        announceToScreenReader(`Quantidade de ${product.name} aumentada para ${quantity + 1}`);
    }
}

// Diminuir quantidade
function decreaseQuantity(id) {
    const quantityElement = document.querySelector(`.quantity[data-id="${id}"]`);
    let quantity = parseInt(quantityElement.textContent);
    
    if (quantity > 0) {
        quantityElement.textContent = quantity - 1;
        
        const existingItemIndex = cart.findIndex(item => item.id === id);
        if (existingItemIndex !== -1) {
            if (cart[existingItemIndex].quantity > 1) {
                cart[existingItemIndex].quantity -= 1;
            } else {
                const removedItem = cart[existingItemIndex];
                cart.splice(existingItemIndex, 1);
                
                // Feedback para leitores de tela
                announceToScreenReader(`${removedItem.name} removido do carrinho`);
            }
        }
        
        saveCart();
        updateCartDisplay();
        updateStepButtons();
        updateFloatingCart();
    }
}

// Limpar carrinho
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        cart = [];
        saveCart();
        updateCartDisplay();
        updateProductQuantities();
        updateStepButtons();
        updateFloatingCart();
        showNotification('Carrinho limpo com sucesso!');
        announceToScreenReader('Carrinho limpo. Todos os itens foram removidos.');
    }
}

// Atualizar quantidades nos controles
function updateProductQuantities() {
    document.querySelectorAll('.quantity').forEach(element => {
        const id = element.getAttribute('data-id');
        const cartItem = cart.find(item => item.id === id);
        element.textContent = cartItem ? cartItem.quantity : 0;
    });
}

// Atualizar display do carrinho
function updateCartDisplay() {
    // Calcular subtotal
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    // Calcular taxa de entrega
    deliveryFee = zoneFees[selectedZone] || 0;
    
    // Calcular total
    const total = subtotal + deliveryFee;
    
    // Atualizar contador do carrinho (passo 1)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count-step1').textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'} no carrinho`;
    document.getElementById('cart-total-step1').textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    
    // Atualizar badge do carrinho
    cartCountBadge.textContent = totalItems;
    cartCountBadge.setAttribute('aria-label', `${totalItems} itens no carrinho`);
}

// Selecionar zona
function selectZone(zoneElement) {
    // Remover seleção de todas as zonas
    document.querySelectorAll('.zone-option').forEach(option => {
        option.classList.remove('selected');
        option.setAttribute('aria-checked', 'false');
    });
    
    // Adicionar seleção à zona clicada
    zoneElement.classList.add('selected');
    zoneElement.setAttribute('aria-checked', 'true');
    
    // Atualizar zona selecionada e taxa
    selectedZone = zoneElement.getAttribute('data-zone');
    deliveryFee = parseFloat(zoneElement.getAttribute('data-fee'));
    
    // Salvar no localStorage
    localStorage.setItem('familia_zone', selectedZone);
    
    // Atualizar display do carrinho
    updateCartDisplay();
    
    // Feedback para leitores de tela
    const zoneName = zoneElement.textContent.split('\n')[0].trim();
    const feeText = deliveryFee === 0 ? 'entrega grátis' : `taxa de R$ ${deliveryFee.toFixed(2)}`;
    announceToScreenReader(`${zoneName} selecionada, ${feeText}`);
}

// Carregar zona selecionada
function loadSelectedZone() {
    const zoneElement = document.querySelector(`.zone-option[data-zone="${selectedZone}"]`);
    if (zoneElement) {
        zoneElement.classList.add('selected');
        zoneElement.setAttribute('aria-checked', 'true');
        deliveryFee = parseFloat(zoneElement.getAttribute('data-fee'));
    }
}

// Carregar dados do cliente
function loadCustomerData() {
    document.getElementById('customer-name').value = customerData.name || '';
    document.getElementById('customer-phone').value = customerData.phone || '';
    document.getElementById('customer-address').value = customerData.address || '';
    document.getElementById('customer-complement').value = customerData.complement || '';
    
    // Definir método de pagamento
    const paymentMethod = customerData.payment || 'PIX';
    const paymentId = paymentMethod === 'PIX' ? 'pix' : 
                     paymentMethod === 'Cartão de Crédito' ? 'credit' : 
                     paymentMethod === 'Cartão de Débito' ? 'debit' : 
                     paymentMethod === 'Cartão Auxílio Alimentação' ? 'food-card' : 'money';
    
    const paymentElement = document.getElementById(`payment-${paymentId}`);
    if (paymentElement) {
        paymentElement.checked = true;
    }
}

// Salvar dados do cliente
function saveCustomerData() {
    customerData = {
        name: document.getElementById('customer-name').value.trim(),
        phone: document.getElementById('customer-phone').value.trim(),
        address: document.getElementById('customer-address').value.trim(),
        complement: document.getElementById('customer-complement').value.trim(),
        payment: document.querySelector('input[name="payment"]:checked').value
    };
    
    localStorage.setItem('familia_customer', JSON.stringify(customerData));
}

// Salvar carrinho
function saveCart() {
    localStorage.setItem('familia_cart', JSON.stringify(cart));
}

// Mostrar notificação
function showNotification(message, isError = false, isSuccess = false) {
    const toast = document.getElementById('notification-toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = toast.querySelector('i');
    
    toastMessage.textContent = message;
    
    // Definir classe apropriada
    toast.classList.remove('error', 'success');
    if (isError) {
        toast.classList.add('error');
        toastIcon.className = 'fas fa-exclamation-circle';
        toast.setAttribute('aria-label', 'Erro: ' + message);
    } else if (isSuccess) {
        toast.classList.add('success');
        toastIcon.className = 'fas fa-check-circle';
        toast.setAttribute('aria-label', 'Sucesso: ' + message);
    } else {
        toastIcon.className = 'fas fa-info-circle';
        toast.setAttribute('aria-label', 'Informação: ' + message);
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Anunciar para leitores de tela
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-9999px';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Navegar para um passo específico
function goToStep(stepNumber) {
    // Fechar carrinho se estiver aberto
    closeFloatingCart();
    
    // Validar se pode ir para o passo
    if (stepNumber === 2 && cart.length === 0) {
        showNotification('Adicione produtos ao carrinho antes de continuar.', true);
        return;
    }
    
    if (stepNumber === 3 && currentStep === 2 && !validateStep2()) {
        return;
    }
    
    const currentStepElement = document.getElementById(`step-${currentStep}`);
    const nextStepElement = document.getElementById(`step-${stepNumber}`);
    
    // Determinar direção da animação
    const direction = stepNumber > currentStep ? 'right' : 'left';
    
    // Atualizar atributos ARIA
    currentStepElement.setAttribute('hidden', 'true');
    nextStepElement.removeAttribute('hidden');
    
    // Animar saída do passo atual
    currentStepElement.classList.add(direction === 'right' ? 'slide-out-left' : 'slide-out-right');
    
    // Atualizar passo atual
    setTimeout(() => {
        currentStepElement.classList.remove('active', 'slide-out-left', 'slide-out-right');
        currentStep = stepNumber;
        
        // Atualizar indicador de progresso
        updateProgressIndicator();
        
        // Animar entrada do próximo passo
        nextStepElement.classList.add('active');
        
        // Se for o passo 3, atualizar a revisão
        if (stepNumber === 3) {
            updateOrderReview();
        }
        
        // Atualizar botões de navegação
        updateStepButtons();
        
        // Rolar para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Feedback para leitores de tela
        const stepNames = ['Escolha de produtos', 'Dados de entrega', 'Revisão do pedido'];
        announceToScreenReader(`Passo ${stepNumber}: ${stepNames[stepNumber - 1]}`);
    }, 300);
}

// Atualizar indicador de progresso
function updateProgressIndicator() {
    // Atualizar círculos dos passos
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.remove('active', 'completed');
        
        const stepNum = parseInt(step.getAttribute('data-step'));
        
        if (stepNum === currentStep) {
            step.classList.add('active');
            step.querySelector('.step-circle').setAttribute('aria-current', 'step');
        } else if (stepNum < currentStep) {
            step.classList.add('completed');
            step.querySelector('.step-circle').innerHTML = '<i class="fas fa-check"></i>';
            step.querySelector('.step-circle').removeAttribute('aria-current');
        } else {
            step.querySelector('.step-circle').removeAttribute('aria-current');
        }
    });
    
    // Atualizar linha de progresso
    const progressFill = document.getElementById('progress-line-fill');
    const progressWidth = ((currentStep - 1) / 2) * 100;
    progressFill.style.width = `${progressWidth}%`;
}

// Atualizar botões de navegação
function updateStepButtons() {
    // Botão de continuar no passo 1
    const nextToStep2 = document.getElementById('next-to-step2');
    if (cart.length === 0) {
        nextToStep2.disabled = true;
        nextToStep2.setAttribute('aria-disabled', 'true');
        nextToStep2.style.opacity = '0.6';
    } else {
        nextToStep2.disabled = false;
        nextToStep2.setAttribute('aria-disabled', 'false');
        nextToStep2.style.opacity = '1';
    }
    
    // Botão de continuar no passo 2
    const nextToStep3 = document.getElementById('next-to-step3');
    const isValid = customerData.name && customerData.phone && customerData.address;
    nextToStep3.disabled = !isValid;
    nextToStep3.setAttribute('aria-disabled', !isValid);
    nextToStep3.style.opacity = isValid ? '1' : '0.6';
}

// Validar passo 2
function validateStep2() {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    
    // Validar campos obrigatórios
    if (!name) {
        showNotification('Por favor, preencha seu nome completo.', true);
        document.getElementById('customer-name').focus();
        return false;
    }
    
    if (!phone) {
        showNotification('Por favor, preencha seu telefone.', true);
        document.getElementById('customer-phone').focus();
        return false;
    }
    
    if (!address) {
        showNotification('Por favor, preencha seu endereço completo.', true);
        document.getElementById('customer-address').focus();
        return false;
    }
    
    // Validar formato do telefone
    if (phone.replace(/\D/g, '').length < 10) {
        showNotification('Por favor, digite um telefone válido.', true);
        document.getElementById('customer-phone').focus();
        return false;
    }
    
    // Salvar dados antes de continuar
    saveCustomerData();
    
    return true;
}

// Atualizar revisão do pedido (passo 3)
function updateOrderReview() {
    // Calcular totais
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    deliveryFee = zoneFees[selectedZone] || 0;
    const total = subtotal + deliveryFee;
    
    // Atualizar lista de produtos
    const productsList = document.getElementById('review-products-list');
    productsList.innerHTML = '';
    
    if (cart.length === 0) {
        productsList.innerHTML = '<p style="color: var(--gray); text-align: center; padding: 20px;">Nenhum produto no carrinho</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const productHTML = `
                <div class="review-item">
                    <div class="review-item-info">
                        <h4>${item.name}</h4>
                        <div class="review-item-quantity">Quantidade: ${item.quantity} un</div>
                    </div>
                    <div class="review-item-price">
                        <div class="price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</div>
                    </div>
                </div>
            `;
            productsList.innerHTML += productHTML;
        });
    }
    
    // Atualizar dados do cliente
    document.getElementById('review-name').textContent = customerData.name || '-';
    document.getElementById('review-phone').textContent = customerData.phone || '-';
    document.getElementById('review-address').textContent = customerData.address || '-';
    document.getElementById('review-complement').textContent = customerData.complement || '-';
    document.getElementById('review-payment').textContent = customerData.payment || '-';
    document.getElementById('review-zone').textContent = selectedZone.toUpperCase();
    
    // Atualizar resumo
    document.getElementById('review-subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('review-delivery-fee').textContent = deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`;
    document.getElementById('review-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Finalizar pedido
function finalizeOrder() {
    // Validar dados
    if (cart.length === 0) {
        showNotification('Adicione produtos ao carrinho antes de finalizar o pedido.', true);
        goToStep(1);
        return;
    }
    
    if (!customerData.name || !customerData.phone || !customerData.address) {
        showNotification('Complete seus dados antes de finalizar o pedido.', true);
        goToStep(2);
        return;
    }
    
    // Mostrar estado de carregamento
    const finalBtn = document.getElementById('finalize-order');
    const originalText = finalBtn.innerHTML;
    finalBtn.disabled = true;
    finalBtn.setAttribute('aria-disabled', 'true');
    finalBtn.innerHTML = '<span class="spinner"></span> PROCESSANDO...';
    
    // Feedback para leitores de tela
    announceToScreenReader('Processando pedido...');
    
    // Simular processamento
    setTimeout(() => {
        const phoneNumber = '5569992557719';
        const message = generateWhatsAppMessage();
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        // Abrir WhatsApp em nova aba
        window.open(whatsappURL, '_blank');
        
        // Restaurar botão
        finalBtn.disabled = false;
        finalBtn.setAttribute('aria-disabled', 'false');
        finalBtn.innerHTML = originalText;
        
        // Mostrar notificação de sucesso
        showNotification('Pedido enviado para o WhatsApp com sucesso!', false, true);
        announceToScreenReader('Pedido enviado para o WhatsApp com sucesso!');
        
        // Limpar carrinho após sucesso
        setTimeout(() => {
            cart = [];
            saveCart();
            updateCartDisplay();
            updateProductQuantities();
            updateStepButtons();
            updateFloatingCart();
            goToStep(1);
        }, 2000);
        
    }, 1500);
}

// Gerar mensagem do WhatsApp
function generateWhatsAppMessage() {
    let message = `*PEDIDO - SUPERMERCADO FAMÍLIA*\n\n`;
    message += `*Dados do cliente:*\n`;
    message += `Nome: ${customerData.name}\n`;
    message += `Telefone: ${customerData.phone}\n`;
    message += `Endereço: ${customerData.address}\n`;
    if (customerData.complement) {
        message += `Complemento: ${customerData.complement}\n`;
    }
    message += `Forma de pagamento: ${customerData.payment}\n`;
    message += `Zona de entrega: ${selectedZone.toUpperCase()}\n\n`;
    
    message += `*Itens do pedido:*\n`;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `• ${item.name} - ${item.quantity} un - R$ ${itemTotal.toFixed(2)}\n`;
    });
    
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const total = subtotal + deliveryFee;
    
    message += `\n*Resumo do pedido:*\n`;
    message += `Subtotal: R$ ${subtotal.toFixed(2)}\n`;
    message += `Taxa de entrega: ${deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2)}`}\n`;
    message += `*TOTAL: R$ ${total.toFixed(2)}*\n\n`;
    
    message += `*Observações:* \n`;
    
    return message;
}

// Funções para o carrinho flutuante
function openFloatingCart() {
    floatingCart.classList.add('open');
    cartOverlay.classList.add('active');
    updateFloatingCart();
    
    // Focar no botão de fechar
    setTimeout(() => {
        closeCartBtn.focus();
    }, 100);
}

function closeFloatingCart() {
    floatingCart.classList.remove('open');
    cartOverlay.classList.remove('active');
    
    // Focar no botão de abrir carrinho
    openCartBtn.focus();
}

function updateFloatingCart() {
    // Limpar conteúdo do carrinho flutuante
    floatingCartBody.innerHTML = '';
    
    if (cart.length === 0) {
        floatingCartBody.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 20px;">Carrinho vazio</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const cartItemHTML = `
                <div class="floating-cart-item">
                    <div class="floating-cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="floating-cart-item-quantity">Quantidade: ${item.quantity}</div>
                    </div>
                    <div class="floating-cart-item-price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</div>
                </div>
            `;
            floatingCartBody.innerHTML += cartItemHTML;
        });
    }
    
    // Calcular total
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const total = subtotal + deliveryFee;
    floatingCartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    floatingCartTotal.setAttribute('aria-label', `Total: R$ ${total.toFixed(2)}`);
    
    // Atualizar badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalItems;
    cartCountBadge.setAttribute('aria-label', `${totalItems} itens no carrinho`);
    
    // Atualizar botão de limpar carrinho
    clearCartBtn.disabled = cart.length === 0;
    clearCartBtn.setAttribute('aria-disabled', cart.length === 0);
}