function calculatePercentage() {
    const num1 = parseFloat(document.getElementById("num1").value);
    const percent = parseFloat(document.getElementById("percent").value);

    if (isNaN(num1) || isNaN(percent)) {
        document.getElementById("result1").innerText = "N/A";
        return;
    }

    const result = (num1 * percent) / 100;
    document.getElementById("result1").innerText = result.toFixed(2);
}

function calculateWhatPercentageOf() {
    const num2 = parseFloat(document.getElementById("num2").value);
    const num3 = parseFloat(document.getElementById("num3").value);

    if (isNaN(num2) || isNaN(num3)) {
        document.getElementById("result2").innerText = "N/A";
        return;
    }

    const result = (num2 / num3) * 100;
    document.getElementById("result2").innerText = result.toFixed(2) + '%';
}

function calculatePercentageChange() {
    const start = parseFloat(document.getElementById("start").value);
    const end = parseFloat(document.getElementById("end").value);

    if (isNaN(start) || isNaN(end)) {
        document.getElementById("result3").innerText = "N/A";
        return;
    }

    const result = ((end - start) / Math.abs(start)) * 100;
    document.getElementById("result3").innerText = result.toFixed(2) + '%';
}

function addVAT() {
    const vatInput = parseFloat(document.getElementById("vatInput").value);

    if (isNaN(vatInput)) {
        document.getElementById("resultVAT").innerText = "N/A";
        return;
    }

    const result = vatInput * 1.05;
    document.getElementById("resultVAT").innerText = result.toFixed(2);
}

function removeVAT() {
    const vatInput = parseFloat(document.getElementById("vatInput").value);

    if (isNaN(vatInput)) {
        document.getElementById("resultVAT").innerText = "N/A";
        return;
    }

    const result = vatInput / 1.05;
    document.getElementById("resultVAT").innerText = result.toFixed(2);
}
