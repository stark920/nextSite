import Calculator from './calculator'
import { getI18nText } from '@/app/i18n'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { t } = await getI18nText(locale)

  return (
    <div className='container'>
      <div className='flex flex-1 flex-col gap-6 p-4 pt-0'>
        <p className='rounded-md bg-destructive px-4 py-2 text-destructive-foreground'>
          {t('cal.remind')}
        </p>
        <Calculator locale={locale} />
        <ul className='list-inside list-disc rounded-md bg-accent px-4 py-2 italic'>
          {t('cal.references')}:
          <li>
            https://www.thecalculator.co/health/Fat-Free-Mass-Index-(FFMI)-Calculator-794.html
          </li>
          <li>https://bmi.tw/</li>
        </ul>
      </div>
    </div>
  )
}
