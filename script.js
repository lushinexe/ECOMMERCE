//Swal.fire("SweetAlert2 is working!");

document.addEventListener("DOMContentLoaded", function () {
    const productListDiv = document.getElementById("product-list");
    const viewCartBtn = document.getElementById("view-cart-btn");
    const cartCountSpan = document.getElementById("cart-count");

    /*     
        console.log(productListDiv);
        console.log(viewCartBtn);
        console.log(cartCountSpan); 
        */

    //let cart = [];
    let cart = JSON.parse(localStorage.getItem("cart")) || []
    //console.log(cart)

    function updateCartCount() {
        cartCountSpan.textContent = cart.reduce(
            (acc, item) => acc + item.quantity, 0)
    }

    async function fetchProducts() {
        /*         
                fetch("products.json")
                  .then((resp) => {
                    console.log(resp);
                    return resp.json();
                  })
                  .then((data) => {
                    console.log(data);
                  })
                  .catch((err) => {
                    console.log("Error " + err);
                  }); 
        */
        try {
            const respuesta = await fetch("products.json")
            console.log(respuesta)
            if (!respuesta.ok) {
                throw new Error("Error en la respuesta de la API")
            }
            const products = await respuesta.json()
            // dibujar los productos
            displayProducts(products)
            //console.log(products);
        } catch (error) {
            console.error("Error al cargar los productos", error)
        }
    }

    function displayProducts(products) {
        productListDiv.innerHTML = "";
        products.forEach((product) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$ ${product.price}</p>
                <button data-id="${product.id}" >Agregar al carrito</button>
            `;
            productListDiv.appendChild(productCard)
        })

        document.querySelectorAll(".product-card button").forEach((button) => {
            button.addEventListener('click', (evt) => {
                //console.log(evt.target.dataset.id)
                const productId = parseInt(evt.target.dataset.id);
                const productToAdd = products.find((item) => item.id === productId)
                if (productId) {
                    addToCart(productToAdd)
                }
            })
        })
    }

    function addToCart(product) {
        const existingProduct = cart.find((item) => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += 1
        } else {
            cart.push({ ...product, quantity: 1 })
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        Toastify({
            text: `${product.name} agregado al carrito`,
            duration: 3500,
            gravity: "bottom",
            position: "right",
            backgroundColor: "linear-gradient(to right, #00b09b, #ff0000ff)",
            stopOnFocus: true,
        }).showToast()
    }

    function showCart() {
        if (cart.length === 0) {
            Swal.fire({
                width: 800,
                color: 'white',
                background: '#000000ff',
                icon: 'info',
                title: "canasta de compras vacia",
                text: "Aun no has seleccionado nada para tu compra",
            });
            return;
        }

        let cartContent = '<ul style="list-style: none; padding: 0;">'
        let total = 0

        cart.forEach((item) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartContent += `
            <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px dotted #ccc; padding-bottom: 5px;">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>$${itemTotal.toFixed(2)} 
                        <button class="remove-from-cart-btn" data-id="${item.id
                }" style="background-color: #dc3545; color: white; border: none; border-radius: 3px; padding: 3px 8px; cursor: pointer; margin-left: 10px;">X</button>
                    </span>
                </li>
            `;
        });
        cartContent += `</ul>`;
        cartContent += `<p style="font-weight: bold; font-size: 1.2rem; text-align: right; margin-top: 20px;">Total: $${total.toFixed(2)}</p>`;

        const now = luxon.DateTime.local()
            .setLocale('es')
            .toLocaleString(luxon.DateTime.DATETIME_MED);
        cartContent += `<p style="font-style: italic; font-size: 0.9em; text-align: right; color: #666;">Fecha actual: ${now}</p>`;

        Swal.fire({
            title: "Tu carrito de Compras",
            html: cartContent,
            width: 800,
            showCancelButton: true,
            confirmButtonText: "Finalizar Compra",
            cancelButtonText: "Seguir agregando",
            didOpen: () => {
                document.querySelectorAll(".remove-from-cart-btn").forEach((button) => {
                    button.addEventListener("click", (event) => {
                        const productIdToRemove = parseInt(event.target.dataset.id);
                        removeFromCart(productIdToRemove);
                        // Vuelve a abrir el carrito para reflejar los cambios
                        showCart();
                    });
                });
            },
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    width: 800,
                    background: '#ffffffff',
                    icon: 'success',
                    title: 'Compra realizada',
                    text: `Gracias por preferir Lusho-Box`,
                });
                // Limpiar el carrito
                cart = [];
                localStorage.removeItem("cart");
                updateCartCount();
            }
        })

    }

    function removeFromCart(productId) {
        cart = cart.filter((item) => item.id !== productId)
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount()
    }

    viewCartBtn.addEventListener("click", showCart);
    fetchProducts()
    updateCartCount()

})

const btnModoOscuro = document.getElementById("btnModoOscuro");
const body = document.body;

btnModoOscuro.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("tema", "dark");
    } else {
        localStorage.setItem("tema", "light");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const temaGuardado = localStorage.getItem("tema");
    if (temaGuardado === "dark") {
        body.classList.add("dark-mode");
    } else {
        body.classList.remove("dark-mode");
    }
});
