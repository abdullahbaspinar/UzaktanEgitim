const onboardingSteps = [
  {
    selector: ".nav-brand",
    text: "Bu logoya tıklayarak her zaman ana sayfaya dönebilirsin."
  },
  {
    selector: ".nav-links a:nth-child(2)",
    text: "Buradan Almanca ünitelerine ulaşabilirsin."
  },
  {
    selector: ".nav-links a:nth-child(3)",
    text: "Proje hakkında bilgi almak için bu bölümü ziyaret et."
  },
  {
    selector: ".nav-links a:nth-child(4)",
    text: "Görüşlerini iletmek için iletişim formuna buradan erişebilirsin."
  },
  {
    selector: ".nav-links a:nth-child(5)",
    text: "Forum sayfasından toplulukla iletişime geçebilirsin."
  },
  {
    selector: ".nav-links a:nth-child(6)",
    text: "Buzkıran cevaplarını burada görebilirsin."
  },
  {
    selector: "#themeToggle",
    text: "Tema tuşuyla koyu/açık mod arasında geçiş yapabilirsin."
  },
  {
    selector: "#units",
    text: "Buradan ünite kartlarına ulaşarak Almanca öğrenmeye başlayabilirsin."
  },
  {
    selector: "#contact",
    text: "Buradaki form üzerinden bize mesaj bırakabilirsin."
  },
  {
    selector: "#chatbotButton", // senin chatbot'un varsa ID'si burada olmalı
    text: "Soruların mı var? Chatbot sana anında yardımcı olabilir."
  }
];

let currentOnboardingStep = 0;

document.addEventListener("DOMContentLoaded", () => {
  const hasSeen = localStorage.getItem("hasSeenOnboarding");
  if (!hasSeen) {
    disablePageInteraction();
    showOnboardingStep();
  }
});

function showOnboardingStep() {
  const step = onboardingSteps[currentOnboardingStep];
  const target = document.querySelector(step.selector);
  const overlay = document.getElementById("onboardingOverlay");
  const text = document.getElementById("onboardingText");

  if (!target) return;

  const rect = target.getBoundingClientRect();
  overlay.classList.remove("hidden");
  text.innerText = step.text;

  scrollToElement(target);
}

function nextStep() {
  currentOnboardingStep++;
  if (currentOnboardingStep < onboardingSteps.length) {
    showOnboardingStep();
  } else {
    endOnboarding();
  }
}

function scrollToElement(el) {
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}

function endOnboarding() {
  document.getElementById("onboardingOverlay").classList.add("hidden");
  localStorage.setItem("hasSeenOnboarding", "true");
  enablePageInteraction();
}

// Sayfa etkileşimini kilitleyen/kaldıran fonksiyonlar
function disablePageInteraction() {
  document.body.style.overflow = 'hidden';
  document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
    el.setAttribute('disabled', 'true');
  });
}

function enablePageInteraction() {
  document.body.style.overflow = '';
  document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
    el.removeAttribute('disabled');
  });
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
