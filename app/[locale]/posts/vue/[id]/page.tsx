import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FaListUl } from 'react-icons/fa'
import { getPostData } from '@/app/lib/posts'
import { useTranslation } from '@/app/i18n'

import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import BackToTop from '@/components/back-to-top'
import PostNavigation from '@/components/post-navigation'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params
  const postData = await getPostData(id, 'vue')
  if (!postData) return {}

  return {
    title: `${postData.title} - ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
    description: postData.description,
  }
}

export default async function Post({ params }: { params: { id: string; locale: string } }) {
  const { id, locale } = await params
  const { t } = await useTranslation(locale)

  const postData = await getPostData(id, 'vue')
  if (!postData) notFound()
  const { title, date, contentHtml, headings } = postData

  return (
    <section className='grid gap-x-4 lg:grid-cols-[1fr,200px]'>
      <article>
        <h1 className='text-xl font-bold tracking-wider'>{title}</h1>
        <p className='text-xs text-muted-foreground'>{date}</p>
        <Separator className='my-4' />
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>

      <nav className='relative px-4 max-lg:hidden'>
        <ul className='sticky top-14 space-y-1'>
          <div className='mb-4 font-bold'>{t('tableOfContents')}</div>
          <PostNavigation headings={headings} />
        </ul>
      </nav>

      <Popover>
        <PopoverTrigger asChild>
          <Button size='sm' variant='secondary' className='fixed right-4 top-16 lg:hidden p-0 aspect-square rounded-full opacity-75 hover:opacity-100'>
            <FaListUl />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-max'>
          <ul className='space-y-1'>
            <PostNavigation headings={headings} />
          </ul>
        </PopoverContent>
      </Popover>

      <BackToTop />
    </section>
  )
}
