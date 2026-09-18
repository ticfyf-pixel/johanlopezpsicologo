(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const drawer = document.querySelector("[data-drawer]");
  const backdrop = document.querySelector("[data-backdrop]");
  const openBtn = document.querySelector("[data-open-menu]");
  const closeBtn = document.querySelector("[data-close-menu]");
  const header = document.querySelector(".site-header");

  function setMenu(open) {
    drawer?.classList.toggle("is-open", open);
    backdrop?.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    openBtn?.setAttribute("aria-expanded", String(open));
  }

  openBtn?.addEventListener("click", () => setMenu(true));
  closeBtn?.addEventListener("click", () => setMenu(false));
  backdrop?.addEventListener("click", () => setMenu(false));
  drawer?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
    if (reduce) return;
    const still = document.querySelector("[data-hero-still]");
    const draw = document.querySelector(".hero-draw");
    const y = window.scrollY;
    if (still) still.style.translate = `0 ${Math.min(y * 0.22, 140)}px`;
    if (draw) draw.style.translate = `0 ${Math.min(y * 0.12, 80)}px`;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!reduce) {
    const field = document.querySelector("[data-particles]");
    if (field) {
      const colors = ["#c9e265", "#f5a623", "#8b7cf7", "#7bc67e"];
      for (let i = 0; i < 28; i += 1) {
        const speckle = document.createElement("span");
        speckle.style.left = `${Math.random() * 100}%`;
        speckle.style.animationDelay = `${-Math.random() * 14}s`;
        speckle.style.animationDuration = `${10 + Math.random() * 10}s`;
        speckle.style.background = colors[i % colors.length];
        speckle.style.opacity = String(0.12 + Math.random() * 0.22);
        field.appendChild(speckle);
      }
    }
  }

  const reveal = document.querySelectorAll(".reveal");
  if (reduce) {
    reveal.forEach((el) => el.classList.add("is-in"));
  } else if (reveal.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    reveal.forEach((el) => io.observe(el));
  }

  const triad = document.querySelector("[data-triad]");
  triad?.querySelectorAll("[data-thread]").forEach((card) => {
    const light = () => {
      triad.querySelectorAll("[data-thread]").forEach((item) => item.classList.remove("is-on"));
      card.classList.add("is-on");
      triad.dataset.active = card.dataset.thread;
    };
    card.addEventListener("mouseenter", light);
    card.addEventListener("focusin", light);
  });

  const darkPane = document.querySelector(".dark-pane");
  if (darkPane && !reduce) {
    darkPane.addEventListener("mousemove", (event) => {
      const box = darkPane.getBoundingClientRect();
      darkPane.style.setProperty("--mx", `${event.clientX - box.left}px`);
      darkPane.style.setProperty("--my", `${event.clientY - box.top}px`);
    });
  }

  document.querySelectorAll("[data-accordion] button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".law");
      const open = item.classList.contains("is-open");
      document.querySelectorAll("[data-accordion] .law").forEach((el) => el.classList.remove("is-open"));
      if (!open) item.classList.add("is-open");
      button.setAttribute("aria-expanded", String(!open));
    });
  });

  const chips = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-cats]");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-on"));
      chip.classList.add("is-on");
      const value = chip.dataset.filter;
      cards.forEach((card) => {
        const show = value === "todos" || card.dataset.cats.includes(value);
        card.style.display = show ? "" : "none";
      });
    });
  });

  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    status.className = "form-status";
    status.textContent = "Enviando...";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || "No se pudo enviar.");
      status.classList.add("ok");
      status.textContent = payload.message;
      form.reset();
    } catch (error) {
      const text = [
        `Hola Johan, soy ${data.name || ""}.`,
        `Correo: ${data.email || ""}`,
        `Teléfono: ${data.phone || ""}`,
        `Asunto: ${data.subject || ""}`,
        "",
        data.message || "",
      ].join("\n");
      window.open(`https://wa.me/573104623399?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      status.classList.add("ok");
      status.textContent = "Abrí WhatsApp con tu mensaje para que la conversación quede en el canal más directo.";
    }
  });
})();
