'use client'

import * as React from 'react'
import { FaDumbbell, FaBlog, FaInstagram, FaGithub, FaChild, FaBook } from 'react-icons/fa'
import { FaScissors } from 'react-icons/fa6'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { NavLogo } from './nav-logo'
import { NavLinks } from './nav-links'
import { NavProjects } from './nav-projects'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { SidebarNav, SidebarLink } from '@/types/sidebar'

const mainLinks: SidebarNav[] = [
  {
    title: 'fitness',
    url: '#',
    icon: FaDumbbell,
    items: [
      {
        title: 'calculator',
        url: '/calculator',
      },
      {
        title: 'trainingPlan',
        url: '#',
      },
      // {
      //   title: 'antiAging',
      //   url: '#',
      // },
      {
        title: 'recommendedResources',
        url: '/recommendedResources',
      },
    ],
  },
  {
    title: 'blog',
    url: '#',
    icon: FaBlog,
    items: ['vue', 'react', 'web'].map(title => ({
      title,
      url: `/posts/${title}`,
    })),
  },
]

const projects: SidebarLink[] = [
  {
    name: 'iThome',
    url: 'https://ithelp.ithome.com.tw/users/20129729/articles',
    icon: FaChild,
  },
  {
    name: 'vue3-image-cropper',
    url: 'https://github.com/stark920/vue3-image-cropper',
    icon: FaScissors,
  },
  {
    name: 'vue-storybook-starter',
    url: 'https://github.com/stark920/vue-storybook-starter',
    icon: FaBook,
  },
]

const externalLinks: SidebarLink[] = [
  {
    name: 'Github',
    url: 'https://github.com/stark920',
    icon: FaGithub,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/hautang.huang/',
    icon: FaInstagram,
  },
]

type Props = {
  locale: string
} & React.ComponentProps<typeof Sidebar>

export function AppSidebar({ locale, ...props }: Props) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={mainLinks} locale={locale} />
        <NavProjects projects={projects} locale={locale} />
        <NavLinks links={externalLinks} locale={locale} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
