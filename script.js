// Funciones de Cartera de Inversiones
let portfolios = JSON.parse(localStorage.getItem('portfolios')) || [];

function savePortfolios() {
    localStorage.setItem('portfolios', JSON.stringify(portfolios));
    renderPortfolioChart(); // Actualiza el gráfico al guardar
}

function createNewPortfolio() {
    const name = prompt("Ingresa el nombre de la nueva cartera:");
    const initialAmount = parseFloat(prompt("Ingresa el monto inicial:"));
    
    if (name && initialAmount) {
        portfolios.push({
            name: name,
            initialAmount: initialAmount,
            currentAmount: initialAmount,
            dailyGain: 0
        });
        savePortfolios();
        renderPortfolios(); // Renderiza la lista de carteras
    } else {
        alert("Por favor ingresa un nombre y un monto inicial válido.");
    }
}

function addDailyGain(index) {
    const gain = parseFloat(prompt("Ingresa la ganancia diaria:"));
    if (!isNaN(gain)) {
        portfolios[index].currentAmount += gain;
        portfolios[index].dailyGain = gain;
        savePortfolios(); // Guarda y actualiza el gráfico
    } else {
        alert("Por favor ingresa una ganancia válida.");
    }
}

// Nueva función para retirar dinero de una cartera
function withdrawAmount(index) {
    const withdrawal = parseFloat(prompt("Ingresa la cantidad que deseas retirar:"));
    if (!isNaN(withdrawal) && withdrawal <= portfolios[index].currentAmount) {
        portfolios[index].currentAmount -= withdrawal;
        savePortfolios(); // Guarda y actualiza el gráfico
    } else {
        alert("Por favor ingresa una cantidad válida que no exceda el monto actual.");
    }
}

// Nueva función para eliminar una cartera
function deletePortfolio(index) {
    if (confirm("¿Estás seguro de que deseas eliminar esta cartera?")) {
        portfolios.splice(index, 1);
        savePortfolios(); // Guarda y actualiza el gráfico
    }
}

// Renderiza la lista de carteras
function renderPortfolios() {
    const portfoliosList = document.getElementById('portfolios-list');
    portfoliosList.innerHTML = '';
    
    portfolios.forEach((portfolio, index) => {
        const portfolioDiv = document.createElement('div');
        portfolioDiv.classList.add('portfolio-item');
        
        portfolioDiv.innerHTML = `
            <h3>${portfolio.name}</h3>
            <p>Monto Inicial: ${portfolio.initialAmount.toFixed(2)}</p>
            <p>Monto Actual: ${portfolio.currentAmount.toFixed(2)}</p>
            <p>Ganancia Diaria: ${portfolio.dailyGain.toFixed(2)}</p>
            <button onclick="addDailyGain(${index})">Agregar Ganancia Diaria</button>
            <button onclick="withdrawAmount(${index})">Retirar Dinero</button>
            <button onclick="deletePortfolio(${index})">Eliminar Cartera</button>
        `;
        
        portfoliosList.appendChild(portfolioDiv);
    });
}

// Alternancia de Pestañas
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    
    if (tabId === 'portfolios') {
        renderPortfolioChart(); // Renderiza el gráfico al mostrar la pestaña
    }
}

// Función para renderizar el gráfico de torta
function renderPortfolioChart() {
    const ctx = document.getElementById('portfolioChart').getContext('2d');
    const currentAmounts = portfolios.map(portfolio => portfolio.currentAmount);
    const totalAmount = currentAmounts.reduce((acc, amount) => acc + amount, 0);
    
    if (totalAmount === 0) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return; // Si no hay carteras, no renderiza nada
    }

    const labels = portfolios.map(portfolio => portfolio.name);
    const data = currentAmounts.map(amount => (amount / totalAmount) * 100);
    
    // Configuración del gráfico de torta
    const portfolioChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Distribución de Portafolios',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Distribución de Portafolios'
                }
            }
        }
    });
}

// Carga inicial de carteras
document.addEventListener('DOMContentLoaded', () => {
    renderPortfolios();
    renderPortfolioChart(); // Renderiza el gráfico al cargar la página
});

