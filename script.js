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

// ---------- Fun Fact unter dem Logo: Fußballspiel + Blaskapelle ----------
// Alles wird hier als SVG gezeichnet und per requestAnimationFrame bewegt.
// Mit „Bewegung reduzieren“ (Betriebssystem) bleibt das Bild stehen.
(function festStreifen() {
  const box = document.querySelector(".hero__fun");
  if (!box) return;

  const NS = "http://www.w3.org/2000/svg";
  const C = { rot: "#ed1c24", ink: "#1d1d1f", haut: "#eab48c", wein: "#7a0a0a", gold: "#d9a514", linie: "#d9d9d9" };
  const BODEN_FELD = 100; // Boden der Fußballer (hinten)
  const BODEN_ZUG = 126;  // Boden der Blaskapelle (vorne)

  const el = (tag, attrs = {}, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  const line = (p, x1, y1, x2, y2, stroke = C.ink, w = 3) =>
    el("line", { x1, y1, x2, y2, stroke, "stroke-width": w, "stroke-linecap": "round" }, p);
  const rot = (n, deg, cx, cy) => n.setAttribute("transform", `rotate(${deg} ${cx} ${cy})`);
  const move = (n, x, y, extra = "") => n.setAttribute("transform", `translate(${x} ${y})${extra}`);

  const svg = el("svg", { viewBox: "0 0 800 132", "aria-hidden": "true", focusable: "false" });
  box.appendChild(svg);

  // Spielfeld, Tor, Straße
  line(svg, 110, BODEN_FELD + 1, 800, BODEN_FELD + 1, C.linie, 2);
  const tor = el("g", {}, svg);
  for (let i = 0; i < 5; i++) line(tor, 752 + i * 9, 66, 752 + i * 9, BODEN_FELD, C.linie, 1);
  for (let i = 0; i < 4; i++) line(tor, 748, 70 + i * 8, 792, 70 + i * 8, C.linie, 1);
  line(tor, 748, 66, 748, BODEN_FELD, C.ink, 3);
  line(tor, 748, 66, 792, 66, C.ink, 3);
  line(svg, 0, BODEN_ZUG + 1, 800, BODEN_ZUG + 1, C.linie, 2);
  const torText = el("text", { x: 700, y: 52, "text-anchor": "middle", fill: C.rot, "font-size": 22, "font-family": "Bebas Neue, Impact, sans-serif", "letter-spacing": 2, opacity: 0 }, svg);
  torText.textContent = "TOR!";

  // Fußballer (Ursprung = Füße, blickt nach rechts; dir = -1 spiegelt)
  function spieler(x, trikot, dir) {
    const pos = el("g", {}, svg);
    move(pos, x, BODEN_FELD);
    const body = el("g", { transform: dir < 0 ? "scale(-1 1)" : "" }, pos);
    const inner = el("g", {}, body);
    const standbein = line(inner, -2, -15, -4, 0);
    const schussbein = line(inner, 2, -15, 4, 0);
    el("rect", { x: -5.5, y: -19, width: 11, height: 6, rx: 2, fill: C.ink }, inner);
    el("rect", { x: -5.5, y: -31, width: 11, height: 14, rx: 3, fill: trikot }, inner);
    const armL = line(inner, -5, -28, -9, -19);
    const armR = line(inner, 5, -28, 9, -19);
    el("circle", { cx: 0, cy: -36, r: 5, fill: C.haut }, inner);
    return { pos, inner, standbein, schussbein, armL, armR, x };
  }

  const p1 = spieler(170, C.rot, 1);
  const p2 = spieler(320, C.rot, 1);
  const p3 = spieler(470, C.rot, 1);
  const verteidiger = spieler(605, C.ink, -1);
  const torwart = spieler(740, C.ink, -1);

  const ballG = el("g", {}, svg);
  const ball = el("g", {}, ballG);
  el("circle", { cx: 0, cy: 0, r: 4, fill: "#fff", stroke: C.ink, "stroke-width": 1.5 }, ball);
  el("path", { d: "M-1.5 -1.5h3v3h-3z", fill: C.ink }, ball);

  // Ballweg: [start, ende, x0, x1, höhe, y0, y1] – Zeiten als Anteil vom Takt
  const TAKT_FELD = 9; // Sekunden
  const wege = [
    [0.04, 0.18, 178, 328, 16, 0, 0],
    [0.22, 0.36, 328, 478, 16, 0, 0],
    [0.40, 0.52, 478, 772, 34, 0, -14],
    [0.52, 0.56, 772, 778, 0, -14, 0],
    [0.72, 0.96, 778, 178, 55, 0, 0],
  ];
  const tritte = [[p1, 0.04], [p2, 0.22], [p3, 0.40]];

  function feld(t) {
    const u = (t / TAKT_FELD) % 1;
    const s = u * TAKT_FELD;

    // Ball
    let bx = 178, by = 0;
    for (let i = 0; i < wege.length; i++) {
      const [a, b, x0, x1, h, y0, y1] = wege[i];
      if (u >= a && u < b) {
        const k = (u - a) / (b - a);
        bx = x0 + (x1 - x0) * k;
        by = y0 + (y1 - y0) * k - 4 * h * k * (1 - k);
        break;
      }
      if (u >= b) { bx = x1; by = y1; }
    }
    if (u < wege[0][0]) { bx = 178; by = 0; }
    move(ballG, bx, BODEN_FELD - 4 + by);
    rot(ball, bx * 4, 0, 0);

    // Spieler wippen leicht, Schuss mit Ausholen
    for (const p of [p1, p2, p3, verteidiger, torwart]) {
      move(p.inner, 0, -Math.abs(Math.sin((s + p.x) * 5)) * 1.5);
      rot(p.schussbein, 0, 2, -15);
      rot(p.armL, Math.sin((s + p.x) * 5) * 10, -5, -28);
      rot(p.armR, -Math.sin((s + p.x) * 5) * 10, 5, -28);
    }
    for (const [p, k] of tritte) {
      const d = s - k * TAKT_FELD;
      let w = 0;
      if (d > -0.3 && d <= 0) w = 45 * (1 + d / 0.3);
      else if (d > 0 && d <= 0.15) w = 45 - 110 * (d / 0.15);
      else if (d > 0.15 && d <= 0.45) w = -65 * (1 - (d - 0.15) / 0.3);
      rot(p.schussbein, w, 2, -15);
    }

    // Verteidiger springt (zu spät) nach dem hohen Ball
    const vj = (u - 0.43) / 0.07;
    move(verteidiger.pos, verteidiger.x, BODEN_FELD - (vj > 0 && vj < 1 ? Math.sin(vj * Math.PI) * 14 : 0));

    // Torwart hechtet daneben, steht wieder auf und wirft den Ball zurück
    const td = (u - 0.47) / 0.08;
    let tr = 0, ty = 0;
    if (td > 0 && td < 1) { tr = -60 * td; ty = -Math.sin(td * Math.PI) * 10; }
    else if (u >= 0.55 && u < 0.66) tr = -60 * (1 - (u - 0.55) / 0.11);
    move(torwart.pos, torwart.x + (td > 0 && u < 0.66 ? 6 : 0), BODEN_FELD + ty, tr ? ` rotate(${tr} 0 -15)` : "");
    if (u > 0.68 && u < 0.74) { rot(torwart.armL, 150, -5, -28); rot(torwart.armR, 160, 5, -28); }

    // „TOR!“
    torText.setAttribute("opacity", u > 0.53 && u < 0.7 ? 1 : 0);
  }

  // Blaskapelle (Ursprung = Füße, marschiert nach rechts)
  const zug = el("g", {}, svg);
  function musiker(x, instrument) {
    const pos = el("g", {}, zug);
    move(pos, x, BODEN_ZUG);
    const inner = el("g", {}, pos);
    const beinA = line(inner, 0, -16, 0, 0);
    const beinB = line(inner, 0, -16, 0, 0);
    // Instrumente hinter dem Körper
    let extra = {};
    if (instrument === "tuba") {
      el("circle", { cx: -4, cy: -30, r: 9, fill: "none", stroke: C.gold, "stroke-width": 3 }, inner);
      el("ellipse", { cx: -7, cy: -43, rx: 9, ry: 3.5, fill: C.gold }, inner);
    }
    el("rect", { x: -5.5, y: -32, width: 11, height: 17, rx: 3, fill: C.wein }, inner);
    el("circle", { cx: 0, cy: -37, r: 5, fill: C.haut }, inner);
    el("rect", { x: -4.5, y: -49, width: 9, height: 8, rx: 1, fill: C.ink }, inner);
    el("circle", { cx: 0, cy: -50, r: 2.2, fill: C.rot }, inner);

    if (instrument === "stab") {
      const arm = el("g", {}, inner);
      line(arm, 0, -29, 8, -29);
      line(arm, 8, -29, 8, -50, C.gold, 2);
      el("circle", { cx: 8, cy: -51, r: 2.5, fill: C.gold }, arm);
      extra.arm = arm;
    } else if (instrument === "trompete") {
      line(inner, 0, -28, 8, -35);
      line(inner, 4, -36, 15, -36, C.gold, 2.5);
      el("path", { d: "M15 -39 L20 -41 L20 -31 L15 -33 Z", fill: C.gold }, inner);
    } else if (instrument === "posaune") {
      line(inner, 0, -28, 6, -35);
      line(inner, 3, -37, 16, -37, C.gold, 2);
      el("path", { d: "M16 -40 L21 -42 L21 -32 L16 -34 Z", fill: C.gold }, inner);
      const zugrohr = el("g", {}, inner);
      line(zugrohr, 6, -35, 24, -35, C.gold, 2);
      line(zugrohr, 24, -35, 24, -31, C.gold, 2);
      const hand = line(zugrohr, 0, -27, 22, -31);
      extra.zug = zugrohr; extra.hand = hand;
    } else if (instrument === "klarinette") {
      line(inner, 0, -28, 7, -28);
      line(inner, 3, -36, 14, -22, C.ink, 2);
      el("circle", { cx: 14, cy: -22, r: 2, fill: C.ink }, inner);
    } else if (instrument === "tuba") {
      line(inner, 0, -28, 7, -25);
    } else if (instrument === "trommel") {
      el("ellipse", { cx: 9, cy: -23, rx: 5, ry: 11, fill: "#fff", stroke: C.rot, "stroke-width": 2.5 }, inner);
      const schlegel = el("g", {}, inner);
      line(schlegel, 0, -29, 12, -29);
      el("circle", { cx: 15, cy: -29, r: 2.5, fill: C.ink }, schlegel);
      extra.schlegel = schlegel;
    }
    return { pos, inner, beinA, beinB, x, ...extra };
  }

  const ABSTAND = 40;
  const kapelle = ["stab", "trompete", "posaune", "klarinette", "tuba", "trommel"].map(
    (inst, i) => musiker(-i * ABSTAND, inst)
  );

  // Noten über der Kapelle
  const noten = [0, 1, 2, 3].map((i) => {
    const n = el("text", { "font-size": 14, fill: C.rot, "font-family": "serif" }, zug);
    n.textContent = i % 2 ? "♫" : "♪";
    return n;
  });

  const ZUG_DAUER = 28; // Sekunden für einmal durchs Bild
  function kapelleBewegen(t) {
    const u = (t / ZUG_DAUER) % 1;
    const zx = -40 + u * (800 + 40 + kapelle.length * ABSTAND);
    move(zug, zx, 0);

    const schritt = t * Math.PI * 2 * 0.9; // ~1,8 Schritte pro Sekunde
    kapelle.forEach((m) => {
      const w = Math.sin(schritt) * 22;
      rot(m.beinA, w, 0, -16);
      rot(m.beinB, -w, 0, -16);
      move(m.inner, 0, -Math.abs(Math.cos(schritt)) * 2);
      if (m.arm) rot(m.arm, Math.sin(schritt) * 15, 0, -29);
      if (m.zug) move(m.zug, (Math.sin(schritt * 0.5) + 1) * 4, 0);
      if (m.schlegel) rot(m.schlegel, Math.max(0, Math.sin(schritt)) * -40, 0, -29);
    });

    noten.forEach((n, i) => {
      const k = (t * 0.5 + i / noten.length) % 1;
      const nx = -i * ABSTAND * 1.3 + 4 + Math.sin(k * 6 + i) * 4;
      n.setAttribute("x", nx);
      n.setAttribute("y", BODEN_ZUG - 58 - k * 26);
      n.setAttribute("opacity", Math.sin(k * Math.PI).toFixed(2));
    });
  }

  function zeichne(t) {
    feld(t);
    kapelleBewegen(t);
  }

  // Ohne Bewegung: ein schönes Standbild (Kapelle mitten im Bild)
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    zeichne(ZUG_DAUER * 0.45);
    return;
  }

  // Läuft nur, solange der Streifen zu sehen ist (spart Akku)
  let sichtbar = true, laeuft = false;
  const start = performance.now();
  function schleife(now) {
    zeichne((now - start) / 1000 + ZUG_DAUER * 0.3);
    if (sichtbar) requestAnimationFrame(schleife);
    else laeuft = false;
  }
  function los() {
    if (!laeuft) { laeuft = true; requestAnimationFrame(schleife); }
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((e) => {
      sichtbar = e[0].isIntersecting;
      if (sichtbar) los();
    }).observe(box);
  }
  los();
})();
