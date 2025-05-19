document.addEventListener("DOMContentLoaded", () => {
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

  const questions = [
    { q: "1. Almanca 'Benim adım Ahmet.' nasıl söylenir?", a: "Ich heiße Ahmet" },
    { q: "2. 'Ben 20 yaşındayım.' cümlesi Almanca'da nasıl söylenir?", a: "Ich bin 20 Jahre alt" },
    { q: "3. 'Ben Türkiye'den geliyorum.' cümlesi Almanca'da nasıl söylenir?", a: "Ich komme aus der Türkei" },
    { q: "4. 'Ben Ankara'da yaşıyorum.' cümlesi Almanca'da nasıl söylenir?", a: "Ich wohne in Ankara" }
  ];

  const mcqQuestions = [
    {
      q: "Aşağıdakilerden hangisi 'Benim adım Ali' cümlesinin Almanca karşılığıdır?",
      options: ["Ich bin Ali", "Ich heiße Ali", "Ich komme aus Ali"],
      answer: "Ich heiße Ali"
    }
  ];

  const quizContainer = document.getElementById('quiz');
  const mcqContainer = document.getElementById('mcq');
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');

  questions.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'question-block';
    div.innerHTML = `
      <h3>${item.q}</h3>
      <input type="text" placeholder="Cevabınızı yazın..." oninput="updateProgress()" data-answer="${item.a}">
      <div class="feedback" id="feedback-${index}"></div>
    `;
    quizContainer.appendChild(div);
  });

  mcqQuestions.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'question-block';
    let optionsHtml = '';
    item.options.forEach(opt => {
      optionsHtml += `<label><input type="radio" name="mcq${index}" value="${opt}"> ${opt}</label><br>`;
    });
    div.innerHTML = `
      <h3>${item.q}</h3>
      ${optionsHtml}
      <div class="feedback" id="mcq-feedback-${index}"></div>
    `;
    mcqContainer.appendChild(div);
  });

  window.updateProgress = function () {
    const inputs = document.querySelectorAll('.question-block input[type="text"]');
    const total = inputs.length;
    const answered = [...inputs].filter(i => i.value.trim() !== '').length;
    const percent = Math.round((answered / total) * 100);
    progressBar.style.width = percent + '%';
    progressPercent.textContent = percent + '%';
  };

  window.checkAnswers = function () {
    document.querySelectorAll('.question-block input[type="text"]').forEach((input, index) => {
      const feedback = document.getElementById(`feedback-${index}`);
      const correct = input.dataset.answer.trim().toLowerCase();
      const user = input.value.trim().toLowerCase();

      if (user === correct) {
        feedback.textContent = '✔ Doğru';
        feedback.className = 'feedback correct';
      } else {
        feedback.textContent = `✖ Yanlış - Doğru cevap: ${input.dataset.answer}`;
        feedback.className = 'feedback incorrect';
      }
    });

    mcqQuestions.forEach((item, index) => {
      const selected = document.querySelector(`input[name='mcq${index}']:checked`);
      const feedback = document.getElementById(`mcq-feedback-${index}`);
      if (selected) {
        if (selected.value === item.answer) {
          feedback.textContent = '✔ Doğru';
          feedback.className = 'feedback correct';
        } else {
          feedback.textContent = `✖ Yanlış - Doğru cevap: ${item.answer}`;
          feedback.className = 'feedback incorrect';
        }
      } else {
        feedback.textContent = '✖ Cevap seçilmedi';
        feedback.className = 'feedback incorrect';
      }
    });
  };
});
