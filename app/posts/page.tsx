import { getSortedPostsData } from '@/app/lib/posts'

export default async function Posts() {
  const allPostsData = getSortedPostsData()

  return (
    <section>
      <h2>Blog</h2>
      <ul>
        {allPostsData.map(({ id, date, title }) => (
          <li key={id}>
            {title}
            <br />
            {id}
            <br />
            {date}
          </li>
        ))}
      </ul>
    </section>
  )
}
