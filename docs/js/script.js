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

  // Mostrar contador real de michis en index.html solo cuando se vea en pantalla
  if (location.pathname.includes("index")) {
    const contador = document.getElementById("contador-michis");
    const total = parseInt(localStorage.getItem("totalMichis") || "0");

    if (!contador) return;

    if (total === 0) {
      contador.textContent = "0";
      return;
    }

    let activado = false;

    const animarContador = () => {
      let actual = 0;
      const duracion = 4000; // 4 segundos
      const pasos = 20;
      const incremento = Math.ceil(total / pasos);
      const intervalo = duracion / pasos;

      const intervaloID = setInterval(() => {
        actual += incremento;
        if (actual >= total) {
          contador.textContent = total;
          clearInterval(intervaloID);
        } else {
          contador.textContent = actual;
        }
      }, intervalo);
    };

    const observer = new IntersectionObserver(
      (entries, observer) => {
        if (entries[0].isIntersecting && !activado) {
          activado = true;
          animarContador();
          observer.disconnect(); // solo se ejecuta una vez
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(contador);
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
            errorMensaje.classList.add("visible");
          }
        } else {
          if (isMensaje) {
            errorMensaje.textContent = "";
            errorMensaje.classList.remove("visible");
          }
        }
      });

      if (hayError) {
        e.preventDefault();
      } else {
        const mensajeGracias = document.getElementById("gracias-envio");
        if (mensajeGracias) {
          mensajeGracias.style.display = "block";
          setTimeout(() => {
            mensajeGracias.style.display = "none";
          }, 5000);
        }
      }
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
      const estaActivo = navLista.classList.toggle("activa");
      menuToggle.setAttribute("aria-pressed", estaActivo);
    });
  }

  // Cierra el menú cuando se hace clic en un enlace (solo en mobile)
  document.querySelectorAll(".nav-lista a").forEach((enlace) => {
    enlace.addEventListener("click", () => {
      const navLista = document.querySelector(".nav-lista");
      const menuToggle = document.querySelector(".menu-toggle");

      if (navLista.classList.contains("activa")) {
        navLista.classList.remove("activa");
        menuToggle?.setAttribute("aria-pressed", "false");
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
    const indicadores = document.getElementById("indicadores-slider-transito");
    const carrusel = document.getElementById("carruselTransito");
    if (!carrusel) return;
    if (carruselItems.length > 0 && indicadores) {
      let currentIndex = 0;
      let autoplayActivo = true;
      let intervaloAutoplay;

      // Crear indicadores
      carruselItems.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.classList.add("indicador-bolita-transito");
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
          .querySelectorAll(".indicador-bolita-transito")
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
      updateCarrusel();
    }
  })();

  // Animaciones por scroll
  const elementosAnimados = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // para que se ejecute solo una vez
        }
      });
    },
    { threshold: 0.1 }
  );
  elementosAnimados.forEach((el) => observer.observe(el));

  // Carrusel "Últimos rescatados"
  (() => {
    const slider = document.getElementById("sliderTrackUltimos");
    const slides = document.querySelectorAll(".michi-slide-ultimos");
    const prev = document.getElementById("prevRescatados");
    const next = document.getElementById("nextRescatados");
    const indicadores = document.getElementById(
      "indicadores-slider-rescatados"
    );

    if (!slider || !slides.length || !prev || !next || !indicadores) return;

    let current = 0;
    let autoplay;
    let reinicio;

    const esMobile = window.innerWidth <= 600;

    const actualizar = () => {
      const dotElements = indicadores.querySelectorAll(
        ".indicador-bolita-ultimos"
      );

      if (esMobile) {
        // Solo hacer scrollIntoView si el carrusel está visible
        const rectSlider = slider.getBoundingClientRect();
        const visible =
          rectSlider.top >= 0 &&
          rectSlider.bottom <=
            (window.innerHeight || document.documentElement.clientHeight);

        if (visible) {
          slides[current].scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        }

        dotElements.forEach((dot, i) =>
          dot.classList.toggle("activo", i === current)
        );
      } else {
        const slideWidth = slides[0].offsetWidth + 20;
        slider.style.transform = `translateX(-${current * slideWidth}px)`;

        dotElements.forEach((dot, i) =>
          dot.classList.toggle("activo", i === current)
        );
      }
    };

    const avanzar = () => {
      current = (current + 1) % slides.length;
      actualizar();
    };

    const retroceder = () => {
      current = (current - 1 + slides.length) % slides.length;
      actualizar();
    };

    const pausarYReanudar = () => {
      clearInterval(autoplay);
      clearTimeout(reinicio);
      reinicio = setTimeout(() => {
        autoplay = setInterval(avanzar, 5000);
      }, 6000);
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
    for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement("span");
      dot.className = "indicador-bolita-ultimos";
      if (i === 0) dot.classList.add("activo");
      dot.addEventListener("click", () => {
        current = i;
        if (esMobile) {
          slides[i].scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        } else {
          actualizar(); // solo usa transform en PC
        }
        pausarYReanudar();
      });

      indicadores.appendChild(dot);
    }

    autoplay = setInterval(avanzar, 5000);
    actualizar();
    // En mobile, actualizar la bolita activa al hacer scroll manual
    // En mobile, actualizar la bolita activa al hacer scroll manual
    if (esMobile) {
      slider.addEventListener("scroll", () => {
        let indexVisible = 0;
        let minDist = Infinity;
        const centroPantalla = window.innerWidth / 2;

        slides.forEach((slide, i) => {
          const rect = slide.getBoundingClientRect();
          const centroSlide = rect.left + rect.width / 2;
          const dist = Math.abs(centroSlide - centroPantalla);
          if (dist < minDist) {
            minDist = dist;
            indexVisible = i;
          }
        });

        if (indexVisible !== current) {
          current = indexVisible;
          indicadores
            .querySelectorAll(".indicador-bolita-ultimos")
            .forEach((dot, i) => dot.classList.toggle("activo", i === current));
        }
      });
    }
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

  // Carrusel "Lo que nos dejó cada encuentro" - eventos.html
  (() => {
    const carruselItems = document.querySelectorAll(
      "#carruselEventos .carrusel-eventos-item"
    );
    const prevBtn = document.getElementById("prevTestimonioEvento");
    const nextBtn = document.getElementById("nextTestimonioEvento");
    const indicadores = document.getElementById("indicadores-eventos");
    const carrusel = document.getElementById("carruselEventos");

    if (!carrusel || carruselItems.length === 0 || !indicadores) return;

    let currentIndexEvento = 0;
    let intervaloAutoplayEvento;
    let reinicioAutoplayEvento;

    // Crear bolitas
    carruselItems.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("indicador-bolita-eventos");
      if (i === 0) dot.classList.add("activo");
      dot.addEventListener("click", () => {
        currentIndexEvento = i;
        updateCarruselEventos();
        detenerAutoplayEvento();
      });
      indicadores.appendChild(dot);
    });

    const updateCarruselEventos = () => {
      carruselItems.forEach((item, i) =>
        item.classList.toggle("activo", i === currentIndexEvento)
      );
      indicadores
        .querySelectorAll(".indicador-bolita-eventos")
        .forEach((dot, i) =>
          dot.classList.toggle("activo", i === currentIndexEvento)
        );
    };

    const avanzarEvento = () => {
      currentIndexEvento = (currentIndexEvento + 1) % carruselItems.length;
      updateCarruselEventos();
    };

    const iniciarAutoplayEvento = () => {
      intervaloAutoplayEvento = setInterval(avanzarEvento, 8000);
    };

    const detenerAutoplayEvento = () => {
      clearInterval(intervaloAutoplayEvento);
      clearTimeout(reinicioAutoplayEvento);
      reinicioAutoplayEvento = setTimeout(() => {
        iniciarAutoplayEvento();
      }, 6000); // se reactiva después de 6 segundos sin interacción
    };

    prevBtn?.addEventListener("click", () => {
      currentIndexEvento =
        (currentIndexEvento - 1 + carruselItems.length) % carruselItems.length;
      updateCarruselEventos();
      detenerAutoplayEvento();
    });

    nextBtn?.addEventListener("click", () => {
      currentIndexEvento = (currentIndexEvento + 1) % carruselItems.length;
      updateCarruselEventos();
      detenerAutoplayEvento();
    });

    // Swipe en celulares
    let startXEvento = 0;
    carrusel.addEventListener("touchstart", (e) => {
      startXEvento = e.touches[0].clientX;
    });

    carrusel.addEventListener("touchend", (e) => {
      const deltaX = e.changedTouches[0].clientX - startXEvento;
      if (Math.abs(deltaX) > 50) {
        if (deltaX < 0) {
          nextBtn?.click();
        } else {
          prevBtn?.click();
        }
      }
      detenerAutoplayEvento();
    });

    if (carruselItems.length > 1) iniciarAutoplayEvento();

    updateCarruselEventos();
  })();

  // Carrusel "De la calle al sillón" - historias.html
  (() => {
    const items = document.querySelectorAll(
      "#carruselHistorias .carrusel-historias-item"
    );
    const prevBtn = document.getElementById("prevHistoria");
    const nextBtn = document.getElementById("nextHistoria");
    const indicadores = document.getElementById("indicadores-historias");
    const carrusel = document.getElementById("carruselHistorias");

    if (!carrusel || items.length === 0 || !indicadores) return;

    let currentIndex = 0;
    let autoplayInterval;
    let autoplayTimeout;

    // Crear bolitas
    items.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("indicador-transito");
      if (i === 0) dot.classList.add("activo");
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateCarrusel();
        detenerYReiniciarAutoplay();
      });
      indicadores.appendChild(dot);
    });

    const updateCarrusel = () => {
      const isMobile = window.innerWidth <= 768;

      items.forEach((item, i) => {
        item.classList.toggle("activo", isMobile || i === currentIndex);
      });

      indicadores.querySelectorAll(".indicador-transito").forEach((dot, i) => {
        dot.classList.toggle("activo", i === currentIndex);
      });
    };

    const avanzar = () => {
      currentIndex = (currentIndex + 1) % items.length;
      updateCarrusel();
    };

    const iniciarAutoplay = () => {
      autoplayInterval = setInterval(avanzar, 8000);
    };

    const detenerYReiniciarAutoplay = () => {
      if (autoplayInterval) clearInterval(autoplayInterval);
      clearTimeout(autoplayTimeout);
      autoplayTimeout = setTimeout(() => {
        iniciarAutoplay();
      }, 6000);
    };

    // Flechas
    prevBtn?.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateCarrusel();
      detenerYReiniciarAutoplay();
    });

    nextBtn?.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % items.length;
      updateCarrusel();
      detenerYReiniciarAutoplay();
    });

    // Swipe para celulares
    let startX = 0;
    carrusel.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    carrusel.addEventListener("touchend", (e) => {
      const desplazamientoX = e.changedTouches[0].clientX - startX;
      if (Math.abs(desplazamientoX) > 50) {
        if (desplazamientoX < 0) nextBtn?.click();
        else prevBtn?.click();
      }
      detenerYReiniciarAutoplay();
    });

    if (items.length > 1) iniciarAutoplay();
    updateCarrusel();
  })();
});
