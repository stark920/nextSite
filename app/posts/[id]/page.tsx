// import { usePathname } from 'next/navigation'
import { getPostData } from '@/app/lib/posts'

export default async function Post() {
  // const pathname = usePathname()
  const postData = getPostData('ssg')

  return (
    <section>
      {postData.title}
      <br />
      {postData.id}
      <br />
      {postData.date}
      <br />
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </section>
  )
}
