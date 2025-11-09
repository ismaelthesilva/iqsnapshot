import Link from 'next/link'
import Image from 'next/image'
import { legalFooter } from '@/lib/copy'

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image
              src="/images/iq-logo.png"
              alt="IQ Snapshot Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
          </Link>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          {legalFooter.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="text-center text-sm text-gray-500 mb-2">{legalFooter.copyright}</div>

        <div className="text-center text-xs text-gray-400">{legalFooter.disclaimer}</div>
      </div>
    </footer>
  )
}
