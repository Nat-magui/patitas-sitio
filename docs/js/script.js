// Agrega un michi al carrito desde adopta.html
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

// Muestra la cantidad de michis en el icono del carrito (en todas las páginas)
function actualizarContadorCarrito() {
  const contador = document.getElementById("carrito-contador");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  if (contador) {
    contador.textContent = carrito.length;
    contador.style.display = carrito.length > 0 ? "inline-block" : "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Guardar total de michis en adopta.html
  if (location.pathname.includes("adopta")) {
    const totalMichis = document.querySelectorAll(".michi-card").length;
    localStorage.setItem("totalMichis", totalMichis);
  }

  // Mostrar contador real de michis en index.html
  if (location.pathname.includes("index")) {
    const contador = document.getElementById("contador-michis");
    const total = localStorage.getItem("totalMichis");
    if (contador) {
      contador.textContent = total ?? "0";
    }
  }

  // Validación de mensaje del formulario
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
            errorMensaje.textContent =
              "El mensaje debe tener al menos 10 caracteres.";
          }
        } else {
          if (isMensaje) errorMensaje.textContent = "";
        }
      });

      if (hayError) e.preventDefault();
    });
  }

  // Botón para volver arriba
  const botonTop = document.createElement("button");
  botonTop.id = "scrollTop";
  botonTop.innerText = "🐾";
  botonTop.title = "Volver arriba";
  botonTop.style.display = "none";
  botonTop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  document.body.appendChild(botonTop);

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

  // Menú hamburguesa
  const menuToggle = document.querySelector(".menu-toggle");
  const navLista = document.querySelector(".nav-lista");
  if (menuToggle && navLista) {
    menuToggle.addEventListener("click", () => {
      navLista.classList.toggle("activa");
    });
  }

  // Cierra el menú cuando se hace clic en un enlace (solo en mobile)
  document.querySelectorAll(".nav-lista a").forEach((enlace) => {
    enlace.addEventListener("click", () => {
      const navLista = document.querySelector(".nav-lista");
      if (navLista.classList.contains("activa")) {
        navLista.classList.remove("activa");
      }
    });
  });

  // Carrusel de testimonios
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

    prevBtn.addEventListener("click", () => {
      currentIndex =
        (currentIndex - 1 + carruselItems.length) % carruselItems.length;
      mostrarTestimonio(currentIndex);
      pausaTestimonios = true;
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % carruselItems.length;
      mostrarTestimonio(currentIndex);
      pausaTestimonios = true;
    });

    carruselTrack.addEventListener(
      "mouseenter",
      () => (pausaTestimonios = true)
    );
    carruselTrack.addEventListener(
      "mouseleave",
      () => (pausaTestimonios = false)
    );

    setInterval(() => {
      if (!pausaTestimonios) {
        currentIndex = (currentIndex + 1) % carruselItems.length;
        mostrarTestimonio(currentIndex);
      }
    }, 4000);
  }

  // Animaciones por scroll
  const fadeIns = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  });
  fadeIns.forEach((el) => observer.observe(el));

  // Carrusel "Últimos rescatados"
  const sliderTrack = document.getElementById("sliderTrack");
  const prevSlide = document.getElementById("prevSlide");
  const nextSlide = document.getElementById("nextSlide");
  const slides = document.querySelectorAll(".michi-slide");
  const indicadores = document.getElementById("indicadores-slider");

  if (sliderTrack && slides.length > 0 && indicadores) {
    let currentIndex = 0;
    const visibleCards = 2;
    const totalSlides = slides.length;

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

    nextSlide?.addEventListener("click", () => {
      currentIndex = (currentIndex + visibleCards) % totalSlides;
      updateSlider();
    });

    prevSlide?.addEventListener("click", () => {
      currentIndex = (currentIndex - visibleCards + totalSlides) % totalSlides;
      updateSlider();
    });

    let autoScroll = setInterval(() => nextSlide?.click(), 5000);
    sliderTrack.addEventListener("mouseenter", () => clearInterval(autoScroll));
    sliderTrack.addEventListener("mouseleave", () => {
      autoScroll = setInterval(() => nextSlide?.click(), 5000);
    });

    updateSlider();
  }

  // Contador inicial del carrito
  actualizarContadorCarrito();
});
