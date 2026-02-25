import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'
import { client } from '@/sanity/lib/client'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import type { SiteSettings } from '@/types'

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings: SiteSettings = await client.fetch(siteSettingsQuery, {}, { next: { revalidate: 3600 } })

  return (
    <div className="flex flex-col min-h-screen">
      {settings?.showAnnouncementBar && settings?.announcementBar && (
        <AnnouncementBar text={settings.announcementBar} />
      )}
      <Navbar settings={settings} />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <Footer settings={settings} />
      <MobileMenu />
      {settings?.whatsappNumber && (
        <WhatsAppButton phoneNumber={settings.whatsappNumber} />
      )}
    </div>
  )
}
