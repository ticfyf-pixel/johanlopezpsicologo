(function () {
  const drawer = document.querySelector("[data-drawer]");
  const backdrop = document.querySelector("[data-backdrop]");
  const openBtn = document.querySelector("[data-open-menu]");
  const closeBtn = document.querySelector("[data-close-menu]");

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
