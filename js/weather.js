document.addEventListener('DOMContentLoaded', function () {
    const weatherBox = document.querySelector('.box-2-content');
    const dropdown = document.getElementById('day-selector');

    const apiUrl = '/weather';

    let forecastData = [];

    // Fetch weather data
    async function fetchWeather() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (response.ok) {
                forecastData = data.daily;
                populateDropdown(forecastData);
                displayWeather(forecastData[0]);
            } else {
                weatherBox.innerHTML = 'Error fetching weather data';
            }
        } catch (error) {
            weatherBox.innerHTML = 'Unable to retrieve weather information';
        }
    }

    // Populate the dropdown with dates
    function populateDropdown(forecastData) {
        forecastData.forEach((dayData, index) => {
            const option = document.createElement('option');
            const date = new Date(dayData.dt * 1000);
            option.value = index;
            option.textContent = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            dropdown.appendChild(option);
        });
    }

    // Display weather data for a selected day
    function displayWeather(dayData) {
        const temp = Math.round(dayData.temp.day);
        const icon = dayData.weather[0].icon;
        const description = dayData.weather[0].description;
        const humidity = dayData.humidity;
        const windSpeed = dayData.wind_speed;
        const precipitation = dayData.rain || 0;
        const feelsLike = Math.round(dayData.feels_like.day);
        const visibility = (dayData.visibility ? dayData.visibility / 1000 : 10).toFixed(1);

        weatherBox.innerHTML = `
            <div style="display: flex; align-items: center;  list-style: none; gap: 0.8rem;">
                <ul>
                    <li><img src="assets/images/weather/${icon}@2x.png" alt="${description}" /></li>
                </ul>
                <ul>
                    <li style="font-size: 2.3rem; font-weight: bold;">${temp}°C</li>
                    <li style="font-size: .7rem;">Feels Like: ${feelsLike}°C</li>
                </ul>
                <ul>
                    <li style="font-size: 0.7rem;">Wind: ${windSpeed} km/h</li>
                    <li style="font-size: 0.7rem;">Humidity: ${humidity}%</li>
                    <li style="font-size: 0.7rem;">Visibility: ${visibility} Km</li>
                    <li style="font-size: 0.7rem;">Precipitation: ${precipitation} mm</li>

                    </ul>
            </div>
        `;
    }

    // Event listener for dropdown change
    dropdown.addEventListener('change', function () {
        const selectedIndex = parseInt(dropdown.value);
        displayWeather(forecastData[selectedIndex]);
    });

    // Fetch weather data on page load
    fetchWeather();
});