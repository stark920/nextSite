import Post from '@/components/post/post'
import { getPostData } from '@/app/lib/usePostData'
import type { Metadata } from 'next'

const category = 'fitness'

export async function generateMetadata(): Promise<Metadata> {
  const postData = await getPostData(category, '')
  if (!postData) return {}

  return {
    title: `${postData.title} - ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
    description: postData.description,
    category,
  }
}

export default async function Suggest({ params }: { params: { locale: string } }) {
  const { locale } = await params

  return <Post id='recommendedResources' locale={locale} category={category} showDate={false} />
}
