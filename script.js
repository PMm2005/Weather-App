const apiKey = '57fec178d2534eeb860222314251202 '; // Replace with your WeatherAPI key
const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const forecastResult = document.getElementById('forecastResult');
const loadingSpinner = document.getElementById('loading');

weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value;

    if (city) {
        loadingSpinner.style.display = 'block';
        weatherResult.innerHTML = '';
        forecastResult.innerHTML = '';

        try {
            const weatherData = await getWeatherData(city);
            const forecastData = await getForecastData(city);
            displayWeather(weatherData);
            displayForecast(forecastData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            weatherResult.innerHTML = '<p>Failed to fetch weather data. Please try again.</p>';
        } finally {
            loadingSpinner.style.display = 'none';
        }
    } else {
        weatherResult.innerHTML = '<p>Please enter a city name.</p>';
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error('Weather data not found');
    }

    return await response.json();
}

async function getForecastData(city) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error('Forecast data not found');
    }

    return await response.json();
}

function displayWeather(data) {
    const { location, current } = data;
    const cityName = location.name;
    const temperature = current.temp_c;
    const condition = current.condition.text;
    const icon = current.condition.icon;
    const humidity = current.humidity;
    const windSpeed = current.wind_kph;
    const feelsLike = current.feelslike_c;

    weatherResult.innerHTML = `
        <h2>${cityName}</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Condition: ${condition}</p>
        <img src="${icon}" alt="${condition}">
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} km/h</p>
        <p>Feels Like: ${feelsLike}°C</p>
    `;
}

function displayForecast(data) {
    const forecastDays = data.forecast.forecastday;

    forecastResult.innerHTML = forecastDays.map(day => `
        <div class="forecast-day">
            <h3>${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</h3>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p>Max: ${day.day.maxtemp_c}°C</p>
            <p>Min: ${day.day.mintemp_c}°C</p>
        </div>
    `).join('');
}