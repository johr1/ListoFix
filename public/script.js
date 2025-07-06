// Firebase imports desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Configuración de tu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCPX4yh69pN5-8Bi3mR9_tXn6MOFjalaIA",
  authDomain: "listofix-b1867.firebaseapp.com",
  projectId: "listofix-b1867",
  storageBucket: "listofix-b1867.appspot.com",
  messagingSenderId: "24652600836",
  appId: "1:24652600836:web:748ba31f7b1df019be8751",
  measurementId: "G-VP7XN3G277"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Manejar envío del formulario
document.getElementById("formulario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = e.target.nombre.value;
  const zona = e.target.zona.value;
  const servicio = e.target.servicio.value;
  const descripcion = e.target.descripcion.value;

  try {
    await addDoc(collection(db, "solicitudes"), {
      nombre,
      zona,
      servicio,
      descripcion,
      fecha: new Date()
    });

    alert("✅ Solicitud enviada con éxito.");
    e.target.reset();
  } catch (error) {
    console.error("Error al enviar a Firestore:", error);
    alert("❌ Error al enviar solicitud.");
  }
});