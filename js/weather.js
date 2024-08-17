document.addEventListener('DOMContentLoaded', function () {
    const weatherBox = document.querySelector('.box-2-content');

    // Ensure the API key is valid
    const apiKey = 'e4509de89ea77b8a5413fcb18f456022';  // Replace this with your valid API key
    const city = 'Dubai';
    const units = 'metric'; // For Celsius
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;

    // Function to fetch weather data
    async function fetchWeather() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (response.ok) {
                displayWeather(data);
            } else {
                weatherBox.innerHTML = 'Error fetching weather data';
            }
        } catch (error) {
            weatherBox.innerHTML = 'Unable to retrieve weather information';
        }
    }

    // Function to display weather data
    function displayWeather(data) {
        const temp = Math.round(data.main.temp);
        const icon = data.weather[0].icon; // Weather icon code
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const precipitation = data.rain ? data.rain['1h'] : 0;
        const feelsLike = data.main.feels_like;
        const visibility = (data.visibility / 1000).toFixed(1);

        weatherBox.innerHTML = `
            <div style="display: flex; align-items: center;  list-style: none; gap: 0.8rem;">
                <ul>
                    <li><img src="assets/images/weather/${icon}@2x.png" alt="${description}" /></li>
                </ul>
                <ul>
                    <li style="font-size: 2.3rem; font-weight: bold;">${temp}°C</li>
                    <li style="font-size: .6rem; font-weight: bold;">Feels Like: ${feelsLike} °C</li>
                </ul>
                <ul>
                    <li style="font-size: 0.7rem;">Humidity: ${humidity}%</li>
                    <li style="font-size: 0.7rem;">Wind: ${windSpeed} km/h</li>
                    <li style="font-size: 0.7rem;">Visibility: ${visibility} km</li>
                    <li style="font-size: 0.7rem;">Precipitation: ${precipitation}%</li>
                </ul>
                </div>
        `;
    }

    // Fetch weather data on page load
    fetchWeather();
});