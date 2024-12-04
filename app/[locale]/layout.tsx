import './globals.css'
import type { Metadata } from 'next'
import { languages } from '@/app/i18n/settings'
import { dir } from 'i18next'

import { AppSidebar } from '@/components/layouts/app-sidebar'
import { AppHeader } from '@/components/layouts/app-header'
import { ThemeProvider } from '@/components/layouts/theme-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_SITE_TITLE,
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
}

export function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: {
    locale: string
  }
}>) {
  const { locale } = await params
  return (
    <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <AppHeader locale={locale} />
              <div className='container px-4 py-2'>
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
