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

// Buzkıran cevabı
function loadPreviousAnswer() {
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

// Buzkıran gönderimi
function submitIcebreaker() {
  const input = document.getElementById('icebreakerInput');
  const answer = input.value.trim();
  if (!answer) {
    alert('Lütfen cevabınızı yazın.');
    return;
  }

  localStorage.setItem('icebreakerSubmitted', 'true');
  const timestamp = Date.now();
  firebase.database().ref('icebreakers').push({ answer, timestamp });

  document.getElementById('icebreakerModal').style.display = 'none';
  alert('Teşekkürler! Şimdi platforma başlayabilirsin.');
}

// Sayfa yüklenince başlat
window.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('icebreakerSubmitted')) {
    document.getElementById('icebreakerModal').style.display = 'flex';
    loadPreviousAnswer();
  } else {
    document.getElementById('icebreakerModal').style.display = 'none';
    if (!localStorage.getItem('hasSeenOnboarding')) {
      disablePageInteraction();
      showOnboardingStep();
    }
  }
});

// Mail gönderimi
function sendMail(event) {
  event.preventDefault();
  const name = encodeURIComponent(document.getElementById('name').value);
  const email = encodeURIComponent(document.getElementById('email').value);
  const message = encodeURIComponent(document.getElementById('message').value);
  const subject = encodeURIComponent("Görüş & Öneri");
  const body = `Ad: ${name}%0AE-posta: ${email}%0AMesaj:%0A${message}`;
  window.location.href = `mailto:aabdullahbaspinarr@gmail.com?subject=${subject}&body=${body}`;
}

// Chatbot
(function () {
  if (!window.chatbase || window.chatbase("getState") !== "initialized") {
    window.chatbase = (...args) => {
      if (!window.chatbase.q) window.chatbase.q = [];
      window.chatbase.q.push(args);
    };
    window.chatbase = new Proxy(window.chatbase, {
      get(target, prop) {
        if (prop === "q") return target.q;
        return (...args) => target(prop, ...args);
      }
    });
  }
  const onLoad = function () {
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "fmGhmZopdiKau9QTCrAFx";
    script.domain = "www.chatbase.co";
    document.body.appendChild(script);
  };
  if (document.readyState === "complete") onLoad();
  else window.addEventListener("load", onLoad);
})();

// ONBOARDING – Sıralı tanıtım adımları
const onboardingSteps = [
  {
    selector: "body",
    text: "👋 Hoş geldin! Sana bu platformu adım adım tanıtalım.",
    isIntro: true
  },
  {
    selector: ".nav-links a[href='index.html#units']",
    text: "Buradan ünite sayfalarına geçebilirsin."
  },
  {
    selector: ".nav-links a[href='index.html#about']",
    text: "Bu bağlantı seni 'Hakkımızda' bölümüne götürür."
  },
  {
    selector: ".nav-links a[href='index.html#contact']",
    text: "Görüş ve öneri formuna buradan ulaşabilirsin."
  },
  {
    selector: ".nav-links a[href='Forum/forum.html']",
    text: "Forum sayfasına geçiş için burayı kullanabilirsin."
  },
  {
    selector: "#themeToggle",
    text: "Buradan açık / koyu tema arasında geçiş yapabilirsin."
  },
  {
    selector: "#units",
    text: "Burada tüm öğrenim ünitelerine erişebilirsin."
  },
  {
    selector: "#chatbase-bubble",
    text: "Soruların için sohbet botunu kullanabilirsin."
  },
  {
    selector: "body",
    text: "Tebrikler! Artık platformu kullanmaya hazırsın 🎉",
    isFinal: true
  }
];


let currentStep = 0;

function showOnboardingStep() {
  const step = onboardingSteps[currentStep];
  const target = document.querySelector(step.selector);
  const tooltip = document.getElementById("onboardingTooltip");
  const tooltipBox = document.getElementById("tooltipBox");
  const overlay = document.getElementById("onboardingOverlay");
  const text = document.getElementById("tooltipText");

  if (!tooltip || !tooltipBox || !overlay || !text) return;

  removeHighlights();
  tooltip.classList.remove("hidden");
  overlay.classList.remove("hidden");

  const nextButton = tooltipBox.querySelector("button");

  // Hoş geldin (ortalanmış sabit pozisyon)
  if (step.isIntro) {
    text.innerText = step.text;
    tooltip.style.position = "fixed";
    tooltip.style.top = "50%";
    tooltip.style.left = "50%";
    tooltip.style.transform = "translate(-50%, -50%)";
    nextButton.textContent = "İleri";
    nextButton.onclick = nextStep;
    return;
  }

  // Final adım
  if (step.isFinal) {
    text.innerText = step.text;
    tooltip.style.position = "fixed";
    tooltip.style.top = "50%";
    tooltip.style.left = "50%";
    tooltip.style.transform = "translate(-50%, -50%)";
    nextButton.textContent = "Başla";
    nextButton.onclick = () => {
      tooltip.classList.add("hidden");
      overlay.classList.add("hidden");
      localStorage.setItem("hasSeenOnboarding", "true");
      enablePageInteraction();
    };
    return;
  }

  if (!target) return;

  target.classList.add("highlighted");
  text.innerText = step.text;

  const rect = target.getBoundingClientRect();
  const spacing = 12;
  const tooltipHeight = tooltipBox.offsetHeight;
  const tooltipWidth = tooltipBox.offsetWidth;

  let top = rect.bottom + spacing;
  let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);

  if (top + tooltipHeight > window.innerHeight) {
    top = rect.top - tooltipHeight - spacing;
  }
  if (top < 0) top = 10;
  if (left + tooltipWidth > window.innerWidth) {
    left = window.innerWidth - tooltipWidth - spacing;
  }
  if (left < 0) left = 10;

  tooltip.style.position = "absolute";
  tooltip.style.top = `${top + window.scrollY}px`;
  tooltip.style.left = `${left + window.scrollX}px`;
  tooltip.style.transform = "none";

  nextButton.textContent = "İleri";
  nextButton.onclick = nextStep;
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
    if (!el.closest('#tooltipBox')) {
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
