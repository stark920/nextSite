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
import { cn } from '@/lib/utils'

export function AppHeader({ locale }: { locale: string }) {
  const { t } = useTranslation(locale)

  const currentPathList = usePathname()
    .split('/')
    .filter(el => el)
  const firstPath = currentPathList[1] ?? 'home'
  currentPathList.splice(0, 2)

  return (
    <header className='sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 bg-background transition-[width] ease-linear'>
      <div className='flex w-full items-center justify-between gap-2 px-4'>
        <div className='flex items-center gap-2'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden lg:block'>
                <BreadcrumbLink href={firstPath === 'home' ? '/' : `/${firstPath}`}>
                  {t(firstPath)}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {currentPathList.map((path, index) => (
                <React.Fragment key={path}>
                  <BreadcrumbSeparator className={cn(index === 0 && 'hidden lg:block')} />
                  <BreadcrumbItem>
                    <BreadcrumbPage className='max-lg:max-w-20 max-lg:truncate'>
                      {t(path)}
                    </BreadcrumbPage>
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
