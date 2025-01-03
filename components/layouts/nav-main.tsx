'use client'

import Link from 'next/link'
import { FaChevronRight, FaHome } from 'react-icons/fa'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarNav } from '@/types/sidebar'
import { useTranslation } from '@/app/i18n/client'

type Props = {
  items: SidebarNav[]
  locale: string
}

export function NavMain({ items, locale }: Props) {
  const { t } = useTranslation(locale)

  return (
    <>
      <SidebarGroup className='pb-0'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={t('home')}>
              <Link href='/'>
                <FaHome />
                {t('home')}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup className='pt-0'>
        <SidebarGroupLabel>{t('posts')}</SidebarGroupLabel>
        <SidebarMenu>
          {items.map(item => (
            <Collapsible key={item.title} asChild defaultOpen className='group/collapsible'>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={
                      <div className='grid gap-1 pt-1'>
                        <span>{t(item.title)}</span>
                        <Separator className='mb-1 bg-muted-foreground' />

                        {item.items?.map(subItem => (
                          <Link
                            href={subItem.url}
                            key={subItem.title}
                            className='-mx-1 rounded-md px-2 py-1 text-sm duration-300 hover:bg-muted/50'
                          >
                            {t(subItem.title)}
                          </Link>
                        ))}
                      </div>
                    }
                  >
                    {item.icon && <item.icon />}
                    <span>{t(item.title)}</span>
                    <FaChevronRight className='ml-auto !size-2 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map(subItem => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>{t(subItem.title)}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}
