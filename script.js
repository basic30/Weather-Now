const API_KEY = '689eb33c48d88f1fb4acbc7ea86949b1'; // Replace with your actual API key

const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const errorMessage = document.getElementById('errorMessage');
const weatherDisplay = document.getElementById('weatherDisplay');
const initialMessage = document.getElementById('initialMessage');

searchForm.addEventListener('submit', handleSearch);

const searchIcon = document.getElementById('searchIcon');
const spinner = document.getElementById('spinner');

async function handleSearch(e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        // Show the spinner and hide the search icon
        searchIcon.style.display = 'none';
        spinner.style.display = 'inline-block';
        
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherData(weatherData);
            errorMessage.style.display = 'none';
            initialMessage.style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
            showError('An error occurred while fetching weather data. Please try again later.');
        } finally {
            // Hide the spinner and show the search icon
            searchIcon.style.display = 'inline-block';
            spinner.style.display = 'none';
        }
    }
}

async function getWeatherData(city) {
    const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
    );
    if (!geoResponse.ok) throw new Error('Unable to find location');
    const geoData = await geoResponse.json();
    if (!geoData.length) throw new Error('City not found');

    const { lat, lon } = geoData[0];
    const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    if (!currentWeatherResponse.ok) throw new Error('Unable to fetch current weather');
    const currentWeather = await currentWeatherResponse.json();

    const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    if (!forecastResponse.ok) throw new Error('Unable to fetch forecast');
    const forecastData = await forecastResponse.json();

    const hourlyForecast = forecastData.list.slice(0, 6).map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon
    }));

    const dailyForecast = forecastData.list.reduce((acc, item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US');
        if (!acc.find(d => d.date === date)) {
            acc.push({
                date,
                day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                highTemp: item.main.temp_max,
                lowTemp: item.main.temp_min,
                icon: item.weather[0].icon
            });
        }
        return acc;
    }, []).slice(0, 5);

    return {
        location: `${geoData[0].name}, ${geoData[0].country}`,
        currentTemp: Math.round(currentWeather.main.temp),
        condition: currentWeather.weather[0].main,
        highTemp: Math.round(currentWeather.main.temp_max),
        lowTemp: Math.round(currentWeather.main.temp_min),
        hourlyForecast,
        dailyForecast,
        precipitation: `${currentWeather.clouds?.all || 0}%`,
        humidity: `${currentWeather.main.humidity}%`,
        wind: `${(currentWeather.wind.speed * 3.6).toFixed(1)} km/h`
    };
}

function displayWeatherData(weatherData) {
    const firstHourlyIcon = weatherData.hourlyForecast?.[0]?.icon || '01d';
    const weatherHTML = `
        <div class="weather-header">
            <div class="weather-location">${weatherData.location}</div>
            <div class="weather-description">Current Weather</div>
        </div>
        <div class="weather-current">
            <div class="weather-main">
                ${getWeatherIcon(firstHourlyIcon)}
                <div class="weather-temp">${weatherData.currentTemp}°C</div>
                <div class="weather-condition">${weatherData.condition}</div>
            </div>
            <div class="weather-high-low">
                <div>H: ${weatherData.highTemp}°C</div>
                <div>L: ${weatherData.lowTemp}°C</div>
            </div>
        </div>
        <div class="weather-section">
            <h3 class="weather-section-title">Hourly Forecast</h3>
            <div class="hourly-forecast">
                ${weatherData.hourlyForecast.map(hour => `
                    <div class="hourly-item">
                        <div>${hour.time}</div>
                        ${getWeatherIcon(hour.icon)}
                        <div>${hour.temp}°C</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    weatherDisplay.innerHTML = weatherHTML;
}

function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': '☀',
        '01n': '🌙',
        '02d': '⛅',
        '02n': '☁',
        '03d': '☁',
        '03n': '☁',
        '04d': '☁',
        '04n': '☁',
        '09d': '🌧',
        '09n': '🌧',
        '10d': '🌦',
        '10n': '🌧',
        '11d': '⛈' // Fixed value for '11d'
    };
    return iconMap[iconCode] || '❓';
}
