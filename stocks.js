const API_KEY = 'hNOWppVFQIt34xMMx_MQJIEiwjbM6RmW';

let chart;

function getStockData() {
  const ticker = document.getElementById('ticker').value.toUpperCase();
  const days = document.getElementById('days').value;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - parseInt(days));

  const formatDate = d => d.toISOString().split('T')[0];
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formatDate(startDate)}/${formatDate(endDate)}?adjusted=true&sort=asc&limit=120&apiKey=${API_KEY}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.results) throw new Error('No data');

      const labels = data.results.map(item => new Date(item.t).toLocaleDateString());
      const prices = data.results.map(item => item.c);

      const ctx = document.getElementById('stockChart').getContext('2d');
      if (chart) chart.destroy();
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `${ticker} Closing Price`,
            data: prices,
            borderColor: 'blue',
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    })
    .catch(err => {
      alert('Error retrieving stock data.');
      console.error(err);
    });
}

function getRedditStocks() {
  fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
    .then(res => res.json())
    .then(data => {
      const top5 = data.slice(0, 5);
      const tbody = document.querySelector('#reddit-table tbody');
      tbody.innerHTML = '';

      top5.forEach(stock => {
        const ticker = stock.ticker || 'N/A';
        const comments = stock.no_of_comments || 0;
        const sentiment = (stock.sentiment || '').toLowerCase();
        const icon = sentiment === 'bullish' ? '🐂' : '🐻';

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${ticker}</td>
          <td>${comments}</td>
          <td>${icon}</td>
          <td><a href="https://finance.yahoo.com/quote/${ticker}" target="_blank">Link</a></td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error('Reddit API error', err));
}

window.addEventListener('DOMContentLoaded', () => {
  getRedditStocks();
  setupVoiceCommands();
});

function setupVoiceCommands() {
    if (annyang) {
      const commands = {
        'lookup *ticker': function(ticker) {
          document.getElementById('ticker').value = ticker.toUpperCase();
          document.getElementById('days').value = '30';
          getStockData();
        },
        'change the color to *color': function(color) {
          document.body.style.backgroundColor = color;
        },
        'navigate to *page': function(page) {
          page = page.toLowerCase();
          if (page === 'home') window.location.href = 'assignment2.html';
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
  
  window.addEventListener('DOMContentLoaded', () => {
    getRedditStocks();
    setupVoiceCommands();
  });
  