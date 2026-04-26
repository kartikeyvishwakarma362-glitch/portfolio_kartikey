const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll(".tilt-card");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const cursorGlow = document.querySelector(".cursor-glow");
const typingText = document.getElementById("typing-text");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const skillsSection = document.getElementById("skills");

const tagline = "UX Designer | Creative Thinker | Problem Solver";

menuBtn?.addEventListener("click", () => {
  const isOpen = navLinks?.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks?.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

const setActiveNav = () => {
  const y = window.scrollY + 140;
  let active = "home";
  sections.forEach((section) => {
    if (y >= section.offsetTop && y < section.offsetTop + section.offsetHeight) active = section.id;
  });
  navItems.forEach((item) => item.classList.toggle("active", item.getAttribute("href") === `#${active}`));
};
window.addEventListener("scroll", setActiveNav, { passive: true });
setActiveNav();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
    });
  },
  { threshold: 0.15 }
);
revealItems.forEach((item) => revealObserver.observe(item));

const skillObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("skills-animated");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 }
);
if (skillsSection) skillObserver.observe(skillsSection);

let index = 0;
const typeTagline = () => {
  if (!typingText) return;
  if (index <= tagline.length) {
    typingText.textContent = tagline.slice(0, index);
    index += 1;
    setTimeout(typeTagline, 55);
  }
};
typeTagline();

window.addEventListener("mousemove", (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

window.addEventListener(
  "scroll",
  () => {
    const scrollY = window.scrollY;
    parallaxItems.forEach((item) => {
      const speed = Number(item.getAttribute("data-parallax")) || 0;
      item.style.transform = `translateY(${scrollY * speed}px)`;
    });
  },
  { passive: true }
);

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = (0.5 - (y / rect.height)) * 10;
    card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    card.style.transition = "transform 0.08s linear";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
    card.style.transition = "transform 0.25s ease";
  });
});

const validators = {
  name: (value) => (value.trim().length >= 2 ? "" : "Please enter your name."),
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Please enter a valid email.",
  message: (value) => (value.trim().length >= 10 ? "" : "Message must be at least 10 characters."),
};

const showError = (field, message) => {
  const next = field.nextElementSibling;
  field.classList.toggle("error", Boolean(message));
  if (next) next.textContent = message;
};

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!formStatus) return;
  let hasError = false;
  ["name", "email", "message"].forEach((name) => {
    const field = contactForm.elements[name];
    const message = validators[name](field.value || "");
    showError(field, message);
    if (message) hasError = true;
  });
  if (hasError) {
    formStatus.textContent = "Fix highlighted fields and try again.";
    formStatus.style.color = "#ff6f8a";
    return;
  }
  formStatus.textContent = "Message ready. Connect this form with backend/email service.";
  formStatus.style.color = "#00f5ff";
  contactForm.reset();
});

const particleCanvas = document.getElementById("global-particles");
if (particleCanvas) {
  const ctx = particleCanvas.getContext("2d");
  const particles = [];
  const count = 90;

  const makeParticles = () => {
    particles.length = 0;
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        size: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }
  };

  const resizeCanvas = () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    makeParticles();
  };

  const render = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -2 || p.x > particleCanvas.width + 2) p.vx *= -1;
      if (p.y < -2 || p.y > particleCanvas.height + 2) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(34, 211, 238, 0.55)";
      ctx.shadowBlur = 12;
      ctx.shadowColor = "rgba(139, 92, 246, 0.7)";
      ctx.fill();
    });
    requestAnimationFrame(render);
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  render();
}
