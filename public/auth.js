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

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCPX4yh69hS-80138m9_tXn6ME0Fja0aIA",
  authDomain: "listofix-b1867.firebaseapp.com",
  projectId: "listofix-b1867",
  storageBucket: "listofix-b1867.appspot.com",
  messagingSenderId: "124652608036",
  appId: "1:124652608036:web:748ba317fb1d0f19be8751",
  measurementId: "G-VP7X3NGZ72"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Iniciar sesión
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

// Registrarse
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

// Exportar funciones al HTML
window.login = login;
window.register = register;