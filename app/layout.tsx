import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: {
    default: 'Little Threads — Kids Clothing Store Pakistan',
    template: '%s | Little Threads',
  },
  description:
    'Shop the cutest kids clothing in Pakistan. Quality children\'s wear for boys, girls & babies. Free delivery above ₨3,000. COD available.',
  keywords: ['kids clothing', 'children fashion', 'baby clothes', 'Pakistan', 'boys clothes', 'girls clothes'],
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Little Threads',
    title: 'Little Threads — Kids Clothing Store Pakistan',
    description: 'Shop the cutest kids clothing in Pakistan.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Little Threads — Kids Clothing Store Pakistan',
    description: 'Shop the cutest kids clothing in Pakistan.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-white text-charcoal antialiased font-poppins">
        <SessionProvider session={session}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                background: '#fff',
                color: '#2D3748',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: '14px',
                fontFamily: 'Nunito, sans-serif',
              },
              success: {
                iconTheme: { primary: '#4ECDC4', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#FF6B9D', secondary: '#fff' },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
