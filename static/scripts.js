document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("forecastDate").valueAsDate = new Date();
    fetchForecast();
});

function fetchForecast() {
    const selectedDate = document.getElementById("forecastDate").value;
    if (!selectedDate) {
        alert("Please select a date.");
        return;
    }
    fetch(`/forecast?date=${selectedDate}`)
    .then(response => response.json())
    .then(data => {
        let tableHtml = "<tr><th>Date</th><th>Sky</th><th>Feels Like Max</th><th>Feels Like Min</th><th>Wind</th><th>Wind Dir</th><th>Sunrise</th><th>Sunset</th></tr>";
        data.forEach(forecast => {
            tableHtml += `<tr>
                            <td>${forecast.date}</td>
                            <td>${forecast.sky}</td>
                            <td>${forecast.feels_like_day}°C</td>
                            <td>${forecast.feels_like_night}°C</td>
                            <td>${windSpeedToLabel(forecast.wind_speed)}</td>
                            <td>${forecast.wind_direction}</td>
                            <td>${forecast.sunrise}</td>
                            <td>${forecast.sunset}</td>
                          </tr>`;
        });
        document.getElementById("forecastTableBody").innerHTML = tableHtml;
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
}

function windSpeedToLabel(windSpeed) {
    if (windSpeed >= 21) {
        return "Don't go outside";
    } else if (windSpeed >= 14) {
        return 'Storm';
    } else if (windSpeed >= 5.5) {
        return 'Moderate Breeze';
    } else if (windSpeed >= 3.3) {
        return 'Gentle Breeze';
    } else if (windSpeed >= 5.5) {
        return 'Light Breeze';
    } else if (windSpeed >= 1) {
        return 'Almost no Wind';
    } else {
        return 'No Wind';
    }
}

document.addEventListener("input", function(event) {
    let pixelWidth = parseFloat(document.getElementById("pixelWidth").value);
    let pixelHeight = parseFloat(document.getElementById("pixelHeight").value);
    let aspectWidth = parseFloat(document.getElementById("aspectWidth").value);
    let aspectHeight = parseFloat(document.getElementById("aspectHeight").value);

    let pixelSizeFilled = !isNaN(pixelWidth) && pixelWidth !== 0 && !isNaN(pixelHeight) && pixelHeight !== 0;
    let aspectRatioFilled = !isNaN(aspectWidth) && aspectWidth !== 0 || !isNaN(aspectHeight) && aspectHeight !== 0;

    if (aspectRatioFilled && ["aspectWidth", "aspectHeight"].includes(event.target.id)) {
        if (event.target.id === "aspectWidth") {
            document.getElementById("aspectHeight").value = (aspectWidth / pixelWidth) * pixelHeight;
        } else if (event.target.id === "aspectHeight") {
            document.getElementById("aspectWidth").value = (aspectHeight / pixelHeight) * pixelWidth;
        }
    }
});

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