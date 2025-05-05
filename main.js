window.addEventListener('DOMContentLoaded', () => {
    fetch('https://zenquotes.io/api/random')
      .then(res => res.json())
      .then(data => {
        document.getElementById('quote-text').textContent = `"${data[0].q}" — ${data[0].a}`;
      })
      .catch(err => {
        document.getElementById('quote-text').textContent = 'Failed to load quote.';
        console.error(err);
      });
  
    setupVoiceCommands();
  });
  
  function setupVoiceCommands() {
    if (annyang) {
      const commands = {
        'hello': () => alert('Hello World'),
        'change the color to *color': (color) => {
          document.body.style.backgroundColor = color;
        },
        'navigate to *page': (page) => {
          page = page.toLowerCase();
          if (page === 'home') window.location.href = 'assignment2.html';
          else if (page === 'stocks') window.location.href = 'stocks.html';
          else if (page === 'dogs') window.location.href = 'dogs.html';
        }
      };
      annyang.addCommands(commands);
    }
  }
  
  function startListening() {
    if (annyang) annyang.start();
  }
  
  function stopListening() {
    if (annyang) annyang.abort();
  }
  