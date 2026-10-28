const WHATSAPP_NUMBER = "51937562378";

// Header background once the user scrolls past the hero top.
const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Mobile menu.
const toggle = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu");
const setMenu = (open) => {
  menu.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
};
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });

// Scroll reveal.
const revealed = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  revealed.forEach((el) => io.observe(el));
} else {
  revealed.forEach((el) => el.classList.add("visible"));
}

// Path CTAs preselect the client type in the quote form.
document.querySelectorAll("[data-client]").forEach((link) => {
  link.addEventListener("click", () => {
    const radio = document.querySelector(`input[name="client"][value="${link.dataset.client}"]`);
    if (radio) radio.checked = true;
  });
});

// Quote form -> prefilled WhatsApp message.
const form = document.getElementById("quote-form");
const errorBox = form.querySelector(".form-error");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const required = ["name", "client", "type", "location"];
  const missing = required.filter((key) => !String(data.get(key) || "").trim());

  form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  missing.forEach((key) => {
    form.querySelectorAll(`[name="${key}"]`).forEach((el) => {
      if (el.type !== "radio") el.classList.add("invalid");
    });
  });
  errorBox.hidden = missing.length === 0;
  if (missing.length) {
    form.querySelector(`[name="${missing[0]}"]`).focus();
    return;
  }

  const lines = [
    "Hola ANCA, quiero cotizar un proyecto.",
    `• Nombre: ${data.get("name").trim()}`,
    `• Cliente: ${data.get("client")}`,
    `• Proyecto: ${data.get("type")}`,
    `• Ubicación: ${data.get("location").trim()}`,
    `• Inicio: ${data.get("when")}`,
  ];
  const message = String(data.get("message") || "").trim();
  if (message) lines.push(`• Detalle: ${message}`);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
});

// Lightbox for real project photos and designs.
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.hidden = true;
lightbox.setAttribute("role", "dialog");
lightbox.setAttribute("aria-modal", "true");
lightbox.innerHTML = '<button type="button" aria-label="Cerrar">×</button><figure><img alt="" /><p></p></figure>';
document.body.append(lightbox);
const closeLightbox = () => { lightbox.hidden = true; };
lightbox.addEventListener("click", (e) => { if (e.target.tagName !== "IMG") closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
document.querySelectorAll(".work-gallery img, .designs img").forEach((img) => {
  img.tabIndex = 0;
  const open = () => {
    lightbox.querySelector("img").src = img.src;
    lightbox.querySelector("img").alt = img.alt;
    lightbox.querySelector("p").textContent = img.alt;
    lightbox.hidden = false;
    lightbox.querySelector("button").focus();
  };
  img.addEventListener("click", open);
  img.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
});

document.getElementById("year").textContent = new Date().getFullYear();
