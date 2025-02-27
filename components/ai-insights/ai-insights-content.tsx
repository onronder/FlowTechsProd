"use client"

import { useState } from 'react';
import { useTheme } from 'next-themes'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Paperclip, Image, Send } from 'lucide-react'
import { FileUpload } from '@/components/ai-insights/file-upload'
import { PresetSuggestions } from '@/components/ai-insights/preset-suggestions'

export function AIInsightsContent() {
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'
  const [input, setInput] = useState('')
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted:', input)
    setInput('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold text-32 ${
          isDarkMode
            ? 'bg-gradient-to-r from-[#BB86FC] to-[#6200EE] bg-clip-text text-transparent'
            : 'bg-gradient-to-r from-[#6C63FF] to-[#9D50BB] bg-clip-text text-transparent'
        }`}>
          Hi there, [User Name]
        </h1>
        <p className={`text-xl mt-2 font-medium text-20 ${
          isDarkMode ? 'text-[#D1D1D6]' : 'text-[#4A4A4A]'
        }`}>
          What would you like to explore today?
        </p>
        <p className={`mt-2 text-16 ${
          isDarkMode ? 'text-[#A6A6A6]' : 'text-[#6F6F6F]'
        }`}>
          Upload your Shopify data to explore inferences, correlations, and insights from your data using AI.
        </p>
      </div>

      <FileUpload onFileUpload={setFile} />

      {file && (
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800'}`}>
          File uploaded successfully. Analyzing your data...
        </div>
      )}

      <Card className={`${
        isDarkMode 
          ? 'bg-[#2C2C3D] border-[#3A3A4B] shadow-[0_4px_12px_rgba(0,0,0,0.2)]' 
          : 'bg-white border-[#E0E0E0] shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
      }`}>
        <CardContent className="p-4">
          <PresetSuggestions />
          <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Ask whatever you want..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`flex-grow ${
                isDarkMode
                  ? 'bg-[#3A3A4B] border-[#4C4C5A] text-white placeholder-[#A6A6A6]'
                  : 'bg-[#F5F5F5] border-[#E0E0E0] text-black placeholder-[#6F6F6F]'
              } text-sm`}
            />
            <Button type="button" variant="outline" size="icon" className={
              isDarkMode
                ? 'bg-[#3A3A4B] hover:bg-[#4C4C5A] text-white'
                : 'bg-[#E0E0E0] hover:bg-[#BDBDBD] text-black'
            }>
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" className={
              isDarkMode
                ? 'bg-[#3A3A4B] hover:bg-[#4C4C5A] text-white'
                : 'bg-[#E0E0E0] hover:bg-[#BDBDBD] text-black'
            }>
              <Image className="h-4 w-4" />
            </Button>
            <Button 
              type="submit" 
              className={`text-white ${
                isDarkMode
                  ? 'bg-gradient-to-r from-[#BB86FC] to-[#6200EE] hover:from-[#CC99FF] hover:to-[#7357EE]'
                  : 'bg-gradient-to-r from-[#6C63FF] to-[#9D50BB] hover:from-[#786EFF] hover:to-[#A673CC]'
              }`}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

