'use client'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useTranslation } from '@/app/i18n/client'
import { SidebarLink } from '@/types/sidebar'

export function NavProjects({ projects, locale }: { projects: SidebarLink[]; locale: string }) {
  const { t } = useTranslation(locale)
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>{t('projects')}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map(item => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url} target='_blank' rel='noreferrer noopener'>
                <item.icon />
                <span>{t(item.name)}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
