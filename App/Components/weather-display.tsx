'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Cloud, Droplets, Sun, Thermometer, Wind } from 'lucide-react'
import { motion } from 'framer-motion'
interface WeatherDisplayProps {
  weatherData: {
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
}

export function WeatherDisplay({ weatherData }: WeatherDisplayProps) {
  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: any } = {
      '01d': Sun,
      '01n': Sun,
      '02d': Cloud,
      '02n': Cloud,
      '03d': Cloud,
      '03n': Cloud,
      '04d': Cloud,
      '04n': Cloud,
      '09d': Droplets,
      '09n': Droplets,
      '10d': Droplets,
      '10n': Droplets,
    }
    const IconComponent = iconMap[iconCode] || Cloud
    return <IconComponent className="w-8 h-8" />
  }
return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-4xl mx-auto bg-white/10 text-white backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl">{weatherData.location}</CardTitle>
          <CardDescription className="text-white/70">Current Weather</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center">          {getWeatherIcon(weatherData.hourlyForecast[0].icon)}
              <div className="ml-4">
                <div className="text-6xl font-bold">{weatherData.currentTemp}°C</div>
                <div>{weatherData.condition}</div>
              </div>
            </div>
            <div>
              <div>H: {weatherData.highTemp}°C</div>
              <div>L: {weatherData.lowTemp}°C</div>
            </div>
          </motion.div>
          <Separator className="my-4 bg-white/30" />
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-2">Hourly Forecast</h3>
            <div className="flex justify-between">
{weatherData.hourlyForecast.map((hour, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <div>{hour.time}</div>
                  {getWeatherIcon(hour.icon)}
                  <div>{hour.temp}°C</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
<motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-2">5-Day Forecast</h3>
            {weatherData.dailyForecast.map((day, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between py-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <div className="w-20">{day.day}</div>
                {getWeatherIcon(day.icon)}
                <div className="w-20 text-right">{day.lowTemp}°C / {day.highTemp}°C</div>
              </motion.div>
            ))}
          </motion.div>

          <Separator className="my-4 bg-white/30" />
<motion.div
            className="grid grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Card className="bg-blue-500/50 flex flex-col items-center justify-center p-4">
              <CardContent className="text-center p-0">
                <Droplets className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm">Precipitation</div>
                <div className="text-lg font-semibold">{weatherData.precipitation}</div>
              </CardContent>
            </Card>
            <Card className="bg-green-500/50 flex flex-col items-center justify-center p-4">
              <CardContent className="text-center p-0">
                <Thermometer className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm">Humidity</div>
                <div className="text-lg font-semibold">{weatherData.humidity}</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-500/50 flex flex-col items-center justify-center p-4">
              <CardContent className="text-center p-0">
                <Wind className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm">Wind</div>
                <div className="text-lg font-semibold">{weatherData.wind}</div>
              </CardContent>
            </Card>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
