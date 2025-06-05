const onboardingSteps = [
  {
    selector: ".nav-brand",
    text: "Bu logoya tıklayarak ana sayfaya dönebilirsin."
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
    text: "Görüş ve önerilerini buradan bize iletebilirsin."
  },
  {
    selector: ".nav-links a:nth-child(5)",
    text: "Forum alanında diğer kullanıcılarla etkileşebilirsin."
  },
  {
    selector: ".nav-links a:nth-child(6)",
    text: "Topluluğun verdiği buzkıran cevaplarına buradan ulaşabilirsin."
  },
  {
    selector: "#themeToggle",
    text: "Tema tuşuyla açık ve koyu mod arasında geçiş yapabilirsin."
  },
  {
    selector: "#units",
    text: "Almanca derslerine buradaki ünite kartlarından başlayabilirsin."
  },
  {
    selector: "#contact",
    text: "Bize mesaj göndermek istersen bu formu doldurabilirsin."
  },
  {
    selector: "#chatbotButton", // chatbot butonunun id'si
    text: "Chatbot sana sorularında yardımcı olabilir."
  }
];

let currentStep = 0;

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("hasSeenOnboarding")) {
    disablePageInteraction();
    showOnboardingStep();
  }
});

function showOnboardingStep() {
  const step = onboardingSteps[currentStep];
  const target = document.querySelector(step.selector);
  const tooltip = document.getElementById("onboardingTooltip");
  const tooltipBox = document.getElementById("tooltipBox");
  const overlay = document.getElementById("onboardingOverlay");
  const text = document.getElementById("tooltipText");

  if (!target || !tooltipBox || !tooltip || !overlay) return;

  removeHighlights();
  target.classList.add("highlighted");

  const rect = target.getBoundingClientRect();
  const tooltipRect = tooltipBox.getBoundingClientRect();

  const top = rect.top + window.scrollY - tooltipRect.height - 20;
  const left = rect.left + window.scrollX;

  tooltip.style.top = `${Math.max(top, 10)}px`;
  tooltip.style.left = `${Math.min(left, window.innerWidth - tooltipRect.width - 10)}px`;

  overlay.classList.remove("hidden");
  tooltip.classList.remove("hidden");

  text.innerText = step.text;

  target.scrollIntoView({ behavior: "smooth", block: "center" });
}

function nextStep() {
  currentStep++;
  if (currentStep < onboardingSteps.length) {
    showOnboardingStep();
  } else {
    endOnboarding();
  }
}

function endOnboarding() {
  document.getElementById("onboardingOverlay").classList.add("hidden");
  document.getElementById("onboardingTooltip").classList.add("hidden");
  removeHighlights();
  localStorage.setItem("hasSeenOnboarding", "true");
  enablePageInteraction();
}

function disablePageInteraction() {
  document.body.style.overflow = 'hidden';
  document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
    if (!el.closest('#onboardingTooltip')) {
      el.setAttribute('disabled', 'true');
    }
  });
}

function enablePageInteraction() {
  document.body.style.overflow = '';
  document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
    el.removeAttribute('disabled');
  });
}

function removeHighlights() {
  document.querySelectorAll('.highlighted').forEach(el => {
    el.classList.remove('highlighted');
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
