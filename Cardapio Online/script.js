document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter");
    const menuItems = document.querySelectorAll(".item");
    const cartButton = document.getElementById("cart-button");
    const cart = document.getElementById("cart");
    const cartItemsList = document.getElementById("cart-items");
    const totalDisplay = document.getElementById("total");
    const notificationContainer = document.getElementById("notification-container");
    const closeCartButton = document.getElementById("close-cart-button");
    const addressInput = document.getElementById("address");
    const paymentSelect = document.getElementById("payment-method");
    const whatsappButton = document.getElementById("whatsapp-button");

    let cartItems = [];

    // Mostrar carrinho
    cartButton.addEventListener("click", () => {
        cart.style.display = cart.style.display === "none" ? "block" : "none";
    });

    // Fechar carrinho
    closeCartButton.addEventListener("click", () => {
        cart.style.display = "none";
    });

    // Filtro de categorias
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const category = button.getAttribute("data-category");
            menuItems.forEach(item => {
                if (category === "tudo" || item.getAttribute("data-category") === category) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });

    // Adicionar item ao carrinho
    menuItems.forEach(item => {
        const addToCartButton = item.querySelector(".add-to-cart");
        addToCartButton.addEventListener("click", () => {
            const itemName = item.querySelector("h2").textContent;
            const itemPrice = parseFloat(item.querySelector("span").textContent.replace("R$", "").trim());

            cartItems.push({ name: itemName, price: itemPrice });
            updateCart();
            showNotification(itemName, itemPrice);
        });
    });

    // Atualiza o carrinho
    function updateCart() {
        cartItemsList.innerHTML = "";
        let total = 0;

        cartItems.forEach((cartItem, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${cartItem.name} - R$ ${cartItem.price.toFixed(2)}`;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remover";
            removeButton.addEventListener("click", () => {
                cartItems.splice(index, 1);
                updateCart();
            });

            listItem.appendChild(removeButton);
            cartItemsList.appendChild(listItem);
            total += cartItem.price;
        });

        totalDisplay.textContent = `Total: R$ ${total.toFixed(2)}`;
    }

    // Mostrar notificação
    function showNotification(itemName, itemPrice) {
        const notification = document.createElement("div");
        notification.classList.add("notification");
        notification.textContent = `${itemName} - R$ ${itemPrice.toFixed(2)} adicionado ao carrinho. Total: R$ ${getTotal().toFixed(2)}`;

        notificationContainer.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Calcular total
    function getTotal() {
        return cartItems.reduce((total, item) => total + item.price, 0);
    }

    // Enviar pedido via WhatsApp
    whatsappButton.addEventListener("click", () => {
        const address = addressInput.value;
        const paymentMethod = paymentSelect.value;
        const total = getTotal().toFixed(2);
        const cartDetails = cartItems.map(item => `${item.name} - R$ ${item.price.toFixed(2)}`).join("\n");

        const message = `*Pedido de Delivery*\n\nItens:\n${cartDetails}\n\nEndereço: ${address}\nForma de Pagamento: ${paymentMethod}\nTotal: R$ ${total}`;

        const whatsappUrl = `https://wa.me/5511913559656?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    });
});
