import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Post, PostHead } from '@/types/posts'
import { Marked } from 'marked'
import { gfmHeadingId, getHeadingList } from 'marked-gfm-heading-id'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'

const postsDirectory = path.join(process.cwd(), 'posts')

// Hight-light code
const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

// Heading list
marked.use(
  gfmHeadingId({
    prefix: 'ph-',
  }),
)

export function getSortedPostsData(category: string) {
  try {
    const fullDirectory = `${postsDirectory}/${category}`
    const fileNames = fs.readdirSync(fullDirectory)
    const allPostsData = fileNames.map(fileName => {
      const id = fileName.replace(/\.md$/, '')
      // file name rule: [order]-[filename]
      const order = Number(id.split('-')[0])
      const fullPath = path.join(fullDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        id,
        order,
        ...(data as PostHead),
      } satisfies Post
    })
    return allPostsData.sort((a, b) => b.order - a.order)
  } catch {
    return []
  }
}

export function getAllPostName(category: string) {
  const fileNames = fs.readdirSync(`${postsDirectory}/${category}`)
  return fileNames.map(fileName => fileName.replace(/\.md$/, ''))
}

export async function getPostData(category: string, fileName: string) {
  try {
    const fullDirectory = `${postsDirectory}/${category}`

    // Get previous/next file name
    const fileNames = fs.readdirSync(fullDirectory).map(fileName => fileName.replace(/\.md$/, ''))
    // file name rule: [order]-[filename]
    const currentIndex = Number(fileName.split('-')[0])
    const previousPage =
      fileNames.find(name => name.split('-')[0] === `${currentIndex + 1}`) ?? null
    const nextPage = fileNames.find(name => name.split('-')[0] === `${currentIndex - 1}`) ?? null

    // Get content and headings
    const fullPath = path.join(fullDirectory, `${fileName}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { content, data } = matter(fileContents)
    const contentHtml = await marked.parse(content)
    const headings = getHeadingList()

    return {
      contentHtml,
      headings,
      previousPage,
      nextPage,
      ...(data as PostHead),
    }
  } catch {
    return null
  }
}
