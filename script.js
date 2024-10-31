// Alternancia de Pestañas
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
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
        Interés Diario (I): ${I ? (I * 100).toFixed(2) + '%' : 'N/A'}<br>
        Tiempo (T): ${T ? T.toFixed(2) : 'N/A'} días<br>
        Acumulado Final (A): ${A ? A.toFixed(2) : 'N/A'}
    `;

    document.getElementById('result').innerText = resultText;
    document.getElementById('summary').innerHTML = summaryText;
}

// Funciones de Cartera de Inversiones
let portfolios = JSON.parse(localStorage.getItem('portfolios')) || [];

// Función para guardar carteras en localStorage
function savePortfolios() {
    localStorage.setItem('portfolios', JSON.stringify(portfolios));
}

// Crear nueva cartera
function createNewPortfolio() {
    const name = document.getElementById('cartera-nombre').value;
    const initialAmount = parseFloat(document.getElementById('monto-inicial').value);
    const dailyInterest = parseFloat(document.getElementById('interes-diario').value) || 0;
    const goal = parseFloat(document.getElementById('meta').value) || 0;

    if (name && initialAmount) {
        portfolios.push({
            name: name,
            initialAmount: initialAmount,
            currentAmount: initialAmount,
            dailyGain: 0,
            dailyInterest: dailyInterest,
            goal: goal,
            creationDate: new Date().toLocaleDateString()
        });
        savePortfolios();
        renderPortfolios();
    } else {
        alert("Por favor ingresa un nombre y un monto inicial válido.");
    }
}

// Agregar ganancia diaria
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

// Retirar dinero de una cartera
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

// Eliminar una cartera
function deletePortfolio(index) {
    if (confirm("¿Estás seguro de que deseas eliminar esta cartera?")) {
        portfolios.splice(index, 1);
        savePortfolios();
        renderPortfolios();
    }
}

// Renderizar la lista de carteras
function renderPortfolios() {
    const portfoliosList = document.getElementById('portfolios-list');
    portfoliosList.innerHTML = '';
    
    portfolios.forEach((portfolio, index) => {
        const portfolioDiv = document.createElement('div');
        portfolioDiv.classList.add('portfolio-item');
        
        portfolioDiv.innerHTML = `
            <h3>${portfolio.name}</h3>
            <p>Fecha de Creación: ${portfolio.creationDate}</p>
            <p>Monto Inicial: ${portfolio.initialAmount.toFixed(2)}</p>
            <p>Monto Actual: ${portfolio.currentAmount.toFixed(2)}</p>
            <p>Ganancia Diaria: ${portfolio.dailyGain.toFixed(2)}</p>
            <p>Interés Diario: ${portfolio.dailyInterest.toFixed(2)}%</p>
            <p>Meta: ${portfolio.goal.toFixed(2)}%</p>
            <button onclick="addDailyGain(${index})">Agregar Ganancia Diaria</button>
            <button onclick="withdrawAmount(${index})">Retirar Dinero</button>
            <button onclick="deletePortfolio(${index})">Eliminar Cartera</button>
        `;
        
        portfoliosList.appendChild(portfolioDiv);
    });
}

document.addEventListener('DOMContentLoaded', renderPortfolios);
