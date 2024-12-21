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
