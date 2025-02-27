"use client"

import { useCallback, useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Progress } from '@/components/ui/progress'
import { useTheme } from 'next-themes'

export function FileUpload({ onFileUpload }: { onFileUpload: (file: File | null) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0])
      onFileUpload(acceptedFiles[0])
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  useEffect(() => {
    if (file) {
      const timer = setInterval(() => {
        setUploadProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer)
            return 100
          }
          return Math.min(oldProgress + 10, 100)
        })
      }, 500)
      return () => clearInterval(timer)
    }
  }, [file])

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDarkMode
          ? 'bg-[#2C2C3D] border-[#3A3A4B] text-[#A6A6A6] hover:bg-[#3A3A4B]'
          : 'bg-white border-[#E0E0E0] text-[#6F6F6F] hover:bg-gray-50'
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-base">Drop the files here ...</p>
      ) : (
        <p className="text-base">Drag 'n' drop some files here, or click to select files</p>
      )}
      {file && (
        <div className="mt-4">
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}
    </div>
  )
}

