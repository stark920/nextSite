import { getPostData } from '@/app/lib/posts'

export default async function Post({ params }: { params: { id: string }}) {
  const { id } = await params
  const postData = await getPostData(id)

  return (
    <section>
      {postData?.title}
      <br />
      {postData.id}
      <br />
      {postData?.date}
      <br />
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </section>
  )
}
