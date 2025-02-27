"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'

interface ExpressionEditorProps {
  selectedApis: string[]
  selectedFields: Record<string, string[]>
  onAddDerivedColumn: (api: string, name: string, expression: string) => void
  onDeleteDerivedColumn: (api: string, name: string) => void
  derivedColumns: Record<string, { name: string; expression: string }[]>
  isDarkMode: boolean
  onSkip: () => void
}

const functions = {
  Arithmetic: [
    { name: 'SUM', description: 'Adds up the values', syntax: 'SUM(field1, field2, ...)' },
    { name: 'AVG', description: 'Calculates the average of the values', syntax: 'AVG(field1, field2, ...)' },
  ],
  Logical: [
    { name: 'IF', description: 'Conditional statement', syntax: 'IF(condition, value_if_true, value_if_false)' },
    { name: 'AND', description: 'Logical AND', syntax: 'AND(condition1, condition2, ...)' },
    { name: 'OR', description: 'Logical OR', syntax: 'OR(condition1, condition2, ...)' },
  ],
  Text: [
    { name: 'CONCAT', description: 'Concatenates two or more strings', syntax: 'CONCAT(text1, text2, ...)' },
    { name: 'REGEXP_EXTRACT', description: 'Extracts a pattern from a string', syntax: "REGEXP_EXTRACT(field, 'pattern')" },
    { name: 'REGEXP_REPLACE', description: 'Replaces a pattern in a string', syntax: "REGEXP_REPLACE(field, 'pattern', 'replacement')" },
  ],
  Date: [
    { name: 'DATE_DIFF', description: 'Calculates the difference between two dates', syntax: "DATE_DIFF(date1, date2, 'unit')" },
    { name: 'DATE_ADD', description: 'Adds a specified time interval to a date', syntax: "DATE_ADD(date, interval, 'unit')" },
  ],
}

export function ExpressionEditor({ selectedApis, selectedFields, onAddDerivedColumn, onDeleteDerivedColumn, derivedColumns, isDarkMode, onSkip }: ExpressionEditorProps) {
  const [currentApi, setCurrentApi] = useState(selectedApis[0])
  const [newColumnName, setNewColumnName] = useState('')
  const [expression, setExpression] = useState('')
  const [error, setError] = useState('')
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [pendingApiChange, setPendingApiChange] = useState<string | null>(null)

  const validateExpression = useCallback((expr: string): boolean => {
    try {
      // Check for balanced parentheses
      let parenthesesCount = 0
      for (const char of expr) {
        if (char === '(') parenthesesCount++
        if (char === ')') parenthesesCount--
        if (parenthesesCount < 0) throw new Error('Unbalanced parentheses')
      }
      if (parenthesesCount !== 0) throw new Error('Unbalanced parentheses')

      // Check if all used fields are in the selectedFields array
      const usedFields = expr.match(/[a-zA-Z_]\w*/g) || []
      const invalidFields = usedFields.filter(field =>
        !selectedFields[currentApi].includes(field) &&
        !Object.values(functions).flat().some(func => func.name === field)
      )
      if (invalidFields.length > 0) {
        throw new Error(`Invalid fields or functions: ${invalidFields.join(', ')}`)
      }

      setError('')
      return true
    } catch (err) {
      if (expr.trim() === '') {
        setError('')
      } else {
        setError((err as Error).message)
      }
      return false
    }
  }, [setError, currentApi, selectedFields])

  useEffect(() => {
    validateExpression(expression)
  }, [expression, validateExpression])

  const handleAddColumn = () => {
    if (validateExpression(expression)) {
      onAddDerivedColumn(currentApi, newColumnName, expression)
      setNewColumnName('')
      setExpression('')
    }
  }

  const handleApiChange = (api: string) => {
    if (newColumnName || expression) {
      setPendingApiChange(api)
      setIsAlertOpen(true)
    } else {
      setCurrentApi(api)
    }
  }

  const confirmApiChange = () => {
    if (pendingApiChange) {
      setCurrentApi(pendingApiChange)
      setNewColumnName('')
      setExpression('')
      setError('')
      setIsAlertOpen(false)
      setPendingApiChange(null)
    }
  }

  const cancelApiChange = () => {
    setIsAlertOpen(false)
    setPendingApiChange(null)
  }

  const insertFunction = (funcSyntax: string) => {
    setExpression(prev => prev + funcSyntax)
  }

  return (
    <div className="space-y-4">
      <Tabs value={currentApi} onValueChange={handleApiChange}>
        <TabsList>
          {selectedApis.map(api => (
            <TabsTrigger key={api} value={api}>{api}</TabsTrigger>
          ))}
        </TabsList>
        {selectedApis.map(api => (
          <TabsContent key={api} value={api}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newColumnName" className={isDarkMode ? 'text-[#AAB2BF]' : 'text-gray-700'}>New Column Name</Label>
                <Input
                  id="newColumnName"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  className={isDarkMode
                    ? 'bg-[#2C2C3B] text-[#E4E7EB] border-[#3A3F4B] focus:border-[#6366F1] placeholder-[#6C727C]'
                    : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 placeholder-gray-400'
                  }
                />
              </div>
              <div>
                <Label htmlFor="expression" className={isDarkMode ? 'text-[#AAB2BF]' : 'text-gray-700'}>Expression</Label>
                <Textarea
                  id="expression"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  className={isDarkMode
                    ? 'bg-[#2C2C3B] text-[#E4E7EB] border-[#3A3F4B] focus:border-[#6366F1] placeholder-[#6C727C]'
                    : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 placeholder-gray-400'
                  }
                  rows={4}
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button
                onClick={handleAddColumn}
                disabled={!expression || !newColumnName || !!error}
                className={isDarkMode
                  ? 'bg-[#6366F1] text-white hover:bg-[#818CF8] active:bg-[#4F46E5]'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                }
              >
                Add Derived Column
              </Button>
              <div>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-[#AAB2BF]' : 'text-gray-700'}`}>Available Fields:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedFields[api].map((field) => (
                    <span key={field} className={`px-2 py-1 rounded ${isDarkMode ? 'bg-[#2C2C3B] text-[#E4E7EB]' : 'bg-gray-200 text-gray-700'}`}>
                      {field}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-[#AAB2BF]' : 'text-gray-700'}`}>Available Functions:</h3>
                <Accordion type="single" collapsible className="w-full">
                  {Object.entries(functions).map(([category, funcs]) => (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger>{category}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 gap-2">
                          {funcs.map((func) => (
                            <div key={func.name} className={`p-2 rounded ${isDarkMode ? 'bg-[#2C2C3B] text-[#E4E7EB]' : 'bg-gray-200 text-gray-700'}`}>
                              <span className="font-semibold cursor-pointer" onClick={() => insertFunction(func.syntax)}>{func.name}</span>: {func.description}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              <div>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-[#AAB2BF]' : 'text-gray-700'}`}>Derived Columns:</h3>
                {derivedColumns[api]?.map((column, index) => (
                  <div key={index} className={`p-2 rounded mb-2 flex justify-between items-center ${isDarkMode ? 'bg-[#2C2C3B] text-[#E4E7EB]' : 'bg-gray-200 text-gray-700'}`}>
                    <div>
                      <span className="font-semibold">{column.name}</span>: {column.expression}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteDerivedColumn(api, column.name)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <Button onClick={onSkip} variant="outline" className={isDarkMode
        ? 'bg-[#374151] text-[#D1D5DB] hover:bg-[#4B5563] active:bg-[#1F2937]'
        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300'
      }>
        Skip This Step
      </Button>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Warning</AlertDialogTitle>
            <AlertDialogDescription>
              Switching APIs will reset your current derived column. Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelApiChange}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApiChange}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

