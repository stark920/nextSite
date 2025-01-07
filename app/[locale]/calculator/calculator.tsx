'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/app/i18n/client'

export default function Calculator({ locale }: { locale: string }) {
  const { t } = useTranslation(locale)

  // Body Info
  const [age, setAge] = useState<number>(18)
  const [sex, setSex] = useState<string>('male')
  const [bodyWeight, setBodyWeight] = useState<number>(75)
  const [bodyFat, setBodyFat] = useState<number>(15)
  const [bodyHeight, setBodyHeight] = useState<number>(180)

  // FFMI
  const [ffmi, setFfmi] = useState<number>(0)
  const [affmi, setAffmi] = useState<number>(0)
  const ffmiRanges = [
    { label: t('ffmi.level0'), condition: ffmi < 18 },
    { label: t('ffmi.level1'), condition: ffmi >= 18 && ffmi < 20 },
    { label: t('ffmi.level2'), condition: ffmi >= 20 && ffmi < 21 },
    { label: t('ffmi.level3'), condition: ffmi >= 21 && ffmi < 23 },
    { label: t('ffmi.level4'), condition: ffmi >= 23 && ffmi < 25 },
    { label: t('ffmi.level5'), condition: ffmi >= 25 && ffmi < 28 },
    { label: t('ffmi.level6'), condition: ffmi >= 28 },
  ]
  const calculateFfmi = () => {
    const heightInMeters = bodyHeight / 100
    const lean = bodyWeight * (1.0 - bodyFat / 100.0)
    const ffmi = (lean / 2.2 / heightInMeters ** 2) * 2.20462
    const adjustedFfmi = ffmi + 6.1 * (1.8 - heightInMeters)

    return { lean, ffmi, adjustedFfmi }
  }

  // BMI
  const [bmi, setBmi] = useState<number>(0)
  const bmiRanges = [
    { label: t('bmi.level0'), condition: bmi < 18.5 },
    { label: t('bmi.level1'), condition: bmi >= 18.5 && bmi < 24 },
    { label: t('bmi.level2'), condition: bmi >= 24 && bmi < 27 },
    { label: t('bmi.level3'), condition: bmi >= 27 && bmi < 30 },
    { label: t('bmi.level4'), condition: bmi >= 30 && bmi < 35 },
    { label: t('bmi.level5'), condition: bmi >= 35 },
  ]
  const calculateBmi = () => {
    return bodyWeight / (bodyHeight / 100) ** 2
  }

  // BMR
  const [bmr, setBmr] = useState<number>(0)
  const calculateBmr = () => {
    const sexNum = sex === 'male' ? 1 : 0
    return 9.99 * bodyWeight + 6.25 * bodyHeight - 4.92 * age + (166 * sexNum - 161)
  }

  const triggerCalculate = () => {
    const { ffmi: calFfmi, adjustedFfmi } = calculateFfmi()
    const calBmi = calculateBmi()
    const calBmr = calculateBmr()

    setFfmi(Number.isNaN(calFfmi) ? 0 : calFfmi)
    setAffmi(Number.isNaN(adjustedFfmi) ? 0 : adjustedFfmi)
    setBmi(Number.isNaN(calBmi) ? 0 : calBmi)
    setBmr(Number.isNaN(calBmr) ? 0 : calBmr)
  }

  // Tabs
  const [tab, setTab] = useState<string>('ffmi')
  const tabItems = {
    ffmi: ffmi.toFixed(2),
    bmi: bmi.toFixed(1),
    bmr: bmr.toFixed(0),
    tdee: null,
  }

  const inputStates = {
    age: ['bmr'].includes(tab),
    sex: ['bmr'].includes(tab),
    height: true,
    weight: true,
    fat: ['ffmi'].includes(tab),
  }

  return (
    <div className='container'>
      <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
        <h2 className='text-2xl font-bold'>{t('cal.basicInfo')}</h2>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label htmlFor='age' className={cn({ 'text-muted-foreground': !inputStates.age })}>
            {t('cal.age')}
          </Label>
          <Input type='number' id='age' value={age} onChange={e => setAge(+e.target.value)} />
        </div>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label className={cn({ 'text-muted-foreground': !inputStates.sex })}>
            {t('cal.sex')}
          </Label>
          <RadioGroup value={sex} onValueChange={sex => setSex(sex)}>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='male' id='male' />
              <Label htmlFor='male'>{t('cal.male')}</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='female' id='female' />
              <Label htmlFor='female'>{t('cal.female')}</Label>
            </div>
          </RadioGroup>
        </div>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label
            htmlFor='bodyHeight'
            className={cn({ 'text-muted-foreground': !inputStates.height })}
          >
            {t('cal.bodyHeight')}（cm）
          </Label>
          <Input
            type='number'
            id='bodyHeight'
            value={bodyHeight}
            onChange={e => setBodyHeight(+e.target.value)}
          />
        </div>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label
            htmlFor='bodyWeight'
            className={cn({ 'text-muted-foreground': !inputStates.weight })}
          >
            {t('cal.bodyWeight')}（kg）
          </Label>
          <Input
            type='number'
            id='bodyWeight'
            value={bodyWeight}
            onChange={e => setBodyWeight(+e.target.value)}
          />
        </div>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label htmlFor='bodyFat' className={cn({ 'text-muted-foreground': !inputStates.fat })}>
            {t('cal.bodyFat')}（%）
          </Label>
          <Input
            type='number'
            id='bodyFat'
            max={100}
            value={bodyFat}
            onChange={e => setBodyFat(+e.target.value)}
          />
        </div>
        <div>
          <Button onClick={triggerCalculate}>{t('cal.calculate')}</Button>
        </div>

        <Separator className='my-4' />

        <h2 className='text-2xl font-bold'>{t('cal.result')}</h2>
        <Tabs value={tab} onValueChange={tab => setTab(tab)}>
          <TabsList className='inline-grid size-max grid-cols-2 sm:grid-cols-4'>
            {Object.entries(tabItems).map(item => (
              <TabsTrigger value={item[0]} key={item[0]}>
                {item[0].toUpperCase()}
                {item[1] && `: ${item[1]}`}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value='ffmi'>
            <section className='py-6'>
              <h3 className='mb-4 text-xl font-bold'>{t('ffmi.fullName')}</h3>
              <p className='pl-4'>{t('ffmi.description')}</p>
              <Separator className='my-6' />
              <h4 className='mb-4 text-lg font-bold'>{t('cal.formula')}</h4>
              <p className='pl-4'>
                FFMI = ({t('cal.bodyWeight')} x (100% - {t('cal.bodyFat')})) / {t('cal.bodyHeight')}
                <sup>2</sup>(m)
                <br />
                {t('ffmi.adjusted')} = FFMI + (6.1 x (1.8 - {t('cal.bodyHeight')}(m)))
              </p>
              <Separator className='my-6' />
              <h4 className='mb-2 text-lg font-bold'>{t('cal.standard')}</h4>
              <ul className='mb-4 inline-block list-inside list-disc'>
                {ffmiRanges.map(({ label, condition }, index) => (
                  <li key={index} className={cn('rounded-sm px-4 py-1', condition && 'bg-primary')}>
                    {label}
                  </li>
                ))}
              </ul>
              <p className='text-lg'>
                {t('cal.yourValue')}:{' '}
                <span className='font-bold text-cyan-600'>{ffmi.toFixed(2)}</span>
                <br />
                {t('ffmi.adjusted')}:{' '}
                <span className='font-bold text-cyan-600'>{affmi.toFixed(2)}</span>
              </p>
            </section>
          </TabsContent>
          <TabsContent value='bmi'>
            <section className='py-6'>
              <h3 className='mb-4 text-xl font-bold'>{t('bmi.fullName')}</h3>
              <p className='pl-4'>{t('bmi.description')}</p>
              <Separator className='my-6' />
              <h4 className='mb-4 text-lg font-bold'>{t('cal.formula')}</h4>
              <p className='pl-4'>
                BMI = {t('cal.bodyWeight')}(kg) / {t('cal.bodyHeight')}(m)<sup>2</sup>
              </p>
              <Separator className='my-6' />
              <h4 className='mb-2 text-lg font-bold'>{t('cal.standard')}</h4>
              <ul className='mb-4 list-inside list-disc'>
                {bmiRanges.map(({ label, condition }, index) => (
                  <li key={index} className={cn('rounded-sm py-1 pl-4', condition && 'bg-primary')}>
                    {label}
                  </li>
                ))}
              </ul>
              <p className='text-lg'>
                {t('cal.yourValue')}:{' '}
                <span className='font-bold text-cyan-600'>{bmi.toFixed(1)}</span>
              </p>
            </section>
          </TabsContent>
          <TabsContent value='bmr'>
            <section className='py-6'>
              <h3 className='mb-4 text-xl font-bold'>{t('bmr.fullName')}</h3>
              <p className='pl-4'>{t('bmr.description')}</p>
              <Separator className='my-6' />
              <h4 className='mb-4 text-lg font-bold'>{t('cal.formula')}</h4>
              <p className='pl-4'>
                BMR({t('cal.male')})=(13.7×{t('cal.bodyWeight')}(kg))+(5.0×{t('cal.bodyHeight')}
                (cm))-(6.8×{t('cal.age')})+66
                <br />
                BMR({t('cal.female')})=(9.6×{t('cal.bodyWeight')}(kg))+(1.8×{t('cal.bodyHeight')}
                (cm))-(4.7×{t('cal.age')})+655
              </p>
              <Separator className='my-6' />
              <p className='text-lg'>
                {t('cal.yourValue')}:{' '}
                <span className='font-bold text-cyan-600'>{bmr.toFixed(0)}</span>
              </p>
            </section>
          </TabsContent>
          <TabsContent value='tdee'>
            <section className='py-6'>
              <h3 className='mb-4 text-xl font-bold'>{t('tdee.fullName')}</h3>
              <p className='pl-4'>{t('tdee.description')}</p>
              <Separator className='my-6' />
              <h4 className='mb-4 text-lg font-bold'>{t('cal.formula')}</h4>
              <p className='pl-4'>TDEE = BMR x {t('tdee.activityLevel')}</p>
              <p className='ml-4 mt-2 italic underline'>{t('tdee.activityLevelDescription')}</p>
              <Separator className='my-6' />
              <p className='mb-4 text-lg'>{t('cal.yourValue')}: </p>
              <ul className='space-y-2 pl-4'>
                <li>
                  {t('tdee.level0')} =
                  <span className='ml-2 font-bold text-cyan-500'>{(bmr * 1.2).toFixed(0)}</span>
                </li>
                <li>
                  {t('tdee.level1')} =
                  <span className='ml-2 font-bold text-cyan-500'>{(bmr * 1.375).toFixed(0)}</span>
                </li>
                <li>
                  {t('tdee.level2')} =
                  <span className='ml-2 font-bold text-cyan-500'>{(bmr * 1.55).toFixed(0)}</span>
                </li>
                <li>
                  {t('tdee.level3')} =
                  <span className='ml-2 font-bold text-cyan-500'>{(bmr * 1.725).toFixed(0)}</span>
                </li>
                <li>
                  {t('tdee.level4')} =
                  <span className='ml-2 font-bold text-cyan-500'>{(bmr * 1.9).toFixed(0)}</span>
                </li>
              </ul>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
