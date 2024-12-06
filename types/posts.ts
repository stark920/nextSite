export interface PostHead {
  title: string
  date: string
  description: string
  order: number
  tags: string
}

export interface Post extends PostHead {
  id: string
} 
