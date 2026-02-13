document.addEventListener("DOMContentLoaded", () => {
  // Custom cursor
  const cursor = document.getElementById('cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    // Expand cursor on hover over interactive elements
    const hoverElements = document.querySelectorAll('a, button, .indicator, .dragme, .single-frame');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  console.clear();
  gsap.registerPlugin(ScrollTrigger);

  const slides = gsap.utils.toArray(".slide");
  const delay = 0.5;

  if (!slides.length) {
    console.warn("No se encontraron slides");
    return;
  }

  // Calcula la distancia total del scroll
  function getTotalScroll() {
    return (slides.length - 1) * window.innerHeight;
  }

  const indicators = document.querySelectorAll(".indicator");

  // Timeline principal con ScrollTrigger
  const tl = gsap.timeline({
    defaults: {
      ease: "power2.inOut",
      transformOrigin: "center center -150px"
    },
    scrollTrigger: {
      trigger: ".wrapper",
      start: "top top",
      end: () => "+=" + getTotalScroll(),
      pin: true,
      scrub: 1, // Suaviza el scroll
      markers: false,
      onUpdate: (self) => {
        const progress = self.progress;
        const index = Math.round(progress * (slides.length - 1));
        updateIndicators(index);
      }
    }
  });

  function updateIndicators(activeIndex) {
    indicators.forEach((ind, i) => {
      if (i === activeIndex) {
        ind.classList.add("active");
      } else {
        ind.classList.remove("active");
      }
    });
  }

  // Click en indicadores para scroll directo
  indicators.forEach((indicator, i) => {
    indicator.addEventListener("click", () => {
      const scrollPos = (i / (slides.length - 1)) * getTotalScroll();
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: scrollPos },
        ease: "power2.inOut"
      });
    });
  });

  // Configuración inicial de los slides
  gsap.set(slides, {
    rotationX: (i) => (i ? -90 : 0),
    transformOrigin: "center center -150px"
  });

  // Transición entre slides
  slides.forEach((slide, i) => {
    const nextSlide = slides[i + 1];
    if (!nextSlide) return;

    tl.to(slide, { rotationX: 90, onComplete: () => gsap.set(slide, { rotationX: -90 }) }, "+=" + delay)
      .to(nextSlide, { rotationX: 0 }, "<");
  });

  // Mantiene el último slide visible
  tl.to({}, { duration: delay });
  ScrollTrigger.refresh();

  // Recalcula el scroll si cambia el tamaño de pantalla
  window.addEventListener("resize", () => {
    tl.scrollTrigger.end = "+=" + getTotalScroll();
    ScrollTrigger.refresh();
  });

  // Efecto hover (mueve imágenes al pasar el ratón)
  const slideGreen = document.querySelector('.slide');
  if (slideGreen) {
    const imgTop1 = slideGreen.querySelector('.image-top1');
    const imgTop2 = slideGreen.querySelector('.image-top2');

    if (imgTop1 && imgTop2) {
      slideGreen.addEventListener('mousemove', (e) => {
        const rect = slideGreen.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const maxMove = 80;
        const normalizedX = x / rect.width;

        let moveX1 = 0;
        if (normalizedX < 0.5) moveX1 = (normalizedX - 0.5) * 2 * maxMove;

        let moveX2 = 0;
        if (normalizedX > 0.5) moveX2 = (normalizedX - 0.5) * 2 * maxMove;

        imgTop1.style.transform = `translateX(${moveX1}px)`;
        imgTop2.style.transform = `translateX(${moveX2}px)`;
      });

      slideGreen.addEventListener('mouseleave', () => {
        imgTop1.style.transform = 'translateX(0)';
        imgTop2.style.transform = 'translateX(0)';
      });
    }
  }

});

$(function () {
  // Initialize a draggable with the axis option specified.
  $(".dragme").draggable({
    axis: "x",
    containment: "parent",
    revert: true,
    revertDuration: 10,
    drag: function (e, ui) {
      var pos = ui.position;
      $(".img2").css("width", pos.left);
    },
    start: function (e, ui) {
      $(".cont").toggleClass("cover");
    },
    stop: function (e, ui) {
      $(".img2").css("width", "50%");
      $(".cont").toggleClass("cover");
    }
  });
});

