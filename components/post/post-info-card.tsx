import { Post } from '@/types/posts'
import Link from 'next/link'
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

type Props = {
  post: Post
  locale: string
  category: string
}

export default async function PostInfoCard({ post, locale, category }: Props) {
  const { t } = await useTranslation(locale)
  const url = `/${locale}/posts/${category}/${post.id}`
  const theDate = new Date(post.date)
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Card key={post.id} className='flex flex-col hover:bg-card-active'>
      <CardHeader className='pb-2'>
        <div className='mb-2'>
          <CardDescription>{dateFormatter.format(theDate)}</CardDescription>
          <Link href={url}>
            <CardTitle className='text-xl font-bold text-cyan-600 duration-300 hover:text-foreground'>
              {t(post.id.replace(/.*-/, ''))}
            </CardTitle>
          </Link>
        </div>
        <div className='flex flex-wrap gap-2'>
          {post.tags.split(',').map(tag => (
            <Badge variant='outline' key={tag}>
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className='flex-1 px-7'>
        <p>{post.description}</p>
      </CardContent>
      <CardFooter>
        <Link href={url} className='w-full'>
          <Button variant='secondary' asChild>
            <span className='w-full'>{t('readMore')}</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
