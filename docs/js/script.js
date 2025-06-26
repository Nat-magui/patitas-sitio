// Agrega un michi al carrito desde adopta.html
function agregarAlCarrito(nombre, edad, imagen) {
  const michi = { nombre, edad, imagen };
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const yaExiste = carrito.find((m) => m.nombre === nombre);
  if (!yaExiste) {
    carrito.push(michi);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    mostrarNotificacion(`${nombre} fue agregado al carrito`, "success");
  } else {
    mostrarNotificacion(`${nombre} ya está en el carrito`, "warning");
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

function mostrarNotificacion(mensaje, tipo = "info") {
  const notif = document.getElementById("notificacion");
  if (!notif) return;

  // Limpiar clases previas
  notif.className = "notificacion";

  // Agregar ícono según tipo
  let emoji = "ℹ️";
  if (tipo === "success") emoji = "🐾";
  if (tipo === "warning") emoji = "⚠️";

  notif.innerHTML = `<span class="emoji-notif">${emoji}</span> ${mensaje}`;
  notif.classList.add("visible", tipo);

  // Cerrar al hacer clic
  notif.onclick = () => notif.classList.remove("visible");

  // Desaparece solo
  setTimeout(() => notif.classList.remove("visible"), 4000);
}

function esperarCargaImagenes(container, callback) {
  const imagenes = container.querySelectorAll("img");
  let cargadas = 0;

  if (imagenes.length === 0) {
    callback();
    return;
  }

  imagenes.forEach((img) => {
    if (img.complete) {
      cargadas++;
    } else {
      img.addEventListener("load", () => {
        cargadas++;
        if (cargadas === imagenes.length) callback();
      });
      img.addEventListener("error", () => {
        cargadas++;
        if (cargadas === imagenes.length) callback();
      });
    }
  });

  if (cargadas === imagenes.length) {
    callback();
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

  // Carrusel "Historias de quienes ya transitaron" - Página transito.html
  (() => {
    const carruselItems = document.querySelectorAll(
      "#carruselTransito .carrusel-item-transito"
    );
    const prevBtn = document.getElementById("prevTransito");
    const nextBtn = document.getElementById("nextTransito");
    const indicadores = document.getElementById("indicadores-transito");
    const carrusel = document.getElementById("carruselTransito");
    if (!carrusel) return;
    if (carruselItems.length > 0 && indicadores) {
      let currentIndex = 0;
      let autoplayActivo = true;
      let intervaloAutoplay;

      // Crear indicadores
      carruselItems.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.classList.add("indicador-transito");
        if (i === 0) dot.classList.add("activo");
        dot.addEventListener("click", () => {
          currentIndex = i;
          updateCarrusel();
          detenerAutoplay();
        });
        indicadores.appendChild(dot);
      });

      const updateCarrusel = () => {
        carruselItems.forEach((item, i) =>
          item.classList.toggle("activo", i === currentIndex)
        );
        indicadores
          .querySelectorAll(".indicador-transito")
          .forEach((dot, i) =>
            dot.classList.toggle("activo", i === currentIndex)
          );
      };

      const avanzar = () => {
        currentIndex = (currentIndex + 1) % carruselItems.length;
        updateCarrusel();
      };

      const iniciarAutoplay = () => {
        intervaloAutoplay = setInterval(avanzar, 8000); // cada 8 segundos
      };

      const detenerAutoplay = () => {
        if (autoplayActivo) {
          clearInterval(intervaloAutoplay);
          autoplayActivo = false;
        }
      };

      // Detener autoplay si el usuario toca/interactúa
      document
        .getElementById("carruselTransito")
        .addEventListener("touchstart", detenerAutoplay);

      prevBtn?.addEventListener("click", () => {
        currentIndex =
          (currentIndex - 1 + carruselItems.length) % carruselItems.length;
        updateCarrusel();
        detenerAutoplay();
      });

      nextBtn?.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % carruselItems.length;
        updateCarrusel();
        detenerAutoplay();
      });

      // Iniciar autoplay solo si hay más de un item
      if (carruselItems.length > 1) {
        iniciarAutoplay();
      }
    }

    let startX = 0;
    let endX = 0;

    carrusel.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    carrusel.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    });

    function handleSwipe() {
      const diff = startX - endX;
      const minSwipeDistance = 50; // px

      if (Math.abs(diff) < minSwipeDistance) return;

      if (diff > 0) {
        // Swipe izquierda → siguiente
        document.getElementById("nextTransito")?.click();
      } else {
        // Swipe derecha → anterior
        document.getElementById("prevTransito")?.click();
      }
    }
  })();

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
  function iniciarSliderUltimosRescatados() {
    const sliderTrack = document.getElementById("sliderTrack");
    const prevSlide = document.getElementById("prevSlide");
    const nextSlide = document.getElementById("nextSlide");
    const slides = document.querySelectorAll(".michi-slide");
    const indicadores = document.getElementById("indicadores-slider");
    let autoScroll;

    if (sliderTrack && slides.length > 0 && indicadores) {
      esperarCargaImagenes(sliderTrack, () => {
        const isMobile = window.innerWidth <= 600;
        if (isMobile) {
          // Aplicamos clases especiales solo para mobile
          sliderTrack.classList.add("slider-track-mobile");
          nextSlide?.classList.add("oculto");
          prevSlide?.classList.add("oculto");
          indicadores?.classList.add("oculto");

          slides.forEach((slide) => {
            slide.classList.add("michi-slide-mobile");
          });

          return;
        }

        let currentIndex = 0;
        let visibleCards = window.matchMedia("(max-width: 600px)").matches
          ? 1
          : 2;
        const totalSlides = slides.length;

        // Función para actualizar cuántos michis mostrar
        const updateVisibleCards = () => {
          visibleCards = window.matchMedia("(max-width: 600px)").matches
            ? 1
            : 2;
          updateIndicators();
          updateSlider();
        };

        window.addEventListener("resize", updateVisibleCards);

        // Crear indicadores
        function updateIndicators() {
          indicadores.innerHTML = "";
          const totalSteps = totalSlides - visibleCards + 1;
          for (let i = 0; i < totalSteps; i++) {
            const dot = document.createElement("span");
            dot.className = "indicador-bolita-slider";
            if (i === currentIndex) dot.classList.add("activo");
            dot.addEventListener("click", () => {
              currentIndex = i;
              updateSlider();
            });
            indicadores.appendChild(dot);
          }
        }

        function updateSlider(skipTransition = false) {
          const slideWidth = slides[0].getBoundingClientRect().width + 20;
          const offset = slideWidth * currentIndex;

          if (skipTransition) {
            sliderTrack.style.transition = "none";
          } else {
            sliderTrack.style.transition = "transform 0.5s ease-in-out";
          }

          sliderTrack.style.transform = `translateX(-${offset}px)`;

          const dots = indicadores.querySelectorAll(".indicador-bolita-slider");
          dots.forEach((dot, i) =>
            dot.classList.toggle("activo", i === currentIndex)
          );
        }

        nextSlide?.addEventListener("click", () => {
          const maxIndex = totalSlides - visibleCards;
          if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
          } else {
            // animamos hasta el final
            currentIndex++;
            updateSlider();

            // después de la animación, volver sin transición
            setTimeout(() => {
              currentIndex = 0;
              updateSlider(true); // sin transición
            }, 510);
          }
        });

        prevSlide?.addEventListener("click", () => {
          const maxIndex = totalSlides - visibleCards;
          currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
          updateSlider();
        });

        sliderTrack.addEventListener("mouseenter", () =>
          clearInterval(autoScroll)
        );
        sliderTrack.addEventListener("mouseleave", () => {
          autoScroll = setInterval(() => {
            const maxIndex = totalSlides - visibleCards;
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            updateSlider();
          }, 5000);
        });

        // Inicial
        updateIndicators();
        updateSlider();
        // Iniciar scroll automático al cargar (solo escritorio)
        autoScroll = setInterval(() => {
          const maxIndex = totalSlides - visibleCards;
          currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
          updateSlider();
        }, 5000);
      });
    }
  }
  // Contador inicial del carrito
  actualizarContadorCarrito();

  // Aplicar fade-in global cuando el DOM esté listo
  document.body.classList.add("fade-in-global");
  setTimeout(() => {
    document.body.classList.add("visible");
  }, 50); // pequeño delay para que el CSS se aplique correctamente

  /*// Modo oscuro: detectar si ya estaba activado
  const preferido = localStorage.getItem("modoOscuro") === "true";
  if (preferido) document.body.classList.add("modo-oscuro");

  // Agregar listener al botón
  const botonModo = document.getElementById("modoOscuroToggle");
  if (botonModo) {
    botonModo.textContent = preferido ? "☀️ Modo claro" : "🌙 Modo oscuro";
    botonModo.addEventListener("click", () => {
      const activo = document.body.classList.toggle("modo-oscuro");
      localStorage.setItem("modoOscuro", activo);
      botonModo.textContent = activo ? "☀️ Modo claro" : "🌙 Modo oscuro";
    });
  }*/
  // FUNCIONALIDAD SWITCH OSCURO
  const switchModo = document.getElementById("modo-switch");
  const body = document.body;

  // Restaurar preferencia
  if (localStorage.getItem("modo") === "oscuro") {
    body.classList.add("modo-oscuro");
    switchModo.checked = true;
  }

  switchModo.addEventListener("change", () => {
    body.classList.toggle("modo-oscuro");
    localStorage.setItem(
      "modo",
      body.classList.contains("modo-oscuro") ? "oscuro" : "claro"
    );
  });

  // Carrusel de Lo que nos dejó cada encuentro - eventos
  (() => {
    const items = document.querySelectorAll(
      "#carruselEventos .carrusel-eventos-item"
    );
    const prevBtn = document.getElementById("prevEvento");
    const nextBtn = document.getElementById("nextEvento");
    const indicadores = document.getElementById("indicadores-eventos");
    const carrusel = document.getElementById("carruselEventos");
    const isMobile = window.innerWidth <= 600;

    if (!carrusel || items.length === 0 || !indicadores) return;

    let currentIndex = 0;
    let autoplayInterval;

    // Crear indicadores (siempre)
    items.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("indicador-bolita");
      if (i === 0) dot.classList.add("activo");
      dot.addEventListener("click", () => {
        if (isMobile) {
          items[i].scrollIntoView({ behavior: "smooth", inline: "center" });
        } else {
          irA(i);
          detenerAutoplay();
        }
      });
      indicadores.appendChild(dot);
    });

    if (isMobile) {
      // Estilos forzados en mobile
      items.forEach((item) => {
        item.style.display = "block";
        item.style.opacity = "1";
        item.style.transform = "none";
      });

      // Scroll tracking en mobile
      carrusel.addEventListener("scroll", () => {
        const scrollLeft = carrusel.scrollLeft;
        const itemWidth = carrusel.clientWidth;
        const index = Math.round(scrollLeft / itemWidth);
        [...indicadores.children].forEach((dot, i) => {
          dot.classList.toggle("activo", i === index);
        });
      });

      return; // no seguir con la lógica de escritorio
    }

    // ---- Lógica para escritorio ----
    function updateCarrusel() {
      items.forEach((item, i) => {
        item.classList.toggle("activo", i === currentIndex);
      });

      [...indicadores.children].forEach((dot, i) => {
        dot.classList.toggle("activo", i === currentIndex);
      });
    }

    function irA(index) {
      currentIndex = (index + items.length) % items.length;
      updateCarrusel();
    }

    function siguiente() {
      irA(currentIndex + 1);
    }

    function anterior() {
      irA(currentIndex - 1);
    }

    function iniciarAutoplay() {
      autoplayInterval = setInterval(siguiente, 5000);
    }

    function detenerAutoplay() {
      clearInterval(autoplayInterval);
    }

    updateCarrusel();
    iniciarAutoplay();

    prevBtn?.addEventListener("click", () => {
      anterior();
      detenerAutoplay();
    });

    nextBtn?.addEventListener("click", () => {
      siguiente();
      detenerAutoplay();
    });

    // Swipe manual (escritorio táctil)
    let startX = 0;
    carrusel.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });
    carrusel.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) siguiente();
        else anterior();
        detenerAutoplay();
      }
    });
  })();

  // Carrusel de historias
  (() => {
    const itemsHistoria = document.querySelectorAll(
      "#carruselHistorias .carrusel-item"
    );
    const prevHistoria = document.getElementById("prevHistoria");
    const nextHistoria = document.getElementById("nextHistoria");
    const indicadoresHistoria = document.getElementById(
      "indicadores-historias"
    );
    const carruselHistorias = document.getElementById("carruselHistorias");

    if (
      itemsHistoria.length > 0 &&
      prevHistoria &&
      nextHistoria &&
      indicadoresHistoria &&
      carruselHistorias
    ) {
      let currentHistoria = 0;
      let autoplay;

      itemsHistoria.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.classList.add("indicador-transito");
        if (i === 0) dot.classList.add("activo");
        dot.addEventListener("click", () => {
          currentHistoria = i;
          actualizarCarruselHistorias();
        });
        indicadoresHistoria.appendChild(dot);
      });

      const actualizarCarruselHistorias = () => {
        itemsHistoria.forEach((item, i) =>
          item.classList.toggle("activo", i === currentHistoria)
        );
        indicadoresHistoria
          .querySelectorAll(".indicador-transito")
          .forEach((dot, i) =>
            dot.classList.toggle("activo", i === currentHistoria)
          );
      };

      prevHistoria.addEventListener("click", () => {
        currentHistoria =
          (currentHistoria - 1 + itemsHistoria.length) % itemsHistoria.length;
        actualizarCarruselHistorias();
      });

      nextHistoria.addEventListener("click", () => {
        currentHistoria = (currentHistoria + 1) % itemsHistoria.length;
        actualizarCarruselHistorias();
      });

      autoplay = setInterval(() => {
        currentHistoria = (currentHistoria + 1) % itemsHistoria.length;
        actualizarCarruselHistorias();
      }, 6000);

      carruselHistorias.addEventListener("touchstart", () =>
        clearInterval(autoplay)
      );
    }
  })();
});
