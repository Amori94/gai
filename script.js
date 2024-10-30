function calculate() {
    let DI = parseFloat(document.getElementById('DI').value) || null;
    let I = (parseFloat(document.getElementById('I').value) || null) / 100;
    let T = parseFloat(document.getElementById('T').value) || null;
    let A = parseFloat(document.getElementById('A').value) || null;
    let CR = (parseFloat(document.getElementById('CR').value) || 0) / 100;

    let resultText = '';
    let summaryText = ''; // Variable para el texto del resumen

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

    // Crear el resumen de valores ingresados
    summaryText = `
        <strong>Resumen de Valores:</strong><br>
        Dinero Inicial (DI): ${DI ? DI.toFixed(2) : 'No ingresado'}<br>
        Interés Diario (I): ${I ? (I * 100).toFixed(2) + '%' : 'No ingresado'}<br>
        Tiempo (T): ${T ? T.toFixed(2) + ' días' : 'No ingresado'}<br>
        Acumulado (A): ${A ? A.toFixed(2) : 'No ingresado'}<br>
        Costo de Retiro (CR): ${CR ? (CR * 100).toFixed(2) + '%' : 'No ingresado'}
    `;

    // Mostrar el resultado y el resumen
    document.getElementById('result').innerText = resultText;
    document.getElementById('summary').innerHTML = summaryText;
}


function toggleMode() {
    const body = document.body;
    const calculator = document.querySelector('.calculator');
    const inputs = document.querySelectorAll('input');
    const buttons = document.querySelectorAll('button');
    const button = document.getElementById('toggle-mode');

    // Alternar entre los modos: Claro, Oscuro, y Pastel
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
