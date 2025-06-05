// Firebase yapılandırması
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

// Onboarding adımları
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

  // Hoş geldin mesajı
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
      removeHighlights();
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

  target.scrollIntoView({ behavior: "smooth", block: "center" });
}

function nextStep() {
  currentStep++;
  if (currentStep < onboardingSteps.length) {
    showOnboardingStep();
  }
}

function removeHighlights() {
  document.querySelectorAll(".highlighted").forEach(el => {
    el.classList.remove("highlighted");
  });
}

// Sayfa yüklenince onboarding başlat
window.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("hasSeenOnboarding")) {
    setTimeout(showOnboardingStep, 500);
  }
});

// Chatbase botu yükle
(function () {
  if (!window.chatbase || window.chatbase("getState") !== "initialized") {
    window.chatbase = (...args) => {
      if (!window.chatbase.q) window.chatbase.q = [];
      window.chatbase.q.push(args);
    };
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "fmGhmZopdiKau9QTCrAFx";
    script.setAttribute("chatbase", "chatbase");
    document.body.appendChild(script);
  }
})();
