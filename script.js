// Alternancia de Pestañas
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    
    if (tabId === 'portfolios') {
        renderPortfolioChart(); // Renderiza el gráfico al mostrar la pestaña
    }
}

// Función de Modo Claro/Oscuro/Pastel
function toggleMode() {
    const body = document.body;
    const calculator = document.querySelector('.calculator');
    const inputs = document.querySelectorAll('input');
    const buttons = document.querySelectorAll('button');
    const button = document.getElementById('toggle-mode');

    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        calculator.classList.remove('dark-mode');
        inputs.forEach(input => input.classList.remove('dark-mode'));
        buttons.forEach(button => button.classList.remove('dark-mode'));

        body.classList.add('pastel-mode');
        calculator.classList.add('pastel-mode');
        inputs.forEach(input => input.classList.add('pastel-mode'));
        buttons.forEach(button => button.classList.add('pastel-mode'));

        button.textContent = "Modo Claro";
    } else if (body.classList.contains('pastel-mode')) {
        body.classList.remove('pastel-mode');
        calculator.classList.remove('pastel-mode');
        inputs.forEach(input => input.classList.remove('pastel-mode'));
        buttons.forEach(button => button.classList.remove('pastel-mode'));

        button.textContent = "Modo Oscuro";
    } else {
        body.classList.add('dark-mode');
        calculator.classList.add('dark-mode');
        inputs.forEach(input => input.classList.add('dark-mode'));
        buttons.forEach(button => button.classList.add('dark-mode'));

        button.textContent = "Modo Pastel";
    }
}

// Función de la Calculadora
function calculate() {
    let DI = parseFloat(document.getElementById('DI').value) || null;
    let I = (parseFloat(document.getElementById('I').value) || null) / 100;
    let T = parseFloat(document.getElementById('T').value) || null;
    let A = parseFloat(document.getElementById('A').value) || null;
    let CR = (parseFloat(document.getElementById('CR').value) || 0) / 100;

    let resultText = '';
    let summaryText = '';

    if (DI === null && I !== null && T !== null && A !== null) {
        DI = A / ((1 + I) ** T);
        resultText = `El dinero inicial debería ser: ${DI.toFixed(2)}`;
    } else if (I === null && DI !== null && T !== null && A !== null) {
        I = (A / DI) ** (1 / T) - 1;
        resultText = `La tasa de interés diaria debería ser: ${(I * 100).toFixed(2)}%`;
    } else if (T === null && DI !== null && I !== null && A !== null) {
        T = Math.log(A / DI) / Math.log(1 + I);
        resultText = `Con estas variables, llegarías a ese monto en: ${T.toFixed(2)} días`;
    } else if (A === null && DI !== null && I !== null && T !== null) {
        A = DI * ((1 + I) ** T);
        resultText = `El monto acumulado (A) sería: ${A.toFixed(2)}`;
    } else {
        document.getElementById('result').innerText = 'Por favor, deja una de las variables vacía.';
        document.getElementById('summary').innerText = '';
        return;
    }

    if (CR > 0 && A !== null) {
        A = A * (1 - CR);
        resultText += ` (después del costo de retiro: ${A.toFixed(2)})`;
    }

    summaryText = `
        <strong>Resumen de Valores:</strong><br>
        Dinero Inicial (DI): ${DI ? DI.toFixed(2) : 'N/A'}<br>
        Tasa de Interés (I): ${(I ? (I * 100).toFixed(2) : 'N/A') + '%' }<br>
        Tiempo (T): ${T ? T.toFixed(2) : 'N/A'} días<br>
        Monto Acumulado (A): ${A ? A.toFixed(2) : 'N/A'}
    `;

    document.getElementById('result').innerText = resultText;
    document.getElementById('summary').innerHTML = summaryText;
}

// Funciones de Cartera de Inversiones
let portfolios = JSON.parse(localStorage.getItem('portfolios')) || [];

function savePortfolios() {
    localStorage.setItem('portfolios', JSON.stringify(portfolios));
}

function createNewPortfolio() {
    const name = prompt("Ingresa el nombre de la nueva cartera:");
    const initialAmount = parseFloat(prompt("Ingresa el monto inicial:"));
    
    if (name && !isNaN(initialAmount)) {
        portfolios.push({
            name: name,
            initialAmount: initialAmount,
            currentAmount: initialAmount,
            dailyGain: 0
        });
        savePortfolios();
        renderPortfolios();
    } else {
        alert("Por favor ingresa un nombre y un monto inicial válido.");
    }
}

function addDailyGain(index) {
    const gain = parseFloat(prompt("Ingresa la ganancia diaria:"));
    if (!isNaN(gain)) {
        portfolios[index].currentAmount += gain;
        portfolios[index].dailyGain = gain;
        savePortfolios();
        renderPortfolios();
    } else {
        alert("Por favor ingresa una ganancia válida.");
    }
}

// Nueva función para retirar dinero de una cartera
function withdrawAmount(index) {
    const withdrawal = parseFloat(prompt("Ingresa la cantidad que deseas retirar:"));
    if (!isNaN(withdrawal) && withdrawal <= portfolios[index].currentAmount) {
        portfolios[index].currentAmount -= withdrawal;
        savePortfolios();
        renderPortfolios();
    } else {
        alert("Por favor ingresa una cantidad válida que no exceda el monto actual.");
    }
}

// Nueva función para eliminar una cartera
function deletePortfolio(index) {
    if (confirm("¿Estás seguro de que deseas eliminar esta cartera?")) {
        portfolios.splice(index, 1);
        savePortfolios();
        renderPortfolios();
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

document.addEventListener('DOMContentLoaded', renderPortfolios);
