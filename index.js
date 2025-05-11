<<<<<<< HEAD
=======
// Firebase ayarları
>>>>>>> parent of 6a5ed38 (Update index.js)
const firebaseConfig = {
    apiKey: "AIzaSyBLXLtI9N3iT94bpDXGcxqgNk67xEWU6nU",
    authDomain: "uzaktanegitim-forum.firebaseapp.com",
    databaseURL: "https://uzaktanegitim-forum-default-rtdb.firebaseio.com",
    projectId: "uzaktanegitim-forum",
    storageBucket: "uzaktanegitim-forum.appspot.com",
    messagingSenderId: "157485126536",
    appId: "1:157485126536:web:985d13c464f8373151e03d"
  };
  firebase.initializeApp(firebaseConfig);
  
  // Tema değiştirici
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
  
  // Buzkıran popup
  // Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

<<<<<<< HEAD
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

document.addEventListener('DOMContentLoaded', () => {
  const isIcebreakerShown = localStorage.getItem('icebreakerShown');
  if (isIcebreakerShown) return;
=======
// Show last answer when the page loads
window.onload = function() {
  const modal = document.getElementById('icebreakerModal');
  modal.style.display = 'flex';
>>>>>>> parent of 6a5ed38 (Update index.js)

  db.ref('icebreaker/lastAnswer').once('value').then(snapshot => {
    const lastAnswer = snapshot.val();
    const modal = document.getElementById('icebreakerModal');
    const previousAnswerElement = document.getElementById('previousAnswer');

    if (lastAnswer) {
      previousAnswerElement.textContent = `Bir önceki kişi şöyle cevapladı: "${lastAnswer}"`;
    } else {
      previousAnswerElement.textContent = "Bu oyunu oynayan ilk kişisin!";
    }

    modal.style.display = 'flex';
  });
});

// Submit answer
function submitIcebreaker() {
  const answer = document.getElementById('icebreakerInput').value.trim();
  if (!answer) {
    alert("Lütfen bir cevap yazınız.");
    return;
  }

  // Save to 'answers' list
  const newAnswerRef = db.ref('icebreaker/answers').push();
  newAnswerRef.set(answer);

  // Update last answer reference
  db.ref('icebreaker/lastAnswer').set(answer);
<<<<<<< HEAD
  localStorage.setItem('icebreakerShown', 'true');
  document.getElementById('icebreakerModal').style.display = 'none';
}

function sendMail(event) {
  event.preventDefault();
  const name = encodeURIComponent(document.getElementById('name').value);
  const email = encodeURIComponent(document.getElementById('email').value);
  const message = encodeURIComponent(document.getElementById('message').value);
  const subject = encodeURIComponent("Görüş & Öneri");
  const body = `Ad: ${name}%0AE-posta: ${email}%0AMesaj:%0A${message}`;
  window.location.href = `mailto:aabdullahbaspinarr@gmail.com?subject=${subject}&body=${body}`;
}
=======

  // Close modal
  document.getElementById('icebreakerModal').style.display = 'none';
}

  
  // Mailto
  function sendMail(event) {
    event.preventDefault();
    const name = encodeURIComponent(document.getElementById('name').value);
    const email = encodeURIComponent(document.getElementById('email').value);
    const message = encodeURIComponent(document.getElementById('message').value);
    const subject = encodeURIComponent("Görüş & Öneri");
    const body = `Ad: ${name}%0AE-posta: ${email}%0AMesaj:%0A${message}`;
    window.location.href = `mailto:aabdullahbaspinarr@gmail.com?subject=${subject}&body=${body}`;
  }
  
>>>>>>> parent of 6a5ed38 (Update index.js)
