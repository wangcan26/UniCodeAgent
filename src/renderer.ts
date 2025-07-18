document.addEventListener('DOMContentLoaded', () => {
  // Get elements
  const questionInput = document.getElementById('questionInput') as HTMLInputElement;
  const messageDiv = document.createElement('div');
  messageDiv.style.marginTop = '10px';
  messageDiv.style.color = 'green';
  document.body.appendChild(messageDiv);

  // Handle messages from main process
  window.electronAPI.onInitialize(async (message: string) => {
    const isValid = /^sk-[0-9a-f]{32}$/.test(message);
    if (isValid) {
      agentReady.textContent = 'Agent is Ready';
      agentReady.style.display = 'block';
      await window.electronAPI.createAgent(message);
      questionSection.style.display = 'block';
    } else {
      agentReady.textContent = 'Agent API Key is not valid';
      agentReady.style.color = 'red';
      agentReady.style.display = 'block';
    }
  });
  const answerDiv = document.getElementById('answer') as HTMLDivElement;
  const agentReady = document.getElementById('agentReady') as HTMLDivElement;
  const questionSection = document.getElementById('questionSection') as HTMLDivElement;

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
