
const SUPABASE_URL = "https://kxtulrsdszqosmhkaqxo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_-AUJ6mKimEweon83l2m6dQ_2JCZBL2A";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const authGate = document.getElementById("authGate");
const appMain = document.getElementById("appMain");
const authForm = document.getElementById("authForm");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authError = document.getElementById("authError");
const authSubmit = document.getElementById("authSubmit");
const userBar = document.getElementById("userBar");
const userBarEmail = document.getElementById("userBarEmail");
const logoutBtn = document.getElementById("logoutBtn");

function showApp(session) {
  authGate.classList.add("hidden");
  appMain.classList.remove("hidden");
  userBar.style.display = "flex";
  userBarEmail.textContent = session.user.email;
}

function showLogin() {
  appMain.classList.add("hidden");
  authGate.classList.remove("hidden");
  userBar.style.display = "none";
}

// Al cargar la página, revisa si ya hay una sesión activa (recordada por el navegador)
supabaseClient.auth.getSession().then(({ data }) => {
  if (data.session) {
    showApp(data.session);
  } else {
    showLogin();
  }
});

// Reacciona a cambios de sesión (login, logout, expiración de token, etc.)
supabaseClient.auth.onAuthStateChange((_event, session) => {
  if (session) {
    showApp(session);
  } else {
    showLogin();
  }
});

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authError.textContent = "";
  authSubmit.disabled = true;
  authSubmit.textContent = "Ingresando...";

  const { error } = await supabaseClient.auth.signInWithPassword({
    email: authEmail.value.trim(),
    password: authPassword.value,
  });

  authSubmit.disabled = false;
  authSubmit.textContent = "Ingresar";

  if (error) {
    authError.textContent = "Correo o contraseña incorrectos.";
    return;
  }

  authPassword.value = "";
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
});
