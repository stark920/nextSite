import Image from 'next/image'
import logoPng from '@/public/images/logo.png'
import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export function NavLogo() {
  const { state } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          className={cn(
            'flex items-center gap-x-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground',
            state === 'expanded' && 'px-2 py-1',
          )}
        >
          <div className='flex aspect-square size-8 items-center justify-center'>
            <Image src={logoPng} alt='Logo' width={32} height={32} className='rounded-lg' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate text-base font-semibold'>
              {process.env.NEXT_PUBLIC_SITE_TITLE}
            </span>
            <span className='truncate text-xs'>{process.env.NEXT_PUBLIC_SITE_DESCRIPTION}</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
