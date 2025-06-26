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
    const total = parseInt(localStorage.getItem("totalMichis") || "0");

    if (contador && total > 0) {
      let actual = 0;
      const duracion = 4000; // 4 segundoS total
      const pasos = 20;
      const incremento = Math.ceil(total / pasos);
      const intervalo = duracion / pasos;

      const animarContador = setInterval(() => {
        actual += incremento;
        if (actual >= total) {
          contador.textContent = total;
          clearInterval(animarContador);
        } else {
          contador.textContent = actual;
        }
      }, intervalo);
    } else if (contador) {
      contador.textContent = "0";
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
  (() => {
    const slider = document.getElementById("sliderTrackUltimos");
    const slides = document.querySelectorAll(".michi-slide-ultimos");
    const prev = document.getElementById("prevRescatados");
    const next = document.getElementById("nextRescatados");
    const indicadores = document.getElementById("indicadores-slider");

    if (!slider || !slides.length || !prev || !next || !indicadores) return;

    let current = 0;
    let visible = 2;
    let autoplay;
    let reinicio; // 👈 importante

    const actualizar = () => {
      const slideWidth = slides[0].offsetWidth + 20;
      slider.style.transform = `translateX(-${current * slideWidth}px)`;
      indicadores
        .querySelectorAll(".indicador-bolita-ultimos")
        .forEach((dot, i) => dot.classList.toggle("activo", i === current));
    };

    const avanzar = () => {
      current = (current + 1) % (slides.length - visible + 1);
      actualizar();
    };

    const retroceder = () => {
      current =
        (current - 1 + (slides.length - visible + 1)) %
        (slides.length - visible + 1);
      actualizar();
    };

    const pausarYReanudar = () => {
      clearInterval(autoplay);
      clearTimeout(reinicio);
      reinicio = setTimeout(() => {
        autoplay = setInterval(avanzar, 5000);
      }, 6000); // ⏱️ vuelve a activarse luego de 6 segundos
    };

    prev.addEventListener("click", () => {
      retroceder();
      pausarYReanudar();
    });

    next.addEventListener("click", () => {
      avanzar();
      pausarYReanudar();
    });

    // Crear bolitas
    const total = slides.length - visible + 1;
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("span");
      dot.className = "indicador-bolita-ultimos";
      if (i === 0) dot.classList.add("activo");
      dot.addEventListener("click", () => {
        current = i;
        actualizar();
        pausarYReanudar();
      });
      indicadores.appendChild(dot);
    }

    autoplay = setInterval(avanzar, 5000);
    actualizar();
  })();

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
  //carrusel historas de la calle al sillon
  (() => {
    const items = document.querySelectorAll(
      "#carruselHistorias .carrusel-item"
    );
    const prev = document.getElementById("prevHistoria");
    const next = document.getElementById("nextHistoria");
    const indicadores = document.getElementById("indicadores-historias");
    const carrusel = document.getElementById("carruselHistorias");

    if (!items.length || !carrusel || !indicadores) return;

    let index = 0;
    let autoplay;
    let startX = 0;

    const esEscritorio = window.innerWidth > 768;

    // Crear bolitas
    items.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("indicador-transito");
      if (i === 0) dot.classList.add("activo");
      dot.addEventListener("click", () => {
        index = i;
        actualizar();
      });
      indicadores.appendChild(dot);
    });

    const actualizar = () => {
      items.forEach((item, i) => {
        if (esEscritorio) {
          item.classList.toggle("activo", i === index);
        } else {
          item.classList.add("activo"); // mostrar todos en móvil
        }
      });

      indicadores.querySelectorAll(".indicador-transito").forEach((dot, i) => {
        dot.classList.toggle("activo", i === index);
      });
    };

    // Flechas en escritorio
    if (esEscritorio) {
      prev?.addEventListener("click", () => {
        index = (index - 1 + items.length) % items.length;
        actualizar();
      });

      next?.addEventListener("click", () => {
        index = (index + 1) % items.length;
        actualizar();
      });

      autoplay = setInterval(() => {
        index = (index + 1) % items.length;
        actualizar();
      }, 6000);
    }

    // Swipe en móvil
    if (!esEscritorio) {
      carrusel.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
      });

      carrusel.addEventListener("touchend", (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (diff > 50) {
          index = (index + 1) % items.length;
          actualizar();
        } else if (diff < -50) {
          index = (index - 1 + items.length) % items.length;
          actualizar();
        }
      });
    }

    actualizar();
  })();
});
