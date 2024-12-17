import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function NotFound() {
  return (
    <div className='flex h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-4'>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href='/'>
        <Button asChild>
          <span>Home</span>
        </Button>
      </Link>
    </div>
  )
}
