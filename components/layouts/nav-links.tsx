'use client'

import { SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { SidebarLink } from '@/types/sidebar'
import { useTranslation } from '@/app/i18n/client'

type Props = {
  links: SidebarLink[]
  locale: string
}

export function NavLinks({ links, locale }: Props) {
  const { t } = useTranslation(locale)
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>{t('socialMedia')}</SidebarGroupLabel>
      <div className='mt-2 flex gap-2 px-4'>
        {links.map(item => (
          <TooltipProvider key={item.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a href={item.url} target='_blank' rel='noreferrer noopener'>
                  <Button variant='ghost' className='size-7 p-0' asChild>
                    <span>
                      <item.icon />
                    </span>
                  </Button>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <span>{item.name}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </SidebarGroup>
  )
}
