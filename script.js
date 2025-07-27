
document.addEventListener("DOMContentLoaded", function () {
    const productListDiv = document.getElementById("product-list");
    const viewCartBtn = document.getElementById("view-cart-btn");
    const cartCountSpan = document.getElementById("cart-count");
    //let cart = [];
    let cart = JSON.parse(localStorage.getItem("cart")) || []
    //console.log(cart)

    function updateCartCount() {
        cartCountSpan.textContent = cart.reduce(
            (acc, item) => acc + item.quantity, 0)
    }

    async function fetchProducts() {

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

    const productDisplay = (productsToShow) => {
        const productListDiv = document.getElementById("product-list");

        productListDiv.innerHTML = "";
            productsToShow.forEach((product) => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$ ${product.price}</p>
                    <button data-id="${product.id}" >Agregar al carrito</button>
                `;
                productListDiv.appendChild(productCard)
        }
        )

        // Agregar event listeners para los botones "Agregar al carrito"
        document.querySelectorAll(".product-card button").forEach((button) => {
            button.addEventListener('click', (evt) => {
                const productId = parseInt(evt.target.dataset.id);
                const productToAdd = productsToShow.find((item) => item.id === productId)
                if (productId) {
                    addToCart(productToAdd)
                }
            })
        })
    }

    const filterProducts = (description) => {
        const productsToShow = products.filter(product => product.description === description)
        productDisplay(productsToShow)
    }

    const computacion = document.getElementById("computacion")
    const sillas = document.getElementById("sillas-gamer")
    const audifonos = document.getElementById("audifonos")
    const escritorios = document.getElementById("escritorios")
    const todos = document.getElementById("todos")

    todos.addEventListener("click", () => {
        productDisplay(products);
    });

    computacion.addEventListener("click", () => {
        filterProducts("computacion");
    });

    sillas.addEventListener("click", () => {
        filterProducts('sillas');
    });

    audifonos.addEventListener("click", () => {
        filterProducts('audifonos');
    });

    escritorios.addEventListener("click", () => {
        filterProducts('escritorio');
    });
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

//intento de filtrador

const products = [
    {
        "id": 1,
        "name": "MousePad de Oficina",
        "description": 'computacion',
        "price": 14.0,
        "image": "https://images.unsplash.com/photo-1631098983935-5363b8e50edb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        "id": 2,
        "name": "MousePad de Oficina (negro)",
        "description": 'computacion',
        "price": 14.0,
        "image": "https://images.unsplash.com/photo-1616071358409-ef30a44a90bb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        "id": 3,
        "name": "Monitor Curvo 27'",
        "description": 'computacion',
        "price": 250.0,
        "image": "https://images.unsplash.com/photo-1666771409964-4656b1099ccb?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        "id": 4,
        "name": "Microfono Streaming",
        "description": 'computacion',
        "price": 50.0,
        "image": "https://plus.unsplash.com/premium_photo-1664195074777-a7c40926f5c2?q=80&w=1340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        "id": 5,
        "name": "Notebook ASUS ROG",
        "description": 'computacion',
        "price": 2500.0,
        "image": "https://media.falabella.com/falabellaCL/143321838_01/w=1500,h=1500,fit=pad"
    },
    {
        "id": 6,
        "name": "Audifonos JBL",
        "description": 'audifonos',
        "price": 40.0,
        "image": "https://media.falabella.com/falabellaCL/16919937_1/w=1500,h=1500,fit=pad"
    },
    {
        "id": 7,
        "name": "Audifonos Recon 50",
        "description": 'audifonos',
        "price": 20.0,
        "image": "https://media.falabella.com/falabellaCL/16905538_1/w=1500,h=1500,fit=pad"
    },
    {
        "id": 8,
        "name": "Audifonos JBL Quantum 610",
        "description": 'audifonos',
        "price": 170.0,
        "image": "https://media.falabella.com/falabellaCL/124348776_01/w=1500,h=1500,fit=pad"
    },
    {
        "id": 9,
        "name": "Silla Gamer Profesional Reclinable",
        "description": 'sillas',
        "price": 60.0,
        "image": "https://media.falabella.com/falabellaCL/144709250_01/w=1500,h=1500,fit=pad"
    },
    {
        "id": 10,
        "name": "Silla Ergonómica Oficina Ejecutiva Reclinable",
        "description": 'sillas',
        "price": 130.0,
        "image": "https://media.falabella.com/falabellaCL/138529890_01/w=1500,h=1500,fit=pad"
    },
    {
        "id": 11,
        "name": "Silla Gamer RGB K-night Reclinable",
        "description": 'sillas',
        "price": 100.0,
        "image": "https://media.falabella.com/falabellaCL/139611745_01/w=1500,h=1500,fit=pad"
    },
    {
        "id": 12,
        "name": "Monitor Gamer 32 Curvo QHD 1440 VA 180Hz",
        "description": 'computacion',
        "price": 220.0,
        "image": "https://media.falabella.com/falabellaCL/135833404_01/w=1500,h=1500,fit=pad"
    },
    {
        "id": 13,
        "name": "Samsung Monitor Curvo 27 S36GD",
        "description": 'computacion',
        "price": 130.0,
        "image": "https://media.falabella.com/falabellaCL/144313132_01/w=1500,h=1500,fit=pad"
    },
    {
        "id": 14,
        "name": "Escritorio gamer 120x48x88 cm",
        "description": 'escritorio',
        "price": 90.0,
        "image": "https://media.falabella.com/sodimacCL/8758980_01/w=1500,h=1500,fit=pad"
    },
    {
        "id": 15,
        "name": "Escritorio Gamer Mesa Gamer Profesional",
        "description": 'escritorio',
        "price": 95.0,
        "image": "https://media.falabella.com/falabellaCL/136612065_03/w=1500,h=1500,fit=pad"
    },
    {
        "id": 16,
        "name": "Escritorio Gamer Negro-Rojo",
        "description": 'escritorio',
        "price": 70.0,
        "image": "https://media.falabella.com/sodimacCL/6755119_01/w=1500,h=1500,fit=pad"
    },
    {
        "id": 17,
        "name": "Notebook TUF Gaming A15",
        "description": "computacion",
        "price": 1300.0,
        "image": "https://media.falabella.com/falabellaCL/17116449_01/w=1500,h=1500,fit=pad"
    },
    {
        "id": 18,
        "name": "Notebook Gamer Victus 15-FB2028LA",
        "description": "computacion",
        "price": 700.0,
        "image": "https://media.falabella.com/falabellaCL/17459380_1/w=1500,h=1500,fit=pad"
    }

]
