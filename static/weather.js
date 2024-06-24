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
