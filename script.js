document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const form = document.getElementById('weather-form');
    const cityInput = document.getElementById('city-input');
    const searchBtn = document.getElementById('search-btn');
    const errorMessage = document.getElementById('error-message');
    const weatherInfo = document.getElementById('weather-info');
    const temperatureEl = document.getElementById('temperature');
    const conditionEl = document.getElementById('condition');
    const humidityEl = document.getElementById('humidity');
    const windSpeedEl = document.getElementById('wind-speed');

    // OpenWeatherMap API Key
    const API_KEY = '689eb33c48d88f1fb4acbc7ea86949b1'; // Your API key
    const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (!city) return;

        setLoading(true);
        errorMessage.textContent = '';
        weatherInfo.classList.add('hidden');

        try {
            // Fetch weather data from the OpenWeatherMap API
            const response = await fetch(`${API_URL}?q=${city}&units=metric&appid=${API_KEY}`);
            const data = await response.json();

            if (data.cod === '404') {
                throw new Error('City not found');
            }

            // Extract weather data
            const weatherData = {
                temp: data.main.temp,
                condition: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
            };

            displayWeather(weatherData);
        } catch (error) {
            errorMessage.textContent = 'Failed to fetch weather data. Please try again.';
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        searchBtn.disabled = isLoading;
        if (isLoading) {
            searchBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i><span class="ml-2 hidden-mobile">Searching...</span>';
        } else {
            searchBtn.innerHTML = '<i data-lucide="search"></i><span class="ml-2 hidden-mobile">Search</span>';
        }
        lucide.createIcons();
    }

    function displayWeather(data) {
        temperatureEl.textContent = `${data.temp}°C`;
        conditionEl.textContent = data.condition;
        humidityEl.textContent = `${data.humidity}%`;
        windSpeedEl.textContent = `${data.windSpeed} m/s`;
        weatherInfo.classList.remove('hidden');
    }
});
