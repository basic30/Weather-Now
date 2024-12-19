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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (!city) return;

        setLoading(true);
        errorMessage.textContent = '';
        weatherInfo.classList.add('hidden');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            const weatherData = {
                temp: 22,
                condition: 'Partly Cloudy',
                humidity: 65,
                windSpeed: 12
            };

            displayWeather(weatherData);
        } catch (error) {
            errorMessage.textContent = 'Failed to fetch weather data. Please try again.';
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        searchBtn.disabled = isLoading
