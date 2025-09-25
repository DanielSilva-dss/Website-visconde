// Arquivo de exemplo: firebase-config.example.js
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO_ID_AQUI",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID_AQUI",
  appId: "SEU_APP_ID_AQUI"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);