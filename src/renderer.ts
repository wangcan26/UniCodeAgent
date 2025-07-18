document.addEventListener('DOMContentLoaded', () => {
  // Get elements
  const passwordInput = document.getElementById('passwordInput') as HTMLInputElement;
  const questionInput = document.getElementById('questionInput') as HTMLInputElement;
  const answerDiv = document.getElementById('answer') as HTMLDivElement;
  const agentReady = document.getElementById('agentReady') as HTMLDivElement;
  const questionSection = document.getElementById('questionSection') as HTMLDivElement;

  passwordInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      const password = passwordInput.value;
      const isValid = /^sk-[0-9a-f]{32}$/.test(password);
      
      const passwordSuccess = document.getElementById('passwordSuccess') as HTMLDivElement;
      if (isValid) {
        // Valid password
        passwordInput.disabled = true;
        passwordInput.style.backgroundColor = '#f0f0f0';
        passwordSuccess.style.display = 'block';
        console.log('Valid password entered');
        await window.electronAPI.createAgent(password);
        passwordSuccess.style.display = 'none';
        agentReady.style.display = 'block';
        questionSection.style.display = 'block';
      } else {
        passwordSuccess.style.display = 'none';
        // Invalid password
        alert('Invalid password format. Example: sk-406736f3f2374d5dad79fa3a46855ee0');
        passwordInput.value = '';
        passwordInput.focus();
      }
    }
  });

  questionInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      const question = questionInput.value;
      if (question) {
        questionInput.disabled = true;
        answerDiv.style.display = 'block';
        answerDiv.textContent = 'Thinking...';
        try {
          const answer = await window.electronAPI.askQuestion(question);
          answerDiv.textContent = answer;
        } catch (error) {
          console.error('Error asking question:', error);
          answerDiv.textContent = 'Error: Could not get an answer.';
        } finally {
          questionInput.disabled = false;
          questionInput.value = '';
        }
      }
    }
  });
});
