// Firebase ayarları
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
  function submitIcebreaker() {
    const input = document.getElementById('icebreakerInput');
    const answer = input.value.trim();
    if (!answer) return alert('Lütfen cevabınızı yazın.');
  
    localStorage.setItem('icebreakerSubmitted', 'true');
    const timestamp = Date.now();
  
    if (typeof firebase !== 'undefined') {
      firebase.database().ref('icebreakers').push({ answer, timestamp });
    }
  
    document.getElementById('icebreakerModal').style.display = 'none';
    alert('Teşekkürler! Şimdi platforma başlayabilirsin.');
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('icebreakerSubmitted')) {
      document.getElementById('icebreakerModal').style.display = 'flex';
    } else {
      document.getElementById('icebreakerModal').style.display = 'none';
    }
  });
  
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
  