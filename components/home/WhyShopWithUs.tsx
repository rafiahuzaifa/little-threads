import { Truck, RotateCcw, BadgeCheck, Lock, Users, Star, Package, MapPin } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'Free delivery on all orders above Rs. 3,000. Standard shipping only Rs. 200.',
    bg: 'bg-soft-blue',
    border: 'border-skyblue-200',
    iconBg: 'bg-gradient-blue',
    iconColor: 'text-white',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '7-day hassle-free return policy. No questions asked, full refund guaranteed.',
    bg: 'bg-soft-purple',
    border: 'border-lavender-200',
    iconBg: 'bg-gradient-lavender',
    iconColor: 'text-white',
  },
  {
    icon: BadgeCheck,
    title: '100% Quality',
    description: 'Every product quality-checked for safety, comfort, and lasting durability.',
    bg: 'bg-soft-yellow',
    border: 'border-sunshine-300',
    iconBg: 'bg-gradient-sunshine',
    iconColor: 'text-charcoal',
  },
  {
    icon: Lock,
    title: 'Secure Payment',
    description: 'COD, JazzCash, EasyPaisa & Bank Transfer — all secured with encryption.',
    bg: 'bg-soft-pink',
    border: 'border-bubblegum-200',
    iconBg: 'bg-gradient-pink',
    iconColor: 'text-white',
  },
]

const stats = [
  { number: '10,000+', label: 'Happy Families', icon: Users },
  { number: '4.9 / 5', label: 'Average Rating', icon: Star },
  { number: '500+', label: 'Products', icon: Package },
  { number: '40+', label: 'Cities Served', icon: MapPin },
]

export function WhyShopWithUs() {
  return (
    <section className="py-12 bg-gray-50/50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-10">
          <h2 className="font-fredoka text-3xl md:text-4xl text-charcoal mb-2">
            Why Families Choose Us
          </h2>
          <p className="text-gray-500 font-poppins">We care about your little ones just as much as you do</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`${feature.bg} border ${feature.border} rounded-2xl p-5 hover:shadow-card transition-all duration-300 hover:-translate-y-1 text-center group`}
            >
              <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} className={feature.iconColor} strokeWidth={1.8} />
              </div>
              <h3 className="font-nunito font-bold text-charcoal mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm font-poppins leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="mt-10 bg-white rounded-2xl shadow-soft p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-fredoka text-3xl text-bubblegum-500">{stat.number}</p>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <stat.icon size={14} className="text-gray-400" />
                <p className="text-sm text-gray-500 font-nunito">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
