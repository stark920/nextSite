import Link from 'next/link'
import { getSortedPostsData } from '@/app/lib/posts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/app/i18n'

const category = 'web'

export default async function VuePosts({ params }: { params: { locale: string } }) {
  const { locale } = await params
  const { t } = await useTranslation(locale)
  const allPostsData = getSortedPostsData(category)

  return (
    <section>
      <h2 className='mb-4 pl-2 text-xl font-bold leading-loose'>
        {t(category)} {t('articleList')} :
      </h2>
      <div className='grid gap-4 lg:grid-cols-2'>
        {allPostsData.map(({ id, date, title, description, tags }) => (
          <Card key={id} className='flex flex-col'>
            <CardHeader className='pb-2'>
              <div className='mb-2'>
                <CardDescription>{date}</CardDescription>
                <Link href={`/${locale}/posts/${category}/${id}`}>
                  <CardTitle className='text-xl font-bold text-cyan-600 duration-300 hover:text-foreground'>
                    {title}
                  </CardTitle>
                </Link>
              </div>
              <div className='flex flex-wrap gap-2'>
                {tags.split(',').map(tag => (
                  <Badge variant='outline' key={tag}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className='flex-1 px-7'>
              <p>{description}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/${locale}/posts/${category}/${id}`} className='w-full'>
                <Button variant='secondary' className='w-full'>
                  {t('readMore')}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
