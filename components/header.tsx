import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image
            src="/images/iq-logo.png"
            alt="IQ Snapshot Logo"
            width={48}
            height={48}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-gray-900">
            The $1 IQ Snapshot
          </span>
        </Link>
      </div>
    </header>
  )
}
