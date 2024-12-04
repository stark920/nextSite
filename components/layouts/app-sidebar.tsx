'use client'

import * as React from 'react'
import { FaDumbbell, FaBlog, FaInstagram, FaGithub, FaChild } from 'react-icons/fa'
import { NavMain } from './nav-main'
import { NavProjects } from './nav-projects'
import { NavUser } from './nav-user'
import { NavLogo } from './nav-logo'
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
        title: 'History',
        url: '#',
      },
      {
        title: 'Starred',
        url: '#',
      },
      {
        title: 'Settings',
        url: '#',
      },
    ],
  },
  {
    title: 'blog',
    url: '#',
    icon: FaBlog,
    items: [
      {
        title: 'Genesis',
        url: '#',
      },
      {
        title: 'Explorer',
        url: '#',
      },
      {
        title: 'Quantum',
        url: '#',
      },
    ],
  },
]

const externalLinks = [
  {
    name: 'Github',
    url: '#',
    icon: FaGithub,
  },
  {
    name: 'Instagram',
    url: '#',
    icon: FaInstagram,
  },
  {
    name: 'iThome',
    url: '#',
    icon: FaChild,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navLinks} />
        <NavProjects projects={externalLinks} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
