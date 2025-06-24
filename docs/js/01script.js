// Agrega un michi al carrito (almacenado en localStorage)
function agregarAlCarrito(nombre, edad, imagen) {
  const michi = { nombre, edad, imagen };
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const yaExiste = carrito.find((m) => m.nombre === nombre);
  if (!yaExiste) {
    carrito.push(michi);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert(`${nombre} fue agregado al carrito 🐾`);
  } else {
    alert(`${nombre} ya está en el carrito 🛒`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Guardar total de michis en adopta.html
  if (location.pathname.includes("adopta")) {
    const totalMichis = document.querySelectorAll(".michi-card").length;
    localStorage.setItem("totalMichis", totalMichis);
  }

  // 📦 Mostrar contador real de michis en index.html
  if (location.pathname.includes("index")) {
    const contador = document.getElementById("contador-michis");
    const total = localStorage.getItem("totalMichis");
    if (contador) {
      contador.textContent = total ?? "0";
    }
  }

  // Validación de mensaje del formulario y animacion
const formulario = document.querySelector("form");
if (formulario) {
  formulario.addEventListener("submit", function (e) {
    const campos = formulario.querySelectorAll("input, select, textarea");
    const errorMensaje = document.getElementById("error-mensaje");
    let hayError = false;

    campos.forEach((campo) => {
      const isMensaje = campo.id === "mensaje";
      const mensajeCorto = isMensaje && campo.value.trim().length < 10;

      if (!campo.checkValidity() || mensajeCorto) {
        campo.classList.add("agitar");
        campo.focus();
        setTimeout(() => campo.classList.remove("agitar"), 500);
        hayError = true;

        if (isMensaje) {
          errorMensaje.textContent = "El mensaje debe tener al menos 10 caracteres.";
        }
      } else {
        if (isMensaje) errorMensaje.textContent = ""; // Limpia si está bien
      }
    });

    if (hayError) e.preventDefault();
  });
}


  // Botón flotante para volver arriba
  const botonTop = document.createElement("button");
  botonTop.id = "scrollTop";
  botonTop.innerText = "🐾";
  botonTop.title = "Volver arriba";
  botonTop.style.display = "none";
  botonTop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  document.body.appendChild(botonTop);

  // Mostrar botón solo cuando se hace scroll
  window.addEventListener("scroll", () => {
    const scrollTopBtn = document.getElementById("scrollTop");
    if (window.scrollY > 300) {
      scrollTopBtn.style.display = "block";
      scrollTopBtn.style.animation = "fadeInUp 0.4s ease forwards";
    } else {
      scrollTopBtn.style.display = "none";
      scrollTopBtn.style.animation = "";
    }
  });

  // Menú responsive hamburguesa
  const menuToggle = document.querySelector(".menu-toggle");
  const navLista = document.querySelector(".nav-lista");
  if (menuToggle && navLista) {
    menuToggle.addEventListener("click", () => {
      navLista.classList.toggle("activa");
    });
  }

  // Carrusel automático de testimonios
  const carruselItems = document.querySelectorAll(".carrusel-item");
  const carruselTrack = document.querySelector(".carrusel-contenido");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  if (carruselItems.length && carruselTrack && prevBtn && nextBtn) {
    let currentIndex = 0;
    let pausaTestimonios = false;

    const contenedorIndicadores = document.getElementById(
      "indicadores-testimonios"
    );
    carruselItems.forEach((_, i) => {
      const bolita = document.createElement("span");
      bolita.classList.add("indicador-bolita");
      if (i === 0) bolita.classList.add("activo");
      contenedorIndicadores.appendChild(bolita);
    });

    function mostrarTestimonio(index) {
      carruselItems.forEach((item, i) => {
        item.classList.toggle("activo", i === index);
      });

      const bolitas = document.querySelectorAll(".indicador-bolita");
      bolitas.forEach((bolita, i) => {
        bolita.classList.toggle("activo", i === index);
      });
    }

    document.querySelectorAll(".indicador-bolita").forEach((bolita, i) => {
      bolita.addEventListener("click", () => {
        currentIndex = i;
        mostrarTestimonio(currentIndex);
        pausaTestimonios = true;
      });
    });

    function avanzarTestimonio() {
      currentIndex = (currentIndex + 1) % carruselItems.length;
      mostrarTestimonio(currentIndex);
    }

    function retrocederTestimonio() {
      currentIndex =
        (currentIndex - 1 + carruselItems.length) % carruselItems.length;
      mostrarTestimonio(currentIndex);
    }

    // Botones
    prevBtn.addEventListener("click", () => {
      retrocederTestimonio();
      pausaTestimonios = true;
    });

    nextBtn.addEventListener("click", () => {
      avanzarTestimonio();
      pausaTestimonios = true;
    });

    // Hover pausa
    carruselTrack.addEventListener(
      "mouseenter",
      () => (pausaTestimonios = true)
    );
    carruselTrack.addEventListener(
      "mouseleave",
      () => (pausaTestimonios = false)
    );
    prevBtn.addEventListener("mouseenter", () => (pausaTestimonios = true));
    nextBtn.addEventListener("mouseenter", () => (pausaTestimonios = true));

    // Loop automático
    setInterval(() => {
      if (!pausaTestimonios) avanzarTestimonio();
    }, 4000);
  }

  // Animación de entrada por scroll
  const animaciones = document.querySelectorAll(".fade-in");

  const mostrarElemento = (element) => {
    const rect = element.getBoundingClientRect();
    return rect.top <= window.innerHeight - 100 && rect.bottom >= 0;
  };

  const activarAnimaciones = () => {
    animaciones.forEach((el) => {
      if (mostrarElemento(el)) el.classList.add("visible");
    });
  };

  window.addEventListener("scroll", activarAnimaciones);
  window.addEventListener("load", activarAnimaciones);

  // Animación fade-in con IntersectionObserver
  const fadeIns = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // solo una vez
      }
    });
  });

  fadeIns.forEach((el) => observer.observe(el));

  actualizarContadorCarrito(); // 👈 Muestra la cantidad al cargar

  //actualizacion de carrito.html
  if (window.location.href.includes("carrito.html")) {
    mostrarCarrito();
  }
});

//funciones carrito
function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contenedor = document.getElementById("carrito-contenido");
  const total = document.getElementById("total-michis");

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
      <img src="${michi.imagen}" alt="${michi.nombre}" />
      <h3>${michi.nombre}</h3>
      <p>Edad: ${michi.edad} mes(es)</p>
      <button onclick="eliminarDelCarrito(${index})" class="boton-secundario">❌ Quitar</button>
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
  actualizarContadorCarrito(); // 👈 añadí esto
}

function vaciarCarrito() {
  localStorage.removeItem("carrito");
  mostrarCarrito();
  actualizarContadorCarrito(); // 👈 añadí esto
}

//contador de carrito icono
function actualizarContadorCarrito() {
  const contador = document.getElementById("carrito-contador");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  if (contador) {
    contador.textContent = carrito.length;
    contador.style.display = carrito.length > 0 ? "inline-block" : "none";
  }
}

// Carrusel "Últimos rescatados" – versión simplificada con 2 visibles
document.addEventListener("DOMContentLoaded", () => {
  const sliderTrack = document.getElementById("sliderTrack");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const slides = document.querySelectorAll(".michi-slide");
  const indicadores = document.getElementById("indicadores-slider");

  if (!sliderTrack || slides.length === 0) return;

  let currentIndex = 0;
  const visibleCards = 2;
  const totalSlides = slides.length;

  // Crear indicadores
  const totalSteps = Math.ceil(totalSlides / visibleCards);
  for (let i = 0; i < totalSteps; i++) {
    const dot = document.createElement("span");
    dot.className = "indicador-bolita-slider";
    if (i === 0) dot.classList.add("activo");
    indicadores.appendChild(dot);
  }

  function updateSlider() {
    const slideWidth = slides[0].offsetWidth + 20;
    const offset = slideWidth * currentIndex;
    sliderTrack.style.transition = "transform 0.5s ease-in-out";
    sliderTrack.style.transform = `translateX(-${offset}px)`;

    const dots = indicadores.querySelectorAll(".indicador-bolita-slider");
    dots.forEach((dot) => dot.classList.remove("activo"));
    const dotIndex = Math.floor(currentIndex / visibleCards);
    if (dots[dotIndex]) dots[dotIndex].classList.add("activo");
  }

  nextBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex + visibleCards) % totalSlides;
    updateSlider();
  });

  prevBtn?.addEventListener("click", () => {
    currentIndex = (currentIndex - visibleCards + totalSlides) % totalSlides;
    updateSlider();
  });

  // Loop automático
  let autoScroll = setInterval(() => nextBtn?.click(), 5000);
  sliderTrack.addEventListener("mouseenter", () => clearInterval(autoScroll));
  sliderTrack.addEventListener("mouseleave", () => {
    autoScroll = setInterval(() => nextBtn?.click(), 5000);
  });

  updateSlider();
});
