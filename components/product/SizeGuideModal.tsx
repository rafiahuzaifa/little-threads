'use client'

import { useState } from 'react'
import { X, Ruler } from 'lucide-react'

const SIZE_CHART = [
  { size: 'NB', age: 'Newborn', weight: '2.5-4.5 kg', height: 'Up to 56 cm', chest: '33 cm', waist: '33 cm' },
  { size: '0-3M', age: '0-3 Months', weight: '4-6 kg', height: '56-62 cm', chest: '40 cm', waist: '40 cm' },
  { size: '3-6M', age: '3-6 Months', weight: '6-8 kg', height: '62-68 cm', chest: '42 cm', waist: '42 cm' },
  { size: '6-12M', age: '6-12 Months', weight: '8-10 kg', height: '68-80 cm', chest: '45 cm', waist: '45 cm' },
  { size: '1Y', age: '12-18 Months', weight: '10-12 kg', height: '80-86 cm', chest: '48 cm', waist: '47 cm' },
  { size: '2Y', age: '2 Years', weight: '12-14 kg', height: '86-92 cm', chest: '51 cm', waist: '50 cm' },
  { size: '3Y', age: '3 Years', weight: '14-16 kg', height: '92-98 cm', chest: '54 cm', waist: '52 cm' },
  { size: '4Y', age: '4 Years', weight: '16-18 kg', height: '98-104 cm', chest: '57 cm', waist: '54 cm' },
  { size: '5Y', age: '5 Years', weight: '18-20 kg', height: '104-110 cm', chest: '59 cm', waist: '56 cm' },
  { size: '6Y', age: '6 Years', weight: '20-22 kg', height: '110-116 cm', chest: '62 cm', waist: '58 cm' },
  { size: '8Y', age: '7-8 Years', weight: '22-27 kg', height: '116-128 cm', chest: '66 cm', waist: '61 cm' },
  { size: '10Y', age: '9-10 Years', weight: '27-32 kg', height: '128-138 cm', chest: '72 cm', waist: '64 cm' },
  { size: '12Y', age: '11-12 Years', weight: '32-40 kg', height: '138-152 cm', chest: '78 cm', waist: '67 cm' },
]

export function SizeGuideModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-sm text-[#4ECDC4] hover:underline"
      >
        <Ruler size={14} />
        Size Guide
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-nunito font-bold text-xl text-[#2D3748]">
                Children's Size Guide (Pakistan)
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm text-gray-500 mb-4">
                All measurements are in centimeters. For best fit, measure your child and compare with the chart below.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-pink-50">
                      <th className="text-left p-3 font-semibold text-[#FF6B9D] rounded-tl-xl">Size</th>
                      <th className="text-left p-3 font-semibold text-[#2D3748]">Age</th>
                      <th className="text-left p-3 font-semibold text-[#2D3748]">Weight</th>
                      <th className="text-left p-3 font-semibold text-[#2D3748]">Height</th>
                      <th className="text-left p-3 font-semibold text-[#2D3748]">Chest</th>
                      <th className="text-left p-3 font-semibold text-[#2D3748] rounded-tr-xl">Waist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_CHART.map((row, i) => (
                      <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-3 font-bold text-[#FF6B9D]">{row.size}</td>
                        <td className="p-3 text-[#2D3748]">{row.age}</td>
                        <td className="p-3 text-gray-600">{row.weight}</td>
                        <td className="p-3 text-gray-600">{row.height}</td>
                        <td className="p-3 text-gray-600">{row.chest}</td>
                        <td className="p-3 text-gray-600">{row.waist}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-sm text-[#2D3748] mb-2">How to Measure</h3>
                <ul className="text-xs text-gray-600 space-y-1.5">
                  <li>• <strong>Height:</strong> Stand straight, measure from top of head to heel</li>
                  <li>• <strong>Chest:</strong> Measure around the fullest part of the chest</li>
                  <li>• <strong>Waist:</strong> Measure around the natural waistline</li>
                  <li>• <strong>Tip:</strong> If between sizes, choose the larger size for room to grow</li>
                </ul>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-[#FF6B9D] text-white py-3 rounded-xl font-bold hover:bg-[#e6527f] transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
