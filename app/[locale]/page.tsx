import { getSortedPostsData } from '@/app/lib/posts'
import Link from 'next/link'
import { useTranslation } from '@/app/i18n'

export default async function Home({ params }: { params: { locale: string } }) {
  const { locale } = await params
  const { t } = await useTranslation(locale)
  // const allPostsData = getSortedPostsData()

  return (
    <section>
      <h2>Blog</h2>
      {/* <ul>
        {allPostsData.map(({ id, date, title }) => (
          <li key={id}>
            <Link href={`/${locale}/posts/${id}`}>
              {title}
              <br />
              {date}
            </Link>
          </li>
        ))}
      </ul> */}
      <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
        <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
          <div className='aspect-video rounded-xl bg-muted/50' />
          <div className='aspect-video rounded-xl bg-muted/50' />
          <div className='aspect-video rounded-xl bg-muted/50' />
        </div>
        <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min' />
      </div>
    </section>
  )
}
