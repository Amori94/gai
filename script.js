function calculate() {
    // Obtener valores de los inputs
    let DI = parseFloat(document.getElementById('DI').value) || null;
    let I = (parseFloat(document.getElementById('I').value) || null) / 100;
    let T = parseFloat(document.getElementById('T').value) || null;
    let A = parseFloat(document.getElementById('A').value) || null;
    let CR = (parseFloat(document.getElementById('CR').value) || 0) / 100;

    // Calcular el valor faltante
    if (DI === null && I !== null && T !== null && A !== null) {
        DI = A / ((1 + I) ** T);
    } else if (I === null && DI !== null && T !== null && A !== null) {
        I = (A / DI ** (1 / T)) - 1;
    } else if (T === null && DI !== null && I !== null && A !== null) {
        T = Math.log(A / DI) / Math.log(1 + I);
    } else if (A === null && DI !== null && I !== null && T !== null) {
        A = DI * ((1 + I) ** T);
    } else {
        document.getElementById('result').innerText = 'Por favor, deja una de las variables vacía.';
        return;
    }

    // Aplicar costo de retiro
    if (CR > 0) {
        A = A * (1 - CR);
    }

    // Mostrar resultado
    document.getElementById('result').innerText = `Resultado Final (A): ${A.toFixed(2)}`;
}


function toggleMode() {
    document.body.classList.toggle('dark-mode');
    const calculator = document.querySelector('.calculator');
    const inputs = document.querySelectorAll('input');
    const buttons = document.querySelectorAll('button');

    calculator.classList.toggle('dark-mode');

    inputs.forEach(input => input.classList.toggle('dark-mode'));
    buttons.forEach(button => button.classList.toggle('dark-mode'));

    const button = document.getElementById('toggle-mode');
    button.textContent = button.textContent === "Modo Oscuro" ? "Modo Claro" : "Modo Oscuro";
}
