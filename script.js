// ============================================================
// Ende des Countdowns in deutscher Sommerzeit (+02:00), damit er
// überall auf der Welt zur selben Zeit abläuft.
// Format: "JJJJ-MM-TTTHH:MM:SS+02:00"
// ============================================================
const FEST_DATUM = new Date("2027-07-23T19:00:00+02:00");

// ---------- Countdown ----------
(function countdown() {
  const els = {
    tage: document.getElementById("cd-tage"),
    stunden: document.getElementById("cd-stunden"),
    minuten: document.getElementById("cd-minuten"),
    sekunden: document.getElementById("cd-sekunden"),
  };
  if (!els.tage) return;

  const pad = (n) => String(n).padStart(2, "0");

  function tick() {
    const diff = FEST_DATUM - new Date();
    if (diff <= 0) {
      const ende = new Date("2027-07-27T00:00:00");
      const text = new Date() < ende ? "🎉 Wir feiern – kommt vorbei! 🎉" : "Danke, dass ihr mitgefeiert habt!";
      document.querySelector(".countdown").innerHTML =
        `<p style="font-size:1.5rem;margin:0">${text}</p>`;
      clearInterval(timer);
      return;
    }
    const s = Math.floor(diff / 1000);
    els.tage.textContent = Math.floor(s / 86400);
    els.stunden.textContent = pad(Math.floor((s % 86400) / 3600));
    els.minuten.textContent = pad(Math.floor((s % 3600) / 60));
    els.sekunden.textContent = pad(s % 60);
  }
  const timer = setInterval(tick, 1000);
  tick();
})();

// ---------- Navigation ----------
(function nav() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  if (!nav) return;

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    });
    nav.querySelectorAll(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }
})();

// ---------- Konfetti im Kopfbereich ----------
(function confetti() {
  const box = document.querySelector(".hero__confetti");
  if (!box || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#ed1c24", "#ed1c24", "#1d1d1f", "#c7c7c7", "#7a0a0a"];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "%";
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 6 + Math.random() * 8 + "s";
    c.style.animationDelay = -Math.random() * 14 + "s";
    c.style.transform = `rotate(${Math.random() * 360}deg)`;
    box.appendChild(c);
  }
})();

// ---------- Sanftes Einblenden der Abschnitte ----------
(function reveal() {
  const items = document.querySelectorAll(".section__title, .section__lead, .day, .club, .highlight > *, details, .form, .grid-2 > *");
  if (!("IntersectionObserver" in window)) return;
  items.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
})();

// ---------- Formular "Ticket-Info" ----------
(function form() {
  const form = document.querySelector("form[name='ticket-info']");
  if (!form) return;
  const status = form.querySelector(".form__status");
  const btn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form__status";
    status.textContent = "Wird gesendet …";
    btn.disabled = true;
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error(res.status);
      status.classList.add("is-ok");
      status.textContent = "Danke! Wir melden uns, sobald es Tickets gibt. 🎺⚽";
      form.reset();
    } catch (err) {
      status.classList.add("is-error");
      status.textContent = "Das hat leider nicht geklappt. Bitte versuch es später noch einmal oder schreib an info@jubilaeum2027.de.";
    } finally {
      btn.disabled = false;
    }
  });
})();
