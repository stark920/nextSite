'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeSelect } from './theme-select'
import { LocaleSelect } from './locale-select'
import { useTranslation } from '@/app/i18n/client'

export function AppHeader({ locale }: { locale: string }) {
  const { t } = useTranslation(locale)

  const currentPathList = usePathname()
    .split('/')
    .filter(el => el)
  const firstPath = currentPathList[1] ?? 'home'
  currentPathList.splice(0, 2)

  return (
    <header className='sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background/75 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
      <div className='flex w-full items-center justify-between gap-2 px-4'>
        <div className='flex items-center gap-2'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='/'>{t(firstPath)}</BreadcrumbLink>
              </BreadcrumbItem>
              {currentPathList.map(path => (
                <React.Fragment key={path}>
                  <BreadcrumbSeparator className='hidden md:block' />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{path}</BreadcrumbPage>
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className='flex items-center justify-end gap-1'>
          <ThemeSelect />
          <LocaleSelect locale={locale} />
        </div>
      </div>
    </header>
  )
}
