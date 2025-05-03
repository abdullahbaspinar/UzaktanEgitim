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
      feedback.textContent = `${correctCount} doğru eşleşme yapıldı.`;}