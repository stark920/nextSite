import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Post, PostHead } from '@/types/posts'
import { Remarkable } from 'remarkable'
import { marked, Tokens } from 'marked'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData(category: string) {
  try {
    const fullDirectory = `${postsDirectory}/${category}`
    // Get file names under /posts
    const fileNames = fs.readdirSync(fullDirectory)
    const allPostsData = fileNames.map(fileName => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '')

      // Read markdown file as string
      const fullPath = path.join(fullDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents)

      // Combine the data with the id
      return {
        id,
        ...(matterResult.data as PostHead),
      } satisfies Post
    })
    // Sort posts by date
    return allPostsData.sort((a, b) => a.order - b.order)
  } catch {
    return []
  }
}

export function getAllPostIds(category: string) {
  const fileNames = fs.readdirSync(`${postsDirectory}/${category}`)

  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    }
  })
}

export async function getPostData(id: string, category: string) {
  try {
    const fullPath = path.join(`${postsDirectory}/${category}`, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use remarkable to convert markdown into HTML string
    const md = new Remarkable()
    let contentHtml = md.render(matterResult.content)

    // Use Marked to tokenize the content
    const tokens = marked.lexer(matterResult.content)
    const headings = tokens.filter(token => token.type === 'heading') as Tokens.Heading[]

    // Add `id` attributes to headings
    headings.forEach(heading => {
      const id = heading.text.toLowerCase().replace(/\s+/g, '-') // Generate slug
      const regex = new RegExp(`<h${heading.depth}>(.*?)</h${heading.depth}>`)
      contentHtml = contentHtml.replace(
        regex,
        `<h${heading.depth} id="${id}">$1</h${heading.depth}>`,
      )
    })

    return {
      id,
      contentHtml,
      headings,
      ...(matterResult.data as PostHead),
    }
  } catch {
    return null
  }
}
