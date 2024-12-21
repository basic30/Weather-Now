'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface SearchProps {
  onSearch: (city: string) => void
  isLoading: boolean
}

export function Search({ onSearch, isLoading }: SearchProps) {
  const [city, setCity] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      onSearch(city.trim())
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex gap-2 max-w-md mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1 bg-white/20 text-white placeholder-white/70 border-white/30 focus:border-white"
      />
      <Button
        type="submit"
        disabled={isLoading}
        className="bg-yellow-400 hover:bg-yellow-500 text-gray-800"
      >
        {isLoading ? (
          <div className="animate-spin">⌛</div>
        ) : (
          <SearchIcon className="w-4 h-4" />
        )}
      </Button>
    </motion.form>
  )
}
