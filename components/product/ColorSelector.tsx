'use client'

import { Check } from 'lucide-react'

const COLOR_MAP: Record<string, string> = {
  Red: '#ef4444',
  Pink: '#ec4899',
  Blue: '#3b82f6',
  Green: '#22c55e',
  Yellow: '#eab308',
  Purple: '#a855f7',
  Orange: '#f97316',
  White: '#f9fafb',
  Black: '#111827',
  Navy: '#1e3a5f',
  Beige: '#d4b896',
  Mint: '#4ECDC4',
  Lavender: '#C3B1E1',
  Teal: '#14b8a6',
  Coral: '#f87171',
  Grey: '#9ca3af',
  Gray: '#9ca3af',
  Brown: '#92400e',
  Maroon: '#7f1d1d',
}

interface ColorSelectorProps {
  colors: string[]
  selectedColor: string
  onColorChange: (color: string) => void
}

export function ColorSelector({ colors, selectedColor, onColorChange }: ColorSelectorProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="font-semibold text-sm text-[#2D3748]">Color:</span>
        {selectedColor && (
          <span className="text-sm text-[#FF6B9D] font-medium">{selectedColor}</span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const hex = COLOR_MAP[color] || '#ccc'
          const isSelected = selectedColor === color
          const isLight = ['White', 'Yellow', 'Beige'].includes(color)

          return (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              title={color}
              className={`relative w-9 h-9 rounded-full transition-all hover:scale-110 ${
                isSelected ? 'ring-2 ring-[#FF6B9D] ring-offset-2 scale-110' : ''
              }`}
              style={{
                backgroundColor: hex,
                boxShadow: isLight ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' : undefined,
              }}
            >
              {isSelected && (
                <Check
                  size={16}
                  className={isLight ? 'text-[#2D3748]' : 'text-white'}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
      {!selectedColor && (
        <p className="text-xs text-red-400 mt-2">Please select a color</p>
      )}
    </div>
  )
}
