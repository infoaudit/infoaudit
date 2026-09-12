const REVIEW_CHANNEL_NAME = "review-session";
let reviewChannel = null;
let reviewInitialized = false;
let isApproved = false;
let editorTimerInterval = null;

const defaultDeckHTML = document.getElementById("deck")?.innerHTML ?? "";
const defaultDeckStyle = document.getElementById("deck")?.getAttribute("style") ?? "";

function formatElapsed(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

const deckEl = document.getElementById("deck");
const printBtn = document.getElementById("print");

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function buildReviewBar() {
  const bar = document.createElement("div");
  bar.id = "reviewBar";
  bar.style.cssText =
    "position:fixed;top:0;left:0;right:0;z-index:9998;display:flex;" +
    "align-items:center;gap:12px;padding:9px 16px;background:#111827;" +
    "color:#fff;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;" +
    "box-shadow:0 2px 10px rgba(0,0,0,0.25);";
  document.body.appendChild(bar);
  document.getElementById("appMain").style.marginTop = "44px";
  return bar;
}

// ---------------------- MODO EDITOR ----------------------
function initEditorReview(session) {
  const bar = buildReviewBar();
  bar.innerHTML = `
    <span id="reviewStatus">🔴 Esperando conexión del admin…</span>
    <span style="margin-left:auto;color:#9ca3af;">Conectado como: ${session.user.email}</span>
  `;
  const statusEl = () => document.getElementById("reviewStatus");

  function setApproved(value) {
    isApproved = value;
    if (statusEl()) {
      statusEl().textContent = value
        ? "✅ Aprobado por el admin"
        : "🟡 Esperando aprobación del admin…";
    }
  }

  function sendSnapshot() {
    if (!reviewChannel) return;
    reviewChannel.send({
      type: "broadcast",
      event: "snapshot",
      payload: {
        deckStyle: deckEl.getAttribute("style") || "",
        html: deckEl.innerHTML,
        editorEmail: session.user.email,
      },
    });
  }
  const sendSnapshotDebounced = debounce(sendSnapshot, 700);

  const deckObserver = new MutationObserver(() => {
    if (isApproved) setApproved(false);
    sendSnapshotDebounced();
  });
  deckObserver.observe(deckEl, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  reviewChannel = supabaseClient.channel(REVIEW_CHANNEL_NAME, {
    config: {
      broadcast: { self: false },
      presence: { key: session.user.id },
      private: true, // requiere sesión iniciada; se valida con RLS en realtime.messages
    },
  });

  reviewChannel.on("broadcast", { event: "approved" }, () => setApproved(true));
  reviewChannel.on("broadcast", { event: "request_snapshot" }, () => sendSnapshot());

  reviewChannel.on("presence", { event: "sync" }, () => {
    const state = reviewChannel.presenceState();
    const hasAdmin = Object.values(state).flat().some((p) => p.role === "admin");
    if (statusEl() && !isApproved) {
      statusEl().textContent = hasAdmin
        ? "🟡 Admin conectado — esperando aprobación…"
        : "🔴 Esperando conexión del admin…";
    }
    if (hasAdmin) sendSnapshot(); // para que un admin recién conectado vea el estado actual
  });

  reviewChannel.subscribe(async (status) => {
    if (status === "SUBSCRIBED") {
      await reviewChannel.track({ role: "editor", joinedAt: Date.now() });
      sendSnapshot();
    }
  });
}

// ---------------------- MODO ADMIN ----------------------
function initAdminReview(session) {
  const aside = document.querySelector("#appMain aside.editor");
  if (aside) aside.style.display = "none";

  const stage = document.querySelector(".stage");
  if (stage) {
    stage.style.cssText +=
      "display:flex;justify-content:center;align-items:flex-start;" +
      "width:100%;overflow:auto;background:#e9edf3;padding:32px 0;";
  }
  if (deckEl) {
    deckEl.style.boxShadow = "0 10px 40px rgba(0,0,0,0.15)";
  }
  const appMainEl = document.getElementById("appMain");
  if (appMainEl) appMainEl.style.display = "flex";

  const bar = buildReviewBar();
  bar.innerHTML = `
    <span id="reviewStatus">🔴 Ningún editor conectado todavía</span>
    <span id="editorTimer" style="color:#9ca3af;"></span>
    <button id="approveBtn" disabled style="margin-left:auto;padding:7px 18px;border:none;
      border-radius:8px;background:#16a34a;color:#fff;font-weight:600;cursor:pointer;">
      Aprobar cambios
    </button>
    <button id="adminLogoutBtn" style="padding:7px 14px;border:none;border-radius:8px;
      background:#374151;color:#fff;font-weight:600;cursor:pointer;">
      Cerrar sesión
    </button>
  `;
  const statusEl = document.getElementById("reviewStatus");
  const approveBtn = document.getElementById("approveBtn");
  const timerEl = document.getElementById("editorTimer");
  const logoutBtn = document.getElementById("adminLogoutBtn");
  let lastEditorEmail = null;
  let editorJoinedAt = null;

  logoutBtn.addEventListener("click", async () => {
    logoutBtn.disabled = true;
    await supabaseClient.auth.signOut();
  });

  function updateEditorTimer() {
    if (!timerEl || !editorJoinedAt) return;
    timerEl.textContent = `⏱ Conectado hace ${formatElapsed(Date.now() - editorJoinedAt)}`;
  }

  function startEditorTimer(joinedAt) {
    editorJoinedAt = joinedAt || Date.now();
    updateEditorTimer();
    if (editorTimerInterval) clearInterval(editorTimerInterval);
    editorTimerInterval = setInterval(updateEditorTimer, 1000);
  }

  function stopEditorTimer() {
    editorJoinedAt = null;
    if (editorTimerInterval) {
      clearInterval(editorTimerInterval);
      editorTimerInterval = null;
    }
    if (timerEl) timerEl.textContent = "";
  }

  function resetToDefaultView() {
    deckEl.innerHTML = defaultDeckHTML;
    if (defaultDeckStyle) {
      deckEl.setAttribute("style", defaultDeckStyle);
    } else {
      deckEl.removeAttribute("style");
    }
    lastEditorEmail = null;
    statusEl.textContent = "🔴 El editor se desconectó — vista por defecto restaurada";
    approveBtn.disabled = true;
    approveBtn.textContent = "Aprobar cambios";
  }

  reviewChannel = supabaseClient.channel(REVIEW_CHANNEL_NAME, {
    config: {
      broadcast: { self: false },
      presence: { key: session.user.id },
      private: true, // requiere sesión iniciada; se valida con RLS en realtime.messages
    },
  });

  reviewChannel.on("broadcast", { event: "snapshot" }, ({ payload }) => {
    deckEl.setAttribute("style", payload.deckStyle || "");
    deckEl.innerHTML = payload.html;
    lastEditorEmail = payload.editorEmail;
    statusEl.textContent = `🟢 Viendo en vivo a ${lastEditorEmail} — cambios sin aprobar`;
    approveBtn.disabled = false;
    approveBtn.textContent = "Aprobar cambios";
  });

  reviewChannel.on("presence", { event: "sync" }, () => {
    const state = reviewChannel.presenceState();
    const editorPresence = Object.values(state)
      .flat()
      .find((p) => p.role === "editor");
    if (editorPresence) {
      if (!editorJoinedAt) startEditorTimer(editorPresence.joinedAt);
    } else {
      const hadEditor = editorJoinedAt !== null;
      stopEditorTimer();
      if (hadEditor) resetToDefaultView();
    }
  });

  approveBtn.addEventListener("click", () => {
    reviewChannel.send({ type: "broadcast", event: "approved", payload: {} });
    approveBtn.disabled = true;
    approveBtn.textContent = "✅ Aprobado";
    statusEl.textContent = `✅ Aprobaste el contenido de ${lastEditorEmail || "el editor"}`;
  });

  reviewChannel.subscribe(async (status) => {
    if (status === "SUBSCRIBED") {
      await reviewChannel.track({ role: "admin" });
      reviewChannel.send({ type: "broadcast", event: "request_snapshot", payload: {} });
    }
  });
}

// ---------------------- ARRANQUE ----------------------
supabaseClient.auth.onAuthStateChange((_event, session) => {
  if (!session) {
    const wasActiveSession = reviewInitialized;

    if (reviewChannel) {
      supabaseClient.removeChannel(reviewChannel);
      reviewChannel = null;
    }
    if (editorTimerInterval) {
      clearInterval(editorTimerInterval);
      editorTimerInterval = null;
    }
    reviewInitialized = false;
    const bar = document.getElementById("reviewBar");
    if (bar) bar.remove();

    if (wasActiveSession) {
      window.location.reload();
    }
    return;
  }

  if (reviewInitialized) return; // ya se inicializó para esta sesión
  reviewInitialized = true;

  const role = session.user.user_metadata?.role;
  if (role === "admin") {
    initAdminReview(session);
  } else {
    initEditorReview(session);
  }
});
