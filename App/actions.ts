'use server'
const API_KEY = process.env.OPENWEATHER_API_KEY
interface WeatherData {
  location: string
  currentTemp: number
  condition: string
  highTemp: number
  lowTemp: number
  hourlyForecast: Array<{
    time: string
    temp: number
    icon: string
  }>
  dailyForecast: Array<{
    day: string
    highTemp: number
    lowTemp: number
    icon: string
  }>
  precipitation: string
  humidity: string
  wind: string
}
export async function getWeatherData(city: string): Promise<WeatherData | null> {
  try {
    // Get coordinates for the city
    const geoResponse = await fetch( `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
    )
    
    if (!geoResponse.ok) {
      console.error('Geo API Error:', await geoResponse.text())
      return null
    }  
    const geoData = await geoResponse.json()
    if (!geoData.length) {
      console.error('No location found for city:', city)
      return null
    }
    const { lat, lon } = geoData[0]
    // Get current weather
    const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}` // Updated to metric units
    )  
    if (!currentWeatherResponse.ok) {
      console.error('Current Weather API Error:', await currentWeatherResponse.text())
      return null
    }  
    const currentWeather = await currentWeatherResponse.json()
    // Get forecast data
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}` // Updated to metric units
    )   
    if (!forecastResponse.ok) {
      console.error('Forecast API Error:', await forecastResponse.text())
      return null
    }
const forecastData = await forecastResponse.json()
    // Format hourly forecast (next 6 3-hour intervals)
    const hourlyForecast = forecastData.list.slice(0, 6).map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { 
        hour: 'numeric',
        hour12: true 
      }),
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon
    }))
    // Format daily forecast (group by day and get min/max)
    const dailyForecast = forecastData.list.reduce((acc: any[], item: any) => {
      const date = new Date(item.dt * 1000)
      const dateStr = date.toLocaleDateString('en-US')   
      if (!acc.find(d => d.dateStr === dateStr)) {
        acc.push({
          dateStr,
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          highTemp: item.main.temp_max,
          lowTemp: item.main.temp_min,
          icon: item.weather[0].icon
        })
      }
      return acc
    }, []).slice(0, 5)
    // Format the data
    const formattedData: WeatherData = {
      location: `${geoData[0].name}, ${geoData[0].country}`,
      currentTemp: Math.round(currentWeather.main.temp),
      condition: currentWeather.weather[0].main,
      highTemp: Math.round(currentWeather.main.temp_max),
      lowTemp: Math.round(currentWeather.main.temp_min),
      hourlyForecast,
      dailyForecast,
      precipitation: `${currentWeather.clouds?.all || 0}%`,
      humidity: `${currentWeather.main.humidity}%`,
      wind: `${(currentWeather.wind.speed * 3.6).toFixed(1)} mph` // Updated wind speed calculation
    }
    return formattedData
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return null
  }
}
