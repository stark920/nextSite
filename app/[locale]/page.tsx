import { getI18nText } from '@/app/i18n'
import Image from 'next/image'
import avatarPic from '@/public/images/avatar.webp'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { t } = await getI18nText(locale)
  const expLength = Array.from({ length: 7 }, (_, i) => i + 1).reverse()

  return (
    <div className='container space-y-6'>
      <section className='flex'>
        <div className='prose prose-zinc flex-1 dark:prose-invert'>
          <h1>{t('home')}</h1>
          <p>{t('aboutMe')}</p>
        </div>
        <div>
          <Image
            src={avatarPic}
            alt='Avatar'
            width={80}
            height={80}
            className='size-20 rounded-full'
          />
        </div>
      </section>

      <section className='prose prose-zinc dark:prose-invert'>
        <ul>
          <li>{t('aboutMe-F2E')}</li>
          <li>{t('aboutMe-Workout')}</li>
        </ul>
        <span>{t('aboutMe-summarize')}</span>

        <h2>{t('exp')}</h2>
        <ul>
          {expLength.map(i => (
            <li key={i}>{t(`exp-${i}`)}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
