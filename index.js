const tourSteps = [
  {
    selector: ".nav-brand",
    text: "Bu logoya tıklayarak her zaman ana sayfaya dönebilirsin."
  },
  {
    selector: ".nav-links a:nth-child(1)",
    text: "Ana Sayfa bağlantısı – buradan platforma genel bakış sağlayabilirsin."
  },
  {
    selector: ".nav-links a:nth-child(2)",
    text: "Üniteler sekmesi – Almanca derslerine buradan erişebilirsin."
  },
  {
    selector: ".nav-links a:nth-child(3)",
    text: "Hakkımızda – Projenin amacı ve arkasındaki ekip burada anlatılıyor."
  },
  {
    selector: ".nav-links a:nth-child(4)",
    text: "İletişim – Bize mesaj bırakmak istersen bu bölümü kullanabilirsin."
  },
  {
    selector: ".nav-links a:nth-child(5)",
    text: "Forum – Diğer kullanıcılarla etkileşime geçebileceğin alan."
  },
  {
    selector: ".nav-links a:nth-child(6)",
    text: "Buzkıran Cevapları – Topluluğun verdiği eğlenceli yanıtları buradan görebilirsin."
  },
  {
    selector: "#themeToggle",
    text: "🌙 Tema Değiştir – Aydınlık ve karanlık mod arasında geçiş yapar."
  }
];

let currentStep = 0;

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("hasSeenTour")) {
    startTour();
  }
});

function startTour() {
  currentStep = 0;
  showStep();
}

function showStep() {
  const step = tourSteps[currentStep];
  const element = document.querySelector(step.selector);
  const tooltip = document.getElementById("tourTooltip");
  const text = document.getElementById("tooltipText");

  if (!element) return;

  const rect = element.getBoundingClientRect();

  tooltip.classList.remove("hidden");
  tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
  tooltip.style.left = `${rect.left + window.scrollX}px`;

  text.innerText = step.text;

  element.scrollIntoView({ behavior: "smooth", block: "center" });
}

function nextStep() {
  currentStep++;
  if (currentStep < tourSteps.length) {
    showStep();
  } else {
    endTour();
  }
}

function endTour() {
  document.getElementById("tourTooltip").classList.add("hidden");
  localStorage.setItem("hasSeenTour", "true");
}

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

// Önceki buzkıran cevabını yükle
function loadPreviousAnswer() {
  if (typeof firebase !== 'undefined') {
    const ref = firebase.database().ref('icebreakers').limitToLast(1);
    ref.once('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lastKey = Object.keys(data)[0];
        const lastAnswer = data[lastKey].answer;
        document.getElementById('previousAnswer').textContent = `Önceki katılımcının cevabı: "${lastAnswer}"`;
      } else {
        document.getElementById('previousAnswer').textContent = 'Henüz kimse cevaplamamış.';
      }
    });
  }
}

// Buzkıran popup gönderimi
function submitIcebreaker() {
  const input = document.getElementById('icebreakerInput');
  const answer = input.value.trim();
  if (!answer) {
    alert('Lütfen cevabınızı yazın.');
    return;
  }

  localStorage.setItem('icebreakerSubmitted', 'true');
  const timestamp = Date.now();

  if (typeof firebase !== 'undefined') {
    firebase.database().ref('icebreakers').push({ answer, timestamp });
  }

  document.getElementById('icebreakerModal').style.display = 'none';
  alert('Teşekkürler! Şimdi platforma başlayabilirsin.');
}

// Sayfa yüklendiğinde popup kontrolü
window.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('icebreakerSubmitted')) {
    document.getElementById('icebreakerModal').style.display = 'flex';
    loadPreviousAnswer();
  } else {
    document.getElementById('icebreakerModal').style.display = 'none';
  }
});

// Mailto işlevi
function sendMail(event) {
  event.preventDefault();
  const name = encodeURIComponent(document.getElementById('name').value);
  const email = encodeURIComponent(document.getElementById('email').value);
  const message = encodeURIComponent(document.getElementById('message').value);
  const subject = encodeURIComponent("Görüş & Öneri");
  const body = `Ad: ${name}%0AE-posta: ${email}%0AMesaj:%0A${message}`;
  window.location.href = `mailto:aabdullahbaspinarr@gmail.com?subject=${subject}&body=${body}`;
}

(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="fmGhmZopdiKau9QTCrAFx";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
