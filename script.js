const API_KEY = 'de1df44f985e079c75c6d46b0b35488e'; // Replace with your Weatherstack API key

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
    // Weatherstack geocode endpoint to get latitude and longitude
    const geoResponse = await fetch(
        `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${encodeURIComponent(city)}`
    );
    if (!geoResponse.ok) throw new Error('Unable to find location');
    const geoData = await geoResponse.json();
    if (!geoData.current) throw new Error('City not found');

    // Extracting weather data
    const { location, current, forecast } = geoData;
    
    const hourlyForecast = forecast ? forecast.map(item => ({
        time: item.time, // Time (based on forecast API response)
        temp: Math.round(item.temperature),
        icon: item.weather_icons[0] // Weatherstack icon URL
    })) : [];

    const dailyForecast = forecast ? forecast.slice(0, 5).map(item => ({
        date: item.date,
        day: item.day, // Assuming this is in the forecast data
        highTemp: Math.round(item.temperature_2m_max),
        lowTemp: Math.round(item.temperature_2m_min),
        icon: item.weather_icons[0] // Weatherstack icon URL
    })) : [];

    return {
        location: `${location.name}, ${location.country}`,
        currentTemp: Math.round(current.temperature),
        condition: current.weather_descriptions[0],
        conditionIcon: current.weather_icons[0], // Weatherstack icon URL
        highTemp: Math.round(current.temperature_2m_max),
        lowTemp: Math.round(current.temperature_2m_min),
        hourlyForecast,
        dailyForecast,
        precipitation: `${current.precipitation}mm`,
        humidity: `${current.humidity}%`,
        wind: `${(current.wind_speed * 3.6).toFixed(1)} km/h`
    };
}

function displayWeatherData(weatherData) {
    const weatherHTML = `
    <div class="weather-header">
        <div>${weatherData.location}</div>
        <div class="current-weather">Current Weather</div>
    </div>
    <div class="weather-display">
        <div class="weather-condition">
            <img src="${weatherData.conditionIcon}" alt="${weatherData.condition}">
            <div class="weather-temp">${weatherData.currentTemp}°C</div>
            <div class="weather-condition-text">${weatherData.condition}</div>
        </div>
        <div class="weather-high-low">
            <div>H: ${weatherData.highTemp}°C</div>
            <div>L: ${weatherData.lowTemp}°C</div>
        </div>
    </div>
<div class="section-separator"></div>    
    <div class="weather-section">
        <h3>Hourly Forecast</h3>
        <div class="hourly-forecast">
            ${weatherData.hourlyForecast.map(hour => `
                <div class="hourly-item">
                    <img src="${hour.icon}" alt="${hour.temp}°C"> <!-- Weatherstack icon -->
                    <div>${hour.time}</div>
                    <div>${hour.temp}°C</div>
                </div>
            `).join('')}
        </div>
    </div>
    <div class="section-separator"></div> 
    <div class="weather-section">
        <h3>5-Day Forecast</h3>
        <div class="daily-forecast">
            ${weatherData.dailyForecast.map(day => `
                <div class="daily-item">
                    <img src="${day.icon}" alt="icon"> <!-- Weatherstack icon -->
                    <div>${day.day}</div>
                    <div>${day.highTemp}°C / ${day.lowTemp}°C</div>
                </div>
            `).join('')}
        </div>
    </div>
   <div class="section-separator"></div> 
    <div class="weather-details">
    <div class="detail-box">
        <h4>Precipitation</h4>
        <img src="${weatherData.conditionIcon}" alt="precipitation-icon" style="width: 30px;"> <!-- Weatherstack icon -->
        <p>${weatherData.precipitation}</p>
    </div>
    <div class="detail-box">
        <h4>Humidity</h4>
        <img src="${weatherData.conditionIcon}" alt="humidity-icon" style="width: 30px;"> <!-- Weatherstack icon -->
        <p>${weatherData.humidity}</p>
    </div>
    <div class="detail-box">
        <h4>Wind</h4>
        <img src="${weatherData.conditionIcon}" alt="wind-icon" style="width: 30px;"> <!-- Weatherstack icon -->
        <p>${weatherData.wind}</p>
    </div>
</div>
`;

    // Insert the generated HTML into the weather display container
    weatherDisplay.innerHTML = weatherHTML;

    // Add animation
    const weatherContainer = document.querySelector('.weather-container');
    weatherContainer.classList.remove('hidden');
    setTimeout(() => weatherContainer.classList.add('visible'), 100);
}
