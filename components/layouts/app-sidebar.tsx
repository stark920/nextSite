'use client'

import * as React from 'react'
import { FaDumbbell, FaBlog, FaInstagram, FaGithub, FaChild } from 'react-icons/fa'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { NavLogo } from './nav-logo'
import { NavLinks } from './nav-links'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { SidebarNav, SidebarLink } from '@/types/sidebar'

const navLinks: SidebarNav[] = [
  {
    title: 'fitness',
    url: '#',
    icon: FaDumbbell,
    items: [
      {
        title: 'calculator',
        url: '#',
      },
      {
        title: 'trainingPlan',
        url: '#',
      },
      {
        title: 'recommendedResources',
        url: '#',
      },
    ],
  },
  {
    title: 'blog',
    url: '#',
    icon: FaBlog,
    items: ['vue', 'react', 'web'].map(title => ({
      title,
      url: `/posts/${title}`
    }))
  },
]

const externalLinks: SidebarLink[] = [
  {
    name: 'Github',
    url: 'https://github.com/',
    icon: FaGithub,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/',
    icon: FaInstagram,
  },
  {
    name: 'iThome',
    url: 'https://www.ithome.com.tw/',
    icon: FaChild,
  },
]

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  locale: string
}

export function AppSidebar({ locale, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navLinks} locale={locale} />
        <NavLinks projects={externalLinks} locale={locale} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
