import '@/app/atom-one-dark.min.css'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'

import { ArticleJsonLd } from 'next-seo'
import { notFound } from 'next/navigation'

import { getI18nText } from '@/app/i18n'
import { getPostData } from '@/app/lib/usePostData'

import { FaAngleLeft, FaAngleRight, FaListUl } from 'react-icons/fa'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import BackToTop from '@/components/back-to-top'
import PostNavigation from './post-navigation'
import PostContent from './post-content'

type Props = {
  id: string
  locale: string
  category: string
  showDate?: boolean
}

export default async function Post({ id, locale, category, showDate }: Props) {
  const { t } = await getI18nText(locale)
  const postData = await getPostData(category, id)
  if (!postData) notFound()

  const { title, date, description, contentHtml, headings, previousPage, nextPage } = postData
  DOMPurify.addHook('afterSanitizeAttributes', node => {
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noopener noreferrer nofollow')
    }
  })
  const cleanHtml = DOMPurify.sanitize(contentHtml)
  const theDate = new Date(date)
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <>
      <ArticleJsonLd
        useAppDir
        type='BlogPosting'
        url={`/posts/${category}/${id}`}
        title={title}
        images={['/images/logo.png']}
        datePublished={date}
        dateModified={date}
        authorName='Genos Huang'
        description={description}
      />
      <section className='grid gap-x-8 lg:grid-cols-[1fr,220px]'>
        <article className='prose prose-zinc min-w-0 max-w-none dark:prose-invert prose-pre:bg-[#282c34] prose-pre:p-0'>
          <h1 className='mb-0 text-cyan-600'>{t(id.replace(/.*-/, ''))}</h1>
          {showDate !== false && (
            <small className='text-xs text-muted-foreground'>{dateFormatter.format(theDate)}</small>
          )}
          <Separator className='my-6' />
          <PostContent content={cleanHtml} />
          <Separator className='my-6' />
          <div className='flex items-center justify-between'>
            <div>
              {previousPage && (
                <Link href={`/${locale}/posts/${category}/${previousPage}`}>
                  <Button variant='link' className='text-cyan-600' asChild>
                    <span>
                      <FaAngleLeft />
                      {t(previousPage.replace(/.*-/, ''))}
                    </span>
                  </Button>
                </Link>
              )}
            </div>
            <div>
              {nextPage && (
                <Link href={`/${locale}/posts/${category}/${nextPage}`}>
                  <Button variant='link' className='text-cyan-600' asChild>
                    <span>
                      {t(nextPage.replace(/.*-/, ''))}
                      <FaAngleRight />
                    </span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </article>
        <nav className='relative px-4 max-lg:hidden'>
          <ul className='sticky top-14 grid gap-2'>
            <div className='mb-4 min-w-0 font-bold'>{t('tableOfContents')}</div>
            <PostNavigation headings={headings} />
          </ul>
        </nav>
        <Popover>
          <PopoverTrigger className='fixed right-4 top-16 lg:hidden'>
            <FaListUl />
          </PopoverTrigger>
          <PopoverContent>
            <ul className='sticky top-14 space-y-1'>
              <div className='mb-4 font-bold'>{t('tableOfContents')}</div>
              <PostNavigation headings={headings} />
            </ul>
          </PopoverContent>
        </Popover>
        <BackToTop />
      </section>
    </>
  )
}
