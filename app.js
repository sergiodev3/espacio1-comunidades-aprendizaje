/* ============================================================
   Espacio 1 · Movilizar las comunidades de aprendizaje
   Actividad drag & drop — sin dependencias externas
   ============================================================ */

(() => {
  "use strict";

  /* ---------- Datos ---------- */

  const ICONS = {
    // Grupo de personas (construcción en colectivo)
    personas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="7" r="2.6"/><circle cx="5.5" cy="9" r="2.1"/><circle cx="18.5" cy="9" r="2.1"/>
      <path d="M8.2 19c0-2.3 1.7-4.1 3.8-4.1s3.8 1.8 3.8 4.1"/>
      <path d="M2.3 17.6c.2-1.9 1.5-3.2 3.2-3.2.7 0 1.4.2 1.9.7"/>
      <path d="M21.7 17.6c-.2-1.9-1.5-3.2-3.2-3.2-.7 0-1.4.2-1.9.7"/>
    </svg>`,
    // Foco / idea (contextualización)
    foco: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3a5.5 5.5 0 0 1 3.1 10c-.7.5-1.1 1.1-1.1 1.8v.7h-4v-.7c0-.7-.4-1.3-1.1-1.8A5.5 5.5 0 0 1 12 3z"/>
      <path d="M10 18.5h4M10.8 21h2.4"/>
      <path d="M12 7.2v2.2M10.6 8.3h2.8"/>
    </svg>`,
    // Laberinto (problematización)
    laberinto: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3.5 3.5h17v17h-17V7.5h13v9h-9v-5h5"/>
    </svg>`,
    // Red de nodos (pertenencia e identidad)
    red: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><circle cx="12" cy="13" r="1.7"/>
      <path d="M12 7v4.3M10.6 14.3l-4 2.6M13.4 14.3l4 2.6M7 18h10"/>
    </svg>`,
  };

  const CATEGORIES = {
    construccion: {
      nombre: "Construcción del aprendizaje en colectivo",
      color: "#116857",
      icon: ICONS.personas,
    },
    contextualizacion: {
      nombre: "Contextualización del aprendizaje en colectivo",
      color: "#8a1e3c",
      icon: ICONS.foco,
    },
    problematizacion: {
      nombre: "Problematización de la práctica docente",
      color: "#b8933d",
      icon: ICONS.laberinto,
    },
    pertenencia: {
      nombre: "Sentido de pertenencia e identidad colectiva",
      color: "#2b2b2b",
      icon: ICONS.red,
    },
  };

  const STATEMENTS = [
    { cat: "problematizacion", text: "Se fomenta el diálogo y la reflexión en torno a las problemáticas educativas poniendo a disposición los aprendizajes de cada persona." },
    { cat: "pertenencia", text: "Se caracteriza por percibirse como parte de un grupo en el que se influye de forma positiva o negativa entre sus miembros." },
    { cat: "construccion", text: "Implica que el aprendizaje no se da de manera individual ni vertical, sino que se genera en comunidad y en diálogo horizontal." },
    { cat: "contextualizacion", text: "Proceso interactivo que tiene como finalidad adaptar y situar los saberes y conocimientos construidos colectivamente en las realidades, necesidades y experiencias del grupo." },
    { cat: "problematizacion", text: "Se asume que la realidad es compleja, pero que, en esa complejidad, existe la posibilidad para la acción individual y colectiva en donde se contrasta el discurso y las acciones educativas." },
    { cat: "construccion", text: "Proceso social que permite el despliegue de capacidades, habilidades y actitudes que favorecen la construcción de conocimientos y saberes a través de la interacción dentro de un grupo." },
    { cat: "pertenencia", text: "Cada participante es un agente de autorregulación, con conocimientos y emociones únicos que enriquecen el proceso." },
    { cat: "contextualizacion", text: "Se reconoce el entorno (condiciones sociales, culturales, metodológicas e institucionales) y sus dinámicas como parte activa del proceso de aprendizaje." },
    { cat: "contextualizacion", text: "Los conocimientos y saberes construidos se enfocan en responder a las condiciones, necesidades y significados de lo que en el entorno y la realidad ocurre." },
    { cat: "problematizacion", text: "Se comparten múltiples perspectivas que permiten anticipar, identificar y buscar soluciones a los retos y problemáticas que enfrentan." },
    { cat: "construccion", text: "Para construir conocimiento en comunidad se asume la responsabilidad para lograr un avance sostenido en el crecimiento conjunto de aprendizaje." },
    { cat: "pertenencia", text: "Los significados y las relaciones de compromiso mutuo y con la comunidad se desarrollan a partir de la participación y del contexto en el que se construyen los conocimientos." },
  ];

  const TOTAL = STATEMENTS.length;

  /* ---------- Estado y referencias ---------- */

  const el = {
    legend: document.getElementById("legend"),
    board: document.getElementById("board"),
    tray: document.getElementById("tray"),
    score: document.getElementById("score"),
    attempts: document.getElementById("attempts"),
    resetBtn: document.getElementById("resetBtn"),
    muteBtn: document.getElementById("muteBtn"),
    fullscreenBtn: document.getElementById("fullscreenBtn"),
    revealBtn: document.getElementById("revealBtn"),
    overlay: document.getElementById("overlay"),
    overlayStats: document.getElementById("overlayStats"),
    playAgainBtn: document.getElementById("playAgainBtn"),
    confetti: document.getElementById("confetti"),
  };

  const state = { score: 0, attempts: 0, muted: false, revealed: false };

  // Clave que se pide al pulsar 👁 Revelar respuestas (cámbiala aquí)
  const FACILITATOR_PIN = "129";
  let drag = null;
  let confettiRunning = false;

  /* ---------- Utilidades ---------- */

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ---------- Sonidos (Web Audio, sin archivos) ---------- */

  let audioCtx = null;

  function ensureAudio() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (_) { /* sin audio disponible */ }
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  }

  function tone(freq, delay, dur, type = "sine", vol = 0.16) {
    if (!audioCtx || state.muted) return;
    const t0 = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  const playSuccess = () => { tone(660, 0, 0.18); tone(880, 0.12, 0.28); };
  const playFanfare = () => {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.14, 0.35, "sine", 0.18));
  };

  /* ---------- Render ---------- */

  function renderLegend() {
    el.legend.innerHTML = "";
    for (const [id, cat] of Object.entries(CATEGORIES)) {
      const chip = document.createElement("div");
      chip.className = "legend-chip";
      chip.style.setProperty("--chip-color", cat.color);
      chip.innerHTML = `<span class="mini-icon">${cat.icon}</span><span>${cat.nombre}</span>`;
      el.legend.appendChild(chip);
    }
  }

  function renderBoard() {
    el.board.innerHTML = "";
    for (const st of shuffle(STATEMENTS)) {
      const card = document.createElement("article");
      card.className = "card";
      card.dataset.cat = st.cat;
      card.style.setProperty("--cat-color", CATEGORIES[st.cat].color);

      const drop = document.createElement("div");
      drop.className = "drop";
      const p = document.createElement("p");
      p.textContent = st.text;

      card.append(drop, p);
      el.board.appendChild(card);
    }
  }

  function renderTray() {
    el.tray.innerHTML = "";
    for (const [id, cat] of Object.entries(CATEGORIES)) {
      for (let i = 0; i < 3; i++) {
        const slot = document.createElement("div");
        slot.className = "slot";
        const token = document.createElement("div");
        token.className = "token";
        token.dataset.cat = id;
        token.style.setProperty("--token-color", cat.color);
        token.setAttribute("role", "img");
        token.setAttribute("aria-label", cat.nombre);
        token.innerHTML = cat.icon;
        slot.appendChild(token);
        token._home = slot;
        el.tray.appendChild(slot);
      }
    }
  }

  function updateScoreboard() {
    el.score.textContent = state.score;
    el.attempts.textContent = state.attempts;
  }

  /* ---------- Drag & drop con Pointer Events ---------- */

  // Convierte un token en reposo en un elemento flotante posicionado
  // exactamente donde ya estaba, listo para animarse o seguir el puntero.
  function floatToken(token, rect) {
    token.style.width = rect.width + "px";
    token.style.height = rect.height + "px";
    token.style.position = "fixed";
    token.style.left = rect.left + "px";
    token.style.top = rect.top + "px";
    token.style.margin = "0";
    document.body.appendChild(token);
  }

  function onPointerDown(e) {
    const token = e.target.closest(".token");
    if (!token || token.classList.contains("placed") || drag || state.revealed) return;
    if (e.button !== undefined && e.button !== 0) return;
    ensureAudio();
    e.preventDefault();

    const rect = token.getBoundingClientRect();
    if (token.parentElement.classList.contains("drop")) {
      token.parentElement.classList.remove("filled");
    }
    drag = {
      token,
      pointerId: e.pointerId,
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    };

    floatToken(token, rect);
    token.classList.add("dragging");

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerCancel);
  }

  // Toda la tarjeta (no solo el círculo) es zona válida para soltar
  function targetCardAt(x, y) {
    const under = document.elementFromPoint(x, y);
    if (!under) return null;
    const card = under.closest(".card");
    return card && !card.classList.contains("solved") ? card : null;
  }

  function clearHighlights() {
    document.querySelectorAll(".card.over").forEach((c) => c.classList.remove("over"));
    document.querySelectorAll(".drop.over").forEach((d) => d.classList.remove("over"));
  }

  function onPointerMove(e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    drag.token.style.left = e.clientX - drag.dx + "px";
    drag.token.style.top = e.clientY - drag.dy + "px";

    const card = targetCardAt(e.clientX, e.clientY);
    document.querySelectorAll(".card.over").forEach((c) => c !== card && c.classList.remove("over"));
    document.querySelectorAll(".drop.over").forEach((d) => d.closest(".card") !== card && d.classList.remove("over"));
    if (card) {
      card.classList.add("over");
      card.querySelector(".drop").classList.add("over");
    }
  }

  function onPointerUp(e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const { token } = drag;
    endDragListeners();
    clearHighlights();

    const card = targetCardAt(e.clientX, e.clientY);
    if (card) {
      state.attempts++;
      if (card.dataset.cat === token.dataset.cat) {
        acceptToken(token, card);
      } else {
        parkToken(token, card);
      }
      updateScoreboard();
    } else {
      flyBack(token, token._home, { w: drag.w, h: drag.h });
    }
    drag = null;
  }

  function onPointerCancel(e) {
    if (!drag || e.pointerId !== drag.pointerId) return;
    endDragListeners();
    clearHighlights();
    flyBack(drag.token, drag.token._home, { w: drag.w, h: drag.h });
    drag = null;
  }

  function endDragListeners() {
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);
    document.removeEventListener("pointercancel", onPointerCancel);
  }

  function clearDragStyles(token) {
    token.classList.remove("dragging");
    token.style.position = "";
    token.style.left = "";
    token.style.top = "";
    token.style.width = "";
    token.style.height = "";
    token.style.margin = "";
    token.style.transition = "";
  }

  // Ancla el icono de forma permanente: respuesta correcta.
  function acceptToken(token, card) {
    const drop = card.querySelector(".drop");
    clearDragStyles(token);
    token.classList.add("placed");
    drop.appendChild(token);
    drop.classList.add("filled", "locked");
    card.classList.add("solved");
    token._home.classList.add("empty");
    state.score++;
    playSuccess();
    if (state.score === TOTAL) setTimeout(finish, 500);
  }

  // Deja el icono colocado (sin marcar acierto/error) para que el grupo lo
  // discuta; sigue siendo arrastrable para volver a intentarlo. Si el
  // círculo ya tenía otro icono equivocado, ese regresa a la bandeja.
  function parkToken(token, card) {
    const drop = card.querySelector(".drop");
    const existing = drop.querySelector(".token");
    if (existing) returnToHome(existing);
    clearDragStyles(token);
    drop.appendChild(token);
    drop.classList.add("filled");
    token._home.classList.add("empty");
  }

  // Envía un token que ya está en reposo (bandeja o círculo) de vuelta a su
  // casillero de origen, con la misma animación que un soltado inválido.
  function returnToHome(token) {
    const rect = token.getBoundingClientRect();
    if (token.parentElement.classList.contains("drop")) {
      token.parentElement.classList.remove("filled");
    }
    floatToken(token, rect);
    flyBack(token, token._home, { w: rect.width, h: rect.height });
  }

  function flyBack(token, homeSlot, size) {
    const target = homeSlot.getBoundingClientRect();
    const done = () => {
      clearDragStyles(token);
      homeSlot.appendChild(token);
      homeSlot.classList.remove("empty");
    };
    token.style.transition = "left 0.45s cubic-bezier(0.34,1.56,0.64,1), top 0.45s cubic-bezier(0.34,1.56,0.64,1)";
    // Forzar reflow para que la transición aplique desde la posición actual
    void token.offsetWidth;
    token.style.left = target.left + (target.width - size.w) / 2 + "px";
    token.style.top = target.top + (target.height - size.h) / 2 + "px";
    let finished = false;
    const finishOnce = () => { if (!finished) { finished = true; done(); } };
    token.addEventListener("transitionend", finishOnce, { once: true });
    setTimeout(finishOnce, 550); // respaldo por si no hubo transición
  }

  /* ---------- Confeti ---------- */

  function launchConfetti() {
    const canvas = el.confetti;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#116857", "#b8933d", "#8a1e3c", "#2b2b2b", "#e2c887", "#1a7d69"];
    const parts = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: 7 + Math.random() * 7,
      h: 4 + Math.random() * 5,
      vy: 2.2 + Math.random() * 3,
      vx: -1.2 + Math.random() * 2.4,
      rot: Math.random() * Math.PI,
      vr: -0.12 + Math.random() * 0.24,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    confettiRunning = true;

    (function frame() {
      if (!confettiRunning) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y < canvas.height + 20) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive) requestAnimationFrame(frame);
      else { confettiRunning = false; ctx.clearRect(0, 0, canvas.width, canvas.height); }
    })();
  }

  function stopConfetti() {
    confettiRunning = false;
  }

  /* ---------- Pantalla completa y revelar respuestas ---------- */

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }

  function revealAnswers() {
    if (state.revealed) return;
    const pin = window.prompt("Clave del facilitador:");
    if (pin === null) return;
    if (pin !== FACILITATOR_PIN) {
      window.alert("Clave incorrecta.");
      return;
    }
    state.revealed = true;
    document.querySelectorAll(".card:not(.solved)").forEach((card) => {
      const drop = card.querySelector(".drop");
      // Busca el token en cualquier parte: bandeja o un círculo donde haya
      // quedado colocado (correcta o incorrectamente) mientras se jugaba.
      const token = document.querySelector(`.token[data-cat="${card.dataset.cat}"]:not(.placed)`);
      if (token) {
        const prevHome = token.parentElement;
        if (prevHome.classList.contains("drop")) prevHome.classList.remove("filled");
        else prevHome.classList.add("empty");
        token.classList.add("placed");
        drop.appendChild(token);
      }
      drop.classList.add("filled", "locked");
      card.classList.add("solved", "revealed");
    });
    el.revealBtn.disabled = true;
  }

  /* ---------- Fin y reinicio ---------- */

  function finish() {
    playFanfare();
    launchConfetti();
    el.overlayStats.textContent = `${TOTAL} aciertos en ${state.attempts} intentos`;
    el.overlay.classList.remove("hidden");
  }

  function reset() {
    stopConfetti();
    el.overlay.classList.add("hidden");
    state.score = 0;
    state.attempts = 0;
    state.revealed = false;
    el.revealBtn.disabled = false;
    updateScoreboard();
    renderBoard();
    renderTray();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- Inicio ---------- */

  el.resetBtn.addEventListener("click", reset);
  el.playAgainBtn.addEventListener("click", reset);
  el.fullscreenBtn.addEventListener("click", toggleFullscreen);
  el.revealBtn.addEventListener("click", revealAnswers);
  document.addEventListener("fullscreenchange", () => {
    const fs = !!document.fullscreenElement;
    el.fullscreenBtn.title = fs ? "Salir de pantalla completa" : "Pantalla completa";
    el.fullscreenBtn.setAttribute("aria-label", el.fullscreenBtn.title);
  });
  el.muteBtn.addEventListener("click", () => {
    state.muted = !state.muted;
    el.muteBtn.textContent = state.muted ? "🔇" : "🔊";
    el.muteBtn.setAttribute("aria-label", state.muted ? "Activar sonidos" : "Silenciar sonidos");
  });
  document.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("resize", () => {
    if (confettiRunning) {
      el.confetti.width = window.innerWidth;
      el.confetti.height = window.innerHeight;
    }
  });

  renderLegend();
  renderBoard();
  renderTray();
  updateScoreboard();
})();
