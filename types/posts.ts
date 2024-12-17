export interface PostHead {
  title: string
  date: string
  description: string
  tags: string
}

export interface Post extends PostHead {
  id: string
  order: number
} 
