import Link from 'next/link'
import { Facebook, Instagram, Phone, Mail, MapPin, MessageCircle, Heart } from 'lucide-react'
import type { SiteSettings } from '@/types'

interface FooterProps {
  settings?: SiteSettings
}

export function Footer({ settings }: FooterProps) {
  const storeName = settings?.storeName || 'Little Threads'
  const whatsappUrl = settings?.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Hi! I need help with Little Threads store.')}`
    : '#'

  return (
    <footer className="bg-navy text-gray-300 pt-14 pb-24 md:pb-10 relative overflow-hidden">
      {/* Rainbow top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-rainbow" />

      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-bubblegum-500/5 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-skyblue-400/5 pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-pink rounded-xl flex items-center justify-center shadow-pink">
                <span className="text-white font-fredoka text-lg">L</span>
              </div>
              <span className="font-fredoka text-xl text-white">
                Little <span className="text-bubblegum-400">Threads</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed font-poppins">
              {settings?.tagline || 'Adorable clothes for your little ones. Quality, comfort, and style for every occasion.'}
            </p>
            <div className="flex gap-2">
              {settings?.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-bubblegum-500 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                >
                  <Facebook size={16} />
                </a>
              )}
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-bubblegum-500 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                >
                  <Instagram size={16} />
                </a>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-[#25D366] rounded-xl flex items-center justify-center transition-all hover:scale-110"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-nunito font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/shop', label: 'Shop All' },
                { href: '/shop?sale=true', label: '🔥 Sale Items' },
                { href: '/shop?new=true', label: '✨ New Arrivals' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-bubblegum-400 transition-colors font-poppins">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-nunito font-bold text-white mb-4">Categories</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/category/boys', label: '👦 Boys Clothing' },
                { href: '/category/girls', label: '👧 Girls Clothing' },
                { href: '/shop?gender=Unisex', label: '🌈 Unisex' },
                { href: '/shop?age=Newborn', label: '👶 Newborn' },
                { href: '/shop?age=Infant', label: '🍼 Infant (1-12M)' },
                { href: '/shop?age=Toddler', label: '🐣 Toddler (1-3Y)' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-bubblegum-400 transition-colors font-poppins">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-nunito font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {settings?.phone && (
                <li className="flex items-start gap-3">
                  <Phone size={15} className="text-bubblegum-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-400 font-poppins">{settings.phone}</span>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-start gap-3">
                  <Mail size={15} className="text-bubblegum-400 mt-0.5 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="text-sm text-gray-400 hover:text-bubblegum-400 transition-colors font-poppins">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-start gap-3">
                  <MapPin size={15} className="text-bubblegum-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-400 font-poppins">{settings.address}</span>
                </li>
              )}
              {(settings?.whatsappNumber || true) && (
                <li className="pt-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm px-4 py-2.5 rounded-xl hover:bg-[#22bf5b] transition-all font-nunito font-bold hover:shadow-green hover:scale-105"
                  >
                    <MessageCircle size={16} />
                    WhatsApp Us
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="bg-white/5 rounded-2xl p-4 mb-8 flex flex-wrap gap-4 justify-around items-center border border-white/10">
          {[
            { icon: '🚚', text: 'Free Delivery above ₨3,000' },
            { icon: '💵', text: 'Cash on Delivery' },
            { icon: '↩️', text: '7-Day Easy Returns' },
            { icon: '🔒', text: 'Secure Payments' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-sm text-gray-300 font-nunito">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {[
            { label: '📱 JazzCash', color: 'bg-orange-500/20 text-orange-300' },
            { label: '📱 EasyPaisa', color: 'bg-green-500/20 text-green-300' },
            { label: '🏦 Bank Transfer', color: 'bg-blue-500/20 text-blue-300' },
            { label: '💵 Cash on Delivery', color: 'bg-yellow-500/20 text-yellow-300' },
          ].map((method) => (
            <span
              key={method.label}
              className={`${method.color} text-xs px-3 py-1.5 rounded-xl font-nunito font-semibold`}
            >
              {method.label}
            </span>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-poppins flex items-center gap-1">
            © {new Date().getFullYear()} {storeName}. Made with <Heart size={12} className="text-bubblegum-400 fill-current" /> in Pakistan
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-bubblegum-400 transition-colors font-poppins">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-bubblegum-400 transition-colors font-poppins">
              Terms of Service
            </Link>
            <Link href="/refund" className="text-xs text-gray-500 hover:text-bubblegum-400 transition-colors font-poppins">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
