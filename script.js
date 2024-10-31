let carteras = [];

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
        document.getElementById('result').innerText = `El dinero inicial debería ser: ${DI.toFixed(2)}`;
    } else if (I === null && DI !== null && T !== null && A !== null) {
        I = (A / DI ** (1 / T)) - 1;
        document.getElementById('result').innerText = `El interés diario debería ser: ${I.toFixed(2)}%`;
    } else if (T === null && DI !== null && I !== null && A !== null) {
        T = Math.log(A / DI) / Math.log(1 + I);
        document.getElementById('result').innerText = `Con estas variables llegarías a ese monto en: ${Math.round(T)} días`;
    } else if (A === null && DI !== null && I !== null && T !== null) {
        A = DI * ((1 + I) ** T);
        document.getElementById('result').innerText = `El acumulado sería: ${A.toFixed(2)}`;
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

function agregarCartera(nombre, montoInicial, interesDiario) {
    const fechaCreacion = new Date().toLocaleDateString();
    const cartera = {
        nombre,
        montoInicial,
        montoActual: montoInicial,
        interesDiario,
        diasActivos: 0,
        gananciasDiarias: [],
        fechaCreacion,
        rendimientoAcumulado: 0,
        meta: 0,
        notas: [],
        historialTransacciones: []
    };
    carteras.push(cartera);
    actualizarCartera(cartera);
}

function actualizarCartera(cartera) {
    document.getElementById('titulo').innerText = cartera.nombre;
    document.getElementById('monto-actual').innerText = cartera.montoActual.toFixed(2);
    document.getElementById('ganancia-diaria').innerText = (cartera.montoActual * (cartera.interesDiario / 100)).toFixed(2);
    cartera.diasActivos += 1;
    document.getElementById('dias-activo').innerText = `${Math.floor(cartera.diasActivos / 30)} meses, ${Math.floor((cartera.diasActivos % 30) / 7)} semanas, ${cartera.diasActivos % 7} días`;
    
    // Calcular rendimiento acumulado
    cartera.rendimientoAcumulado = ((cartera.montoActual - cartera.montoInicial) / cartera.montoInicial) * 100;
    document.getElementById('rendimiento-acumulado').innerText = `${cartera.rendimientoAcumulado.toFixed(2)}% ($${(cartera.montoActual - cartera.montoInicial).toFixed(2)})`;
    
    // Aquí puedes añadir lógica para mostrar la meta, notas y historial de transacciones
}

function ingresarDinero() {
    const cantidad = parseFloat(prompt("Ingrese la cantidad de dinero a agregar:"));
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Ingrese una cantidad válida.");
        return;
    }
    const cartera = carteras[0]; // Suponiendo que estamos trabajando con la primera cartera
    cartera.montoActual += cantidad;
    actualizarCartera(cartera);
}

function verNotas() {
    const cartera = carteras[0]; // Suponiendo que estamos trabajando con la primera cartera
    const notas = cartera.notas.join("\n") || "No hay notas.";
    alert(notas);
}

function verBitacora() {
    const cartera = carteras[0]; // Suponiendo que estamos trabajando con la primera cartera
    const historial = cartera.historialTransacciones.join("\n") || "No hay historial de transacciones.";
    alert(historial);
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

