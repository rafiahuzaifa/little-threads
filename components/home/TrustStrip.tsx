import { Truck, RotateCcw, ShieldCheck, Headphones, CreditCard, Award } from 'lucide-react'

const TRUST_ITEMS = [
  { icon: Truck, label: 'Free Delivery', sub: 'On orders above ₨3,000', color: 'text-mintgreen-600', bg: 'bg-mintgreen-50' },
  { icon: RotateCcw, label: 'Easy Returns', sub: '7-day hassle-free returns', color: 'text-skyblue-600', bg: 'bg-skyblue-50' },
  { icon: ShieldCheck, label: '100% Authentic', sub: 'Quality guaranteed', color: 'text-bubblegum-600', bg: 'bg-bubblegum-50' },
  { icon: CreditCard, label: 'Secure Payment', sub: 'JazzCash • EasyPaisa • COD', color: 'text-sunshine-600', bg: 'bg-sunshine-50' },
  { icon: Headphones, label: '24/7 Support', sub: 'WhatsApp customer care', color: 'text-lavender-600', bg: 'bg-lavender-50' },
  { icon: Award, label: 'Best Quality', sub: 'Soft, safe, certified fabrics', color: 'text-coral-600', bg: 'bg-coral-50' },
]

export function TrustStrip() {
  return (
    <section className="py-8 px-4 border-y border-gray-100 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {TRUST_ITEMS.map(({ icon: Icon, label, sub, color, bg }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2 group">
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={22} className={color} strokeWidth={1.8} />
              </div>
              <div>
                <p className={`font-nunito font-bold text-sm ${color}`}>{label}</p>
                <p className="text-xs text-gray-400 font-poppins leading-tight">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
