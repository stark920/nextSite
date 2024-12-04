import { IconType } from 'react-icons/lib'

export interface SidebarSubItem {
  title: string
  url: string
}

export interface SidebarNav {
  title: string
  url: string
  icon: IconType
  items: SidebarSubItem[]
}

export interface SidebarLink {
  name: string
  url: string
  icon: IconType
}
