import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Config de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "listofix-b1867",
  storageBucket: "TU_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Función de login
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rol = document.getElementById("rol").value;

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = cred.user;
    if (rol === "cliente") {
      window.location.href = "/cliente.html";
    } else {
      window.location.href = "/tecnico.html";
    }
  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
  }
}

// Función de registro
async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rol = document.getElementById("rol").value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user = cred.user;
    await setDoc(doc(db, "usuarios", user.uid), {
      email,
      rol,
    });
    if (rol === "cliente") {
      window.location.href = "/cliente.html";
    } else {
      window.location.href = "/tecnico.html";
    }
  } catch (error) {
    alert("Error al registrarse: " + error.message);
  }
}

// Hacer accesibles las funciones desde HTML
window.login = login;
window.register = register;