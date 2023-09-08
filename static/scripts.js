// Function to calculate what is the percentage of a number
function calculatePercentage() {
    const num1 = parseFloat(document.getElementById("num1").value);
    const percent = parseFloat(document.getElementById("percent").value);
    if (isNaN(num1) || isNaN(percent)) {
        document.getElementById("result").innerText = "Please enter valid numbers.";
        return;
    }

    const result = (num1 * percent) / 100;
    document.getElementById("result1").innerText = result;
}

// Function to calculate what is the percentage of
function calculateWhatPercentageOf() {
    const num2 = parseFloat(document.getElementById("num2").value);
    const num3 = parseFloat(document.getElementById("num3").value);
    const result = (num2 / num3) * 100;
    document.getElementById("result2").innerText = result.toFixed(2) + '%';
}

// Function to calculate percentage change
function calculatePercentageChange() {
    const start = parseFloat(document.getElementById("start").value);
    const end = parseFloat(document.getElementById("end").value);
    const result = ((end - start) / Math.abs(start)) * 100;
    document.getElementById("result3").innerText = result.toFixed(2) + '%';
}

// Function to add VAT (5%)
function addVAT() {
    const vatInput = parseFloat(document.getElementById("vatInput").value);
    const result = vatInput * 1.05;
    document.getElementById("resultVAT").innerText = result.toFixed(2);
}

// Function to remove VAT (5%)
function removeVAT() {
    const vatInput = parseFloat(document.getElementById("vatInput").value);
    const result = vatInput / 1.05;
    document.getElementById("resultVAT").innerText = result.toFixed(2);
}

// Add event listeners to inputs for "Enter" key press
document.getElementById("percent").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        calculatePercentage();
    }
});

// Function to convert wind speed in m/s to a human-readable label
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

// Function to get weather and populate the table
function fetchForecast() {
    const selectedDate = document.getElementById("forecastDate").value;
    if (!selectedDate) {
        alert("Please select a date.");
        return;
    }
    fetch(`/forecast?date=${selectedDate}`)
    .then(response => response.json())
    .then(data => {
        let tableHtml = "<table><tr><th>Date</th><th>Sky</th><th>Feels Like Max</th><th>Feels Like Min</th><th>Wind</th><th>Wind Dir</th><th>Sunrise</th><th>Sunset</th></tr>";
        data.forEach(forecast => {
            tableHtml += `<tr>
                            <td>${forecast.date}</td>
                            <td>${forecast.sky}</td>
                            <td>${forecast.feels_like_day}°C</td>
                            <td>${forecast.feels_like_night}°C</td>
                            <td>${windSpeedToLabel(forecast.wind_speed)}</td>
                            <td>${forecast.wind_direction}</td>
                            <td>${forecast.sunrise}</td>  <!-- Added this line -->
                            <td>${forecast.sunset}</td>   <!-- Added this line -->
                          </tr>`;
        });        tableHtml += "</table>";
        document.getElementById("forecastResult").innerHTML = tableHtml;
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
}

// Your existing DOMContentLoaded event listener and other functions remain unchanged

document.addEventListener("DOMContentLoaded", function () {
    // ... (your existing code remains unchanged) ...
    document.getElementById("forecastDate").valueAsDate = new Date();
    fetchForecast();
});