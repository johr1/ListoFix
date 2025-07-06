// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ⚠️ Reemplazá con tu configuración real de Firebase
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

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userDoc = await getDoc(doc(db, "usuarios", uid));
    const rol = userDoc.exists() ? userDoc.data().rol : "cliente";

    if (rol === "tecnico") {
      window.location.href = "/tecnico.html";
    } else {
      window.location.href = "/cliente.html";
    }
  } catch (error) {
    document.getElementById("mensaje").textContent = "Error al iniciar sesión";
  }
}

async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rol = document.getElementById("rol").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    await setDoc(doc(db, "usuarios", uid), {
      email,
      rol
    });

    if (rol === "tecnico") {
      window.location.href = "/tecnico.html";
    } else {
      window.location.href = "/cliente.html";
    }
  } catch (error) {
    document.getElementById("mensaje").textContent = "Error al registrarse";
  }
}

window.login = login;
window.register = register;