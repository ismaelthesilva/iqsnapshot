import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The $1 IQ Snapshot - Discover Your Score in Minutes',
  description:
    'Take the IQ Snapshot test. Free to take, unlock your personalized score and percentile for just $1.',
  keywords: 'IQ test, intelligence test, cognitive assessment, IQ score',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  icons: {
    icon: '/images/iq-logo-favicon.png',
    apple: '/images/iq-logo-favicon.png',
  },
  openGraph: {
    title: 'The $1 IQ Snapshot - Discover Your Score in Minutes',
    description: 'Take the IQ Snapshot test. Free to take, unlock your personalized score and percentile for just $1.',
    type: 'website',
    images: ['/images/iq-logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The $1 IQ Snapshot - Discover Your Score in Minutes',
    description: 'Take the IQ Snapshot test. Free to take, unlock your personalized score and percentile for just $1.',
    images: ['/images/iq-logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <html lang="en">
      <body className={inter.className}>
        {isDev && (
          <div className="bg-yellow-500 text-black text-center py-1 text-sm font-semibold">
            TEST MODE - Use card 4242 4242 4242 4242
          </div>
        )}
        {children}
      </body>
    </html>
  )
}
