// Tema değiştirme
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') document.body.classList.add('dark');
themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const mode = document.body.classList.contains('dark') ? 'dark' : 'light';
  themeToggle.textContent = mode === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', mode);
});

// Eşleştirme değerlendirme fonksiyonu
function checkMatchAnswers() {
  let correctCount = 0;
  const selects = document.querySelectorAll('select');
  selects.forEach(select => {
    const correct = select.dataset.answer;
    const user = select.value;
    if (user === correct) {
      correctCount++;
      select.style.borderColor = 'green';
    } else {
      select.style.borderColor = 'red';
    }
  });
  const feedback = document.getElementById('match-feedback');
  feedback.textContent = `${correctCount} doğru eşleşme yapıldı.`;
}

// Chatbase entegrasyonu
(function(){
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
  if (document.readyState === "complete") {
    onLoad();
  } else {
    window.addEventListener("load", onLoad);
  }
})();
