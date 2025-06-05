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
  const scrollTop = window.scrollY;
  const scrollLeft = window.scrollX;
  const spacing = 12;

  let top, left;

  // Ekranda yeterli boşluk varsa alta yerleştir
  if (rect.bottom + spacing + tooltipBox.offsetHeight < window.innerHeight) {
    top = rect.bottom + scrollTop + spacing;
    left = rect.left + scrollLeft;
  }
  // Üste sığarsa üste yerleştir
  else if (rect.top - spacing - tooltipBox.offsetHeight > 0) {
    top = rect.top + scrollTop - tooltipBox.offsetHeight - spacing;
    left = rect.left + scrollLeft;
  }
  // Sağa sığarsa sağa yerleştir
  else if (rect.right + spacing + tooltipBox.offsetWidth < window.innerWidth) {
    top = rect.top + scrollTop;
    left = rect.right + scrollLeft + spacing;
  }
  // Yoksa sola yerleştir
  else {
    top = rect.top + scrollTop;
    left = rect.left + scrollLeft - tooltipBox.offsetWidth - spacing;
  }

  // Ekran dışına taşmaması için sınırla
  top = Math.max(10, Math.min(top, document.body.scrollHeight - tooltipBox.offsetHeight - 10));
  left = Math.max(10, Math.min(left, document.body.scrollWidth - tooltipBox.offsetWidth - 10));

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;

  overlay.classList.remove("hidden");
  tooltip.classList.remove("hidden");

  text.innerText = step.text;

  target.scrollIntoView({ behavior: "smooth", block: "center" });
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
