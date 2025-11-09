'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { paywallCopy } from '@/lib/copy'
import { Lock, CreditCard, Shield } from 'lucide-react'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: (includeBump: boolean, utmParams: Record<string, string>) => Promise<void>
  isLoading: boolean
}

export default function PaywallModal({ isOpen, onClose, onCheckout, isLoading }: PaywallModalProps) {
  const [includeBump, setIncludeBump] = useState(false)

  const handleCheckout = () => {
    const utmParams: Record<string, string> = {}
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.forEach((value, key) => {
      if (key.startsWith('utm_')) {
        utmParams[key] = value
      }
    })
    onCheckout(includeBump, utmParams)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl text-center">
            {paywallCopy.header}
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            {paywallCopy.subheader}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Value Bullets */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4 text-gray-900">What You Get:</h3>
            <div className="space-y-2">
              {paywallCopy.valueBullets.map((bullet, idx) => (
                <div key={idx} className="text-sm text-gray-700">
                  {bullet}
                </div>
              ))}
            </div>
          </div>

          {/* Order Bump */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Checkbox
                id="bump"
                checked={includeBump}
                onCheckedChange={(checked) => setIncludeBump(checked === true)}
                className="mt-1"
              />
              <label htmlFor="bump" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{paywallCopy.orderBump.title}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    {paywallCopy.orderBump.price}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{paywallCopy.orderBump.description}</p>
              </label>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Stripe Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>All Cards Accepted</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>SSL Encrypted</span>
            </div>
          </div>

          {/* Total Display */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-sm text-gray-600 mb-1">Total Today:</div>
            <div className="text-4xl font-bold text-gray-900">
              ${includeBump ? '8.00' : '1.00'}
            </div>
            <div className="text-sm text-gray-500 mt-1">One-time payment • No subscriptions</div>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            className="w-full text-lg h-14"
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : paywallCopy.cta}
          </Button>

          {/* Disclaimer */}
          <p className="text-xs text-center text-gray-500">{paywallCopy.disclaimer}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
