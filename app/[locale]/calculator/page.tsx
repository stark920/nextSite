'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useDebounce } from 'react-use'

export default function Ffmi() {
  const [bodyWeight, setBodyWeight] = useState<number>(70)
  const [bodyFat, setBodyFat] = useState<number>(15)
  const [bodyHeight, setBodyHeight] = useState<number>(180)
  const [ffmi, setFfmi] = useState<string>('-')

  const calculateMetrics = () => {
    const heightInMeters = bodyHeight / 100;

    // Lean = Weight in kg x (1.0 - (Body fat % / 100.0))
    const lean = bodyWeight * (1.0 - bodyFat / 100.0);

    // FFMI = (Lean / 2.2) / (Height in meters^2) x 2.20462
    const ffmi = (lean / 2.2) / (heightInMeters ** 2) * 2.20462;

    // Adjusted FFMI = FFMI + (6.1 x (1.8 - Height in meters))
    const adjustedFfmi = ffmi + (6.1 * (1.8 - heightInMeters));

    return { lean, ffmi, adjustedFfmi };
  };

  useDebounce(
    () => {
      const { adjustedFfmi } = calculateMetrics()
      setFfmi(Number.isNaN(adjustedFfmi) ? '-' : adjustedFfmi.toFixed(2))
    },
    500,
    [bodyWeight, bodyHeight, bodyFat],
  )

  return (
    <div className='container'>
      <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
        <h2 className='text-xl font-semibold'>FFMI (Fat Free Mass Index) 無脂肪質量指數</h2>
        <div className='mb-4 rounded-md bg-accent px-4 py-2 leading-8'>
          FFMI = (體重 x (100% - 體脂率)) / 身高<sup>2</sup>(m)
        </div>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label htmlFor='bodyHeight'>身高（cm）</Label>
          <Input
            type='number'
            id='bodyHeight'
            placeholder='身高（cm）'
            value={bodyHeight}
            onChange={e => setBodyHeight(+e.target.value)}
          />
        </div>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label htmlFor='bodyWeight'>體重（kg）</Label>
          <Input
            type='number'
            id='bodyWeight'
            placeholder='體重（kg）'
            value={bodyWeight}
            onChange={e => setBodyWeight(+e.target.value)}
          />
        </div>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label htmlFor='bodyFat'>體脂率（%）</Label>
          <Input
            type='number'
            id='bodyFat'
            max={100}
            placeholder='體脂率（%）'
            value={bodyFat}
            onChange={e => setBodyFat(+e.target.value)}
          />
        </div>
        FFMI: {ffmi}

        <div>

        https://www.thecalculator.co/health/Fat-Free-Mass-Index-(FFMI)-Calculator-794.html
        </div>
      </div>
    </div>
  )
}
