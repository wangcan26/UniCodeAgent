/// <reference path="./types.d.ts" />

document.addEventListener('DOMContentLoaded', async () => {
  // Get elements first to avoid reference errors
  const answerDiv = document.getElementById('answer') as HTMLDivElement;
  const agentReady = document.getElementById('agentReady') as HTMLDivElement;
  const questionSection = document.getElementById('questionSection') as HTMLDivElement;
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

      // Add save graph button
      const saveGraphBtn = document.createElement('button');
      saveGraphBtn.textContent = 'Save Graph State';
      saveGraphBtn.style.margin = '10px 0';
      saveGraphBtn.style.padding = '8px 16px';
      saveGraphBtn.style.backgroundColor = '#4CAF50';
      saveGraphBtn.style.color = 'white';
      saveGraphBtn.style.border = 'none';
      saveGraphBtn.style.borderRadius = '4px';
      saveGraphBtn.style.cursor = 'pointer';
      
      saveGraphBtn.addEventListener('click', async () => {
        saveGraphBtn.disabled = true;
        saveGraphBtn.textContent = 'Saving...';
        
        // Remove previous status and graph
        const oldStatus = saveGraphBtn.nextElementSibling;
        if (oldStatus && oldStatus.tagName === 'DIV') {
          oldStatus.remove();
        }
        const oldGraph = document.getElementById('mermaidGraph');
        if (oldGraph) {
          oldGraph.remove();
        }

        try {
         const result = await window.electronAPI.saveGraphState();
        } catch (error) {
          const status = document.createElement('div');
          status.textContent = 'Failed to save graph';
          status.style.color = 'red';
          status.style.margin = '5px 0';
          saveGraphBtn.after(status);
        } finally {
          saveGraphBtn.disabled = false;
          const status = document.createElement('div');
          status.textContent = 'Success to save graph';
          status.style.color = 'blue';
          status.style.margin = '5px 0';
          saveGraphBtn.after(status);
          saveGraphBtn.textContent = 'Save Graph State';
        }
      });

      agentReady.after(saveGraphBtn);
      questionSection.style.display = 'block';
    } else {
      agentReady.textContent = 'Agent API Key is not valid';
      agentReady.style.color = 'red';
      agentReady.style.display = 'block';
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
          const html = await window.electronAPI.renderMarkdown(answer);
          answerDiv.innerHTML = html;
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
