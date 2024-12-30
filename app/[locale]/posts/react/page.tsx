import { getI18nText } from '@/app/i18n'
import { getSortedPostsData } from '@/app/lib/usePostData'
import PostInfoCard from '@/components/post/post-info-card'

const category = 'react'

export default async function VuePosts({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const { t } = await getI18nText(locale)
  const allPostsData = getSortedPostsData(category)
  return (
    <section>
      <h2 className='mb-4 pl-2 font-bold leading-loose'>
        {t(category)} {t('articleList')} :
      </h2>
      <div className='grid gap-4 lg:grid-cols-2'>
        {allPostsData.map(post => (
          <PostInfoCard post={post} category={category} locale={locale} key={post.id} />
        ))}
      </div>
    </section>
  )
}
