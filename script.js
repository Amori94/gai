// Alternancia de Pestañas
document.addEventListener('DOMContentLoaded', () => {
    renderPortfolios(); // Renderiza las carteras guardadas
    calculateTotals(); // Calcula los totales al cargar la página
    showTab('home'); // Muestra la pestaña "Inicio" al cargar
});

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none'); // Oculta todas las secciones
    document.getElementById(tabId).style.display = 'block'; // Muestra solo la sección seleccionada

    if (tabId === 'home') {
        calculateTotals(); // Actualiza los totales cada vez que se abre "Inicio"
    }
}


// Función de Modo Claro/Oscuro/Pastel
function toggleMode() {
    const body = document.body;
    const calculator = document.querySelector('.calculator');
    const portfolios = document.querySelectorAll('.portfolio-item');
    const inputs = document.querySelectorAll('input');
    const buttons = document.querySelectorAll('button');
    const button = document.getElementById('toggle-mode');

    if (body.classList.contains('dark-mode')) {
        // Cambiar de dark-mode a pastel-mode
        body.classList.remove('dark-mode');
        calculator.classList.remove('dark-mode');
        portfolios.forEach(portfolio => portfolio.classList.remove('dark-mode'));
        inputs.forEach(input => input.classList.remove('dark-mode'));
        buttons.forEach(button => button.classList.remove('dark-mode'));

        // Agregar pastel-mode
        body.classList.add('pastel-mode');
        calculator.classList.add('pastel-mode');
        portfolios.forEach(portfolio => portfolio.classList.add('pastel-mode'));
        inputs.forEach(input => input.classList.add('pastel-mode'));
        buttons.forEach(button => button.classList.add('pastel-mode'));

        button.textContent = "Modo Claro";
    } else if (body.classList.contains('pastel-mode')) {
        // Cambiar de pastel-mode a modo claro
        body.classList.remove('pastel-mode');
        calculator.classList.remove('pastel-mode');
        portfolios.forEach(portfolio => portfolio.classList.remove('pastel-mode'));
        inputs.forEach(input => input.classList.remove('pastel-mode'));
        buttons.forEach(button => button.classList.remove('pastel-mode'));

        button.textContent = "Modo Oscuro";
    } else {
        // Cambiar a dark-mode
        body.classList.add('dark-mode');
        calculator.classList.add('dark-mode');
        portfolios.forEach(portfolio => portfolio.classList.add('dark-mode'));
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
    const startDateInput = prompt("Ingresa la fecha de inicio (YYYY-MM-DD):");
    const interestInput = parseFloat(prompt("Ingresa la tasa de interés diario (puede ser un % o un monto fijo):"));
    const isPercentage = confirm("¿Es un porcentaje de interés diario? (Aceptar = Sí, Cancelar = No)");

    const startDate = new Date(startDateInput);
    if (name && !isNaN(initialAmount) && startDate && !isNaN(interestInput)) {
        portfolios.push({
            name: name,
            initialAmount: initialAmount,
            currentAmount: initialAmount,
            dailyGain: 0,
            totalWithdrawn: 0,
            startDate: startDateInput,
            dailyInterest: interestInput,
            isPercentage: isPercentage
        });
        addLogEntry(`Comienzo de Cartera "${name}" con $${initialAmount.toFixed(2)}`);
        savePortfolios();
        renderPortfolios();
    } else {
        alert("Por favor ingresa valores válidos para todos los campos.");
    }
}


function addDailyGain(index) {
    const gain = parseFloat(prompt("Ingresa la ganancia diaria:"));
    if (!isNaN(gain)) {
        portfolios[index].currentAmount += gain;
        portfolios[index].dailyGain = gain;
        addLogEntry(`Ganancia Diaria $${gain.toFixed(2)} en cartera "${portfolios[index].name}"`);
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
        portfolios[index].totalWithdrawn += withdrawal;
        addLogEntry(`Retiro de $${withdrawal.toFixed(2)} de la cartera "${portfolios[index].name}"`);
        savePortfolios();
        renderPortfolios();
    } else {
        alert("Por favor ingresa una cantidad válida que no exceda el monto actual.");
    }
}

// Nueva función para eliminar una cartera
function deletePortfolio(index) {
    if (confirm("¿Estás seguro de que deseas eliminar esta cartera?")) {
        addLogEntry(`Eliminación de cartera "${portfolios[index].name}" con monto actual $${portfolios[index].currentAmount.toFixed(2)}`);
        portfolios.splice(index, 1);
        savePortfolios();
        renderPortfolios();
    }
}

function calculateTotals() {
    const totalAmount = portfolios.reduce((sum, portfolio) => sum + portfolio.currentAmount, 0);
    const totalDailyGain = portfolios.reduce((sum, portfolio) => sum + portfolio.dailyGain, 0);
    const totalWithdrawn = portfolios.reduce((sum, portfolio) => sum + (portfolio.totalWithdrawn || 0), 0); // Evita NaN

    // Calcular la ganancia estimada del día sumando todas las ganancias estimadas
    const estimatedDailyGain = portfolios.reduce((sum, portfolio) => {
        let estimatedGain = portfolio.isPercentage 
            ? portfolio.currentAmount * (portfolio.dailyInterest / 100)
            : portfolio.dailyInterest;
        return sum + estimatedGain;
    }, 0);

    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
    document.getElementById('total-daily-gain').textContent = totalDailyGain.toFixed(2);
    document.getElementById('total-withdrawn').textContent = totalWithdrawn.toFixed(2);
    document.getElementById('estimated-daily-gain').textContent = estimatedDailyGain.toFixed(2); // Mostrar la ganancia estimada del día
}

function renderPortfolios() {
    const portfoliosList = document.getElementById('portfolios-list');
    portfoliosList.innerHTML = '';
    
    portfolios.forEach((portfolio, index) => {
        if (typeof portfolio.totalWithdrawn === 'undefined') {
            portfolio.totalWithdrawn = 0;
        }

        // Calcular los días desde el inicio
        const startDate = new Date(portfolio.startDate);
        const today = new Date();
        const daysActive = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

        // Calcular la ganancia estimada para hoy
        let estimatedGain;
        if (portfolio.isPercentage) {
            estimatedGain = portfolio.currentAmount * (portfolio.dailyInterest / 100);
        } else {
            estimatedGain = portfolio.dailyInterest;
        }

        const portfolioDiv = document.createElement('div');
        portfolioDiv.classList.add('portfolio-item');

        if (document.body.classList.contains('dark-mode')) {
            portfolioDiv.classList.add('dark-mode');
        } else if (document.body.classList.contains('pastel-mode')) {
            portfolioDiv.classList.add('pastel-mode');
        }

        portfolioDiv.innerHTML = `
            <h3>${portfolio.name}</h3>
            <p>Monto Inicial: ${portfolio.initialAmount.toFixed(2)}</p>
            <p>Monto Actual: ${portfolio.currentAmount.toFixed(2)}</p>
            <p>Ganancia Diaria: ${portfolio.dailyGain.toFixed(2)}</p>
            <p>Días Activos: ${daysActive}</p>
            <p>Ganancia Estimada para Hoy: ${estimatedGain.toFixed(2)}</p>
            <button onclick="addDailyGain(${index})">Agregar Ganancia Diaria</button>
            <button onclick="withdrawAmount(${index})">Retirar Dinero</button>
            <button onclick="deletePortfolio(${index})">Eliminar Cartera</button>
        `;
        
        portfoliosList.appendChild(portfolioDiv);
    });

    savePortfolios();
}

let logEntries = JSON.parse(localStorage.getItem('logEntries')) || [];

// Función para agregar una entrada al log
function addLogEntry(description) {
    const date = new Date().toLocaleDateString('es-ES');
    logEntries.push({ date, description });
    localStorage.setItem('logEntries', JSON.stringify(logEntries));
    renderLog();
}

// Función para mostrar el log
function renderLog() {
    const logList = document.getElementById('log-list');
    logList.innerHTML = '';
    
    logEntries.forEach(entry => {
        const logEntryDiv = document.createElement('div');
        logEntryDiv.classList.add('log-entry');
        
        // Aplicar estilos según el modo actual
        if (document.body.classList.contains('dark-mode')) {
            logEntryDiv.classList.add('dark-mode');
        } else if (document.body.classList.contains('pastel-mode')) {
            logEntryDiv.classList.add('pastel-mode');
        }

        logEntryDiv.innerHTML = `<strong>${entry.date}</strong> - ${entry.description}`;
        logList.appendChild(logEntryDiv);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderLog(); // Renderiza el log al cargar
    renderPortfolios();
});