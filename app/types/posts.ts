export type PostHead = {
  title: string
  date: string
  [key: string]: string
}

export type Post = {
  id: string
} & PostHead
