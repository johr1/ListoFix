import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
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

// Mostrar bienvenida si el usuario está logueado
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const rol = docSnap.data().rol;
      document.getElementById("bienvenida").textContent = `Bienvenido, ${rol}`;
    }
  }
});