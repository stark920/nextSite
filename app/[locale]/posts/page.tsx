import Link from 'next/link'
import { getSortedPostsData } from '@/app/lib/usePostData'
import { useTranslation } from '@/app/i18n'
import { FaEllipsisH } from 'react-icons/fa'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export default async function PostCategory({ params }: { params: { locale: string } }) {
  const { locale } = await params
  const { t } = await useTranslation(locale)
  const cards = {
    vue: getSortedPostsData('vue').slice(0, 5),
    react: getSortedPostsData('react').slice(0, 5),
    web: getSortedPostsData('web').slice(0, 5),
  }

  return (
    <section>
      <h2 className='text-xl font-bold'>{t('blog')}</h2>
      <Separator className='mb-4 mt-2' />
      <div className='grid gap-6 xl:grid-cols-2'>
        {Object.entries(cards).map(card => (
          <Card key={card[0]} className='flex flex-col'>
            <CardHeader>
              <CardTitle>{t(card[0])}</CardTitle>
            </CardHeader>
            <CardContent className='mb-4 flex-1'>
              <ol className='grid gap-y-1'>
                {card[1].map(({ id, date, title }, index) => (
                  <li key={id} className='rounded-md px-2 py-1 hover:bg-primary'>
                    <Link href={`/posts/${card[0]}/${id}`} className='flex'>
                      <span className='w-4'>{index + 1}.</span>
                      <span>{title}</span>
                      <span className='ml-auto'>{date}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </CardContent>
            <CardFooter>
              <Link href={`/posts/${card[0]}`} className='w-full'>
                <Button variant='secondary' asChild>
                  <span className='w-full'>
                    <FaEllipsisH />
                    {t('more')}
                  </span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
