document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const overlay = document.getElementById("overlay");
    
    // Elementos do Menu Mobile
    const menuBtn = document.getElementById("menu-btn");
    const closeMenuBtn = document.getElementById("close-menu-btn");
    const navMobile = document.getElementById("nav-links-mobile");
    const navLinksMobile = navMobile ? navMobile.querySelectorAll(".nav-link") : [];

    // Elementos do Carrinho
    const cartBtn = document.getElementById("cart-btn");
    const closeCartBtn = document.getElementById("close-cart-btn");
    const cartSidebar = document.getElementById("cart-sidebar");
    const cartCount = document.getElementById("cart-count");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const cartTotalElement = document.getElementById("cart-total");
    const emptyCartMessage = document.getElementById("empty-cart-message");
    const checkoutBtn = document.querySelector(".checkout-btn");
    const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");

    // Estado do Carrinho
    let cart = []; 

    // ===================================
    // FUNÇÕES GERAIS DE UI
    // ===================================

    // LÓGICA DO SCROLL HEADER
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Função para abrir/fechar Menu Mobile
    function toggleMenu() {
        const isActive = navMobile.classList.toggle("active");
        overlay.classList.toggle("active", isActive);
        
        if (isActive) {
            document.body.style.overflow = 'hidden'; 
            if (cartSidebar.classList.contains("active")) {
                cartSidebar.classList.remove("active");
            }
        } else {
            document.body.style.overflow = '';
        }
    }

    // Função para abrir/fechar Carrinho Sidebar
    function toggleCart() {
        const isActive = cartSidebar.classList.toggle("active");
        overlay.classList.toggle("active", isActive);
        
        if (isActive) {
            document.body.style.overflow = 'hidden';
            if (navMobile.classList.contains("active")) {
                navMobile.classList.remove("active");
            }
        } else {
            document.body.style.overflow = '';
        }
    }

    // ===================================
    // LÓGICA DO CARRINHO (CART)
    // ===================================

    function saveCart() {
        // Salva o carrinho no LocalStorage (opcional, para persistência)
        localStorage.setItem('asMotorsCart', JSON.stringify(cart));
    }

    function loadCart() {
        const savedCart = localStorage.getItem('asMotorsCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    }

    function updateCartUI() {
        let totalItems = 0;
        let totalPrice = 0;
        
        cartItemsContainer.innerHTML = ''; // Limpa o conteúdo
        
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalItems += item.quantity;
                totalPrice += itemTotal;

                // Cria o elemento de item no carrinho
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-qty">Qty: ${item.quantity}</p>
                    <p class="cart-item-price">$${item.price.toLocaleString('en-US')}</p>
                    <button class="remove-item-btn" data-id="${item.id}"><i class='bx bx-trash'></i></button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            
            // Adiciona event listeners para remover itens
            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', removeItemFromCart);
            });
        }
        
        // Atualiza o contador de itens e o total
        cartCount.textContent = totalItems;
        cartTotalElement.textContent = `$${totalPrice.toLocaleString('en-US')}`;
        saveCart();
    }

    function addItemToCart(event) {
        const btn = event.currentTarget;
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);

        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        
        // Alerta simples para feedback (opcional)
        alert(`${name} added to cart! (Qty: ${existingItem ? existingItem.quantity : 1})`);
        
        updateCartUI();
    }

    function removeItemFromCart(event) {
        const idToRemove = event.currentTarget.dataset.id;
        
        const index = cart.findIndex(item => item.id === idToRemove);
        
        if (index !== -1) {
            // Remove 1 unidade do item
            cart[index].quantity--;
            
            // Se a quantidade for 0, remove o item da lista
            if (cart[index].quantity === 0) {
                cart.splice(index, 1);
            }
        }

        updateCartUI();
    }

    function handleCheckout() {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add products to proceed.");
            return;
        }
        
        // Simulação de Finalização de Compra
        alert(`Checkout initiated! Total items: ${cartCount.textContent}. Total Price: ${cartTotalElement.textContent}. \n (This is a simulation. Real payment integration would go here.)`);
        
        // Limpa o carrinho após a simulação
        cart = [];
        updateCartUI();
        toggleCart(); // Fecha o sidebar
    }

    // ===================================
    // LISTENERS E INICIALIZAÇÃO
    // ===================================

    // Inicialização
    loadCart();

    // Eventos UI
    if (menuBtn) menuBtn.addEventListener("click", toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener("click", toggleMenu);
    if (cartBtn) cartBtn.addEventListener("click", toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener("click", toggleCart);
    if (checkoutBtn) checkoutBtn.addEventListener("click", handleCheckout);

    // Fecha ao clicar no overlay
    if (overlay) {
        overlay.addEventListener("click", () => {
            if (cartSidebar.classList.contains("active")) {
                toggleCart();
            } else if (navMobile.classList.contains("active")) {
                toggleMenu();
            }
        });
    }

    // Eventos de Adicionar ao Carrinho
    addToCartBtns.forEach(button => {
        button.addEventListener('click', addItemToCart);
    });

    // CSS para os itens do carrinho (coloque no final do seu style.css)
    const cartItemStyles = `
        .cart-item {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 40px;
            gap: 10px;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px dashed var(--borda-header);
        }
        .cart-item-name {
            font-weight: 600;
            color: var(--roxo);
        }
        .cart-item-price {
            font-weight: 700;
            text-align: right;
        }
        .remove-item-btn {
            background: none;
            border: none;
            color: #d33;
            cursor: pointer;
            font-size: 1.2rem;
            transition: color 0.3s;
        }
        .remove-item-btn:hover {
            color: var(--preto);
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = cartItemStyles;
    document.head.appendChild(styleSheet);
});