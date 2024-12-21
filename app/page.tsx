'use client'
import { useState } from 'react'
import { Search } from './components/search'
import { WeatherDisplay } from './components/weather-display'
import { getWeatherData } from './actions'
import { motion } from 'framer-motion'
export default function Home() {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const handleSearch = async (city: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getWeatherData(city)
      if (data) {
        setWeatherData(data)
      } else {
        setError('Unable to find weather data for this location. Please check the city name and try again.')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('An error occurred while fetching weather data. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }
return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-lg">Weather Now</h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Search onSearch={handleSearch} isLoading={isLoading} />
      </motion.div>   
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md mx-auto mb-8 p-4 bg-red-100 text-red-700 rounded-md text-center"
        >
          {error}
        </motion.div>
      )}    
      {weatherData && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WeatherDisplay weatherData={weatherData} />
        </motion.div>
      )}    
      {!weatherData && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-white text-xl mt-12"
        >
          Enter a city name to see the weather forecast in Celsius
        </motion.div>
      )}
    </main>
  )
}
