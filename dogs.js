function loadRandomDogs() {
    fetch('https://dog.ceo/api/breeds/image/random/10')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('dog-carousel');
        container.innerHTML = '';
        data.message.forEach(url => {
          const img = document.createElement('img');
          img.src = url;
          img.classList.add('dog-img');
          container.appendChild(img);
        });
      });
  }
  
  function loadBreeds() {
    fetch('https://api.thedogapi.com/v1/breeds')
      .then(res => res.json())
      .then(data => {
        const breedList = document.getElementById('breed-list');
        breedList.innerHTML = '';
  
        data.forEach(breed => {
          const button = document.createElement('button');
          button.className = 'custom-button';
          button.textContent = breed.name;
          button.onclick = () => showBreedInfo(breed);
          button.setAttribute('data-name', breed.name.toLowerCase());
          breedList.appendChild(button);
        });
  
        window.breedData = data;
      });
  }
  
  function showBreedInfo(breed) {
    document.getElementById('breed-info').style.display = 'block';
    document.getElementById('breed-name').textContent = breed.name;
    document.getElementById('breed-description').textContent = breed.temperament || 'No description available';
  
    const lifeSpan = breed.life_span || '';
    const parts = lifeSpan.split(' ');
    document.getElementById('min-life').textContent = parts[0] || 'N/A';
    document.getElementById('max-life').textContent = parts[2] || 'N/A';
  }
  
  function setupVoiceCommands() {
    if (annyang) {
      const commands = {
        'load dog breed *name': function(name) {
          if (!window.breedData) return;
          const match = window.breedData.find(b => b.name.toLowerCase() === name.toLowerCase());
          if (match) showBreedInfo(match);
        },
        'change the color to *color': function(color) {
          document.body.style.backgroundColor = color;
        },
        'navigate to *page': function(page) {
          page = page.toLowerCase();
          if (page === 'home') window.location.href = 'assignment2.html';
          else if (page === 'stocks') window.location.href = 'stocks.html';
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
  
  window.addEventListener('DOMContentLoaded', () => {
    loadRandomDogs();
    loadBreeds();
    setupVoiceCommands();
  });
  