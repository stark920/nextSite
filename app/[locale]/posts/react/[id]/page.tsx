import Post from '@/components/post/post'
import { getPostData } from '@/app/lib/usePostData'
import type { Metadata } from 'next'

const category = 'react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const postData = await getPostData(category, id)
  if (!postData) return {}

  return {
    title: `${postData.title} - ${process.env.NEXT_PUBLIC_SITE_TITLE}`,
    description: postData.description,
    category,
  }
}

export default async function ReactPost({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = await params

  return <Post id={id} locale={locale} category={category} />
}
