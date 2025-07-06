// cliente.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ⚠️ Tu configuración real de Firebase:
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

// Cerrar sesión
window.logout = () => {
  signOut(auth).then(() => {
    window.location.href = "/login.html";
  });
};

// Mostrar solicitudes del usuario logueado
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  document.getElementById("username").textContent = user.email;

  const q = query(
    collection(db, "solicitudes"),
    where("uid", "==", user.uid)
  );

  const querySnapshot = await getDocs(q);
  const container = document.getElementById("solicitudes-container");
  container.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const estadoColor =
      data.estado === "completada"
        ? "bg-green-200 text-green-800"
        : data.estado === "en progreso"
        ? "bg-blue-200 text-blue-800"
        : "bg-yellow-200 text-yellow-800";

    const tarjeta = `
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-lg font-semibold">${data.servicio}</h2>
          <span class="text-xs px-2 py-1 rounded ${estadoColor}">
            ${data.estado || "pendiente"}
          </span>
        </div>
        <p class="text-sm text-gray-600 mb-1"><strong>Solicitado:</strong> ${data.fechaSolicitud}</p>
        <p class="text-sm text-gray-600 mb-1"><strong>Descripción:</strong> ${data.descripcion}</p>
        <p class="text-sm text-gray-600 mb-3"><strong>Fecha preferida:</strong> ${data.fechaPreferida}</p>
        <a href="#" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Ver Detalles</a>
      </div>
    `;

    container.innerHTML += tarjeta;
  });
});