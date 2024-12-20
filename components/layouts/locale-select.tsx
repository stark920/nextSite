'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'
import { cookieName } from '@/app/i18n/settings'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from '@/app/i18n/client'

type Props = {
  locale: string
}

export function LocaleSelect({ locale }: Props) {
  const { t } = useTranslation(locale)
  const currentPathname = usePathname()
  const router = useRouter()

  const handleChange = (newLocale: string) => {
    if (newLocale === locale) return

    // set cookie for react-i18n-router
    const days = 30
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = date.toUTCString()
    document.cookie = `${cookieName}=${newLocale};expires=${expires};path=/`

    // redirect to the new locale path
    router.push(currentPathname.replace(`/${locale}`, `/${newLocale}`))
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='flex h-7 items-center gap-x-2 rounded-md px-2 hover:bg-accent hover:text-accent-foreground'>
          <Globe className='h-[1.2rem] w-[1.2rem]' />
          {t(`${locale}Short`)}
          <span className='sr-only'>Select locale</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleChange('zh')}>🇹🇼 中文</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleChange('en')}>🇺🇸 English</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
