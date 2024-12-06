import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function NotFound() {
  return (
    <div className='flex flex-col gap-4 h-[calc(100dvh-3.5rem)] items-center justify-center'>
        <h2>Not Found</h2>
        <p>Could not find requested resource</p>
        <Link href="/">
          <Button>
            Home
          </Button>
        </Link>
    </div>
  )
}