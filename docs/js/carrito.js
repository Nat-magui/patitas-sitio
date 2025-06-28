// ========================
// 📦 Funciones del carrito
// ========================

function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contenedor = document.getElementById("carrito-contenido");
  const total = document.getElementById("total-michis");

  if (!contenedor || !total) return;

  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>El carrito está vacío 💤</p>";
    total.textContent = "0";
    return;
  }

  carrito.forEach((michi, index) => {
    const card = document.createElement("div");
    card.className = "michi-card";
    card.innerHTML = `
      <img src="${michi.imagen}" alt="${michi.nombre}, ${michi.edad} meses" />
      <h3>${michi.nombre}</h3>
      <p>Edad: ${michi.edad} mes(es)</p>
      <button onclick="eliminarDelCarrito(${index})" class="boton-secundario" aria-label="Quitar a ${michi.nombre} del carrito">❌ Quitar</button>
    `;
    contenedor.appendChild(card);
  });

  total.textContent = carrito.length;
}

function eliminarDelCarrito(index) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
  actualizarContadorCarrito();
}

function vaciarCarrito() {
  localStorage.removeItem("carrito");
  mostrarCarrito();
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const contador = document.getElementById("carrito-contador");
  if (!contador) return;

  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  contador.textContent = carrito.length;
  contador.style.display = carrito.length > 0 ? "inline-block" : "none";
}

// ========================
// 🚀 Inicialización
// ========================

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();

  if (location.pathname.endsWith("carrito.html")) {
    mostrarCarrito();
  }
});
