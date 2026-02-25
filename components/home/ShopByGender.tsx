import Link from 'next/link'

export function ShopByGender() {
  return (
    <section className="py-6 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Boys Banner */}
          <Link
            href="/shop?gender=boys"
            className="group relative h-48 sm:h-64 rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-skyblue-400 via-blue-500 to-blue-600" />
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
            </div>
            {/* Floating emojis */}
            <span className="absolute top-4 right-8 text-4xl opacity-40 group-hover:scale-125 transition-transform duration-500">⚽</span>
            <span className="absolute bottom-6 right-4 text-3xl opacity-30 group-hover:rotate-12 transition-transform duration-500">🚀</span>
            <span className="absolute top-8 right-20 text-2xl opacity-25 animate-bounce">🎮</span>

            <div className="absolute inset-0 flex flex-col justify-center pl-8">
              <span className="text-blue-100 text-xs font-nunito font-semibold uppercase tracking-widest mb-1">Collection</span>
              <h3 className="font-fredoka text-4xl md:text-5xl text-white drop-shadow-lg mb-1">Boys</h3>
              <p className="text-blue-100 text-sm font-poppins mb-4">Shirts • Pants • Shoes & more</p>
              <span className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-nunito font-bold px-5 py-2 rounded-full w-fit backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-blue-600">
                Shop Boys →
              </span>
            </div>
          </Link>

          {/* Girls Banner */}
          <Link
            href="/shop?gender=girls"
            className="group relative h-48 sm:h-64 rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-bubblegum-400 via-bubblegum-500 to-pink-600" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
            </div>
            <span className="absolute top-4 right-8 text-4xl opacity-40 group-hover:scale-125 transition-transform duration-500">🌸</span>
            <span className="absolute bottom-6 right-4 text-3xl opacity-30 group-hover:rotate-12 transition-transform duration-500">👗</span>
            <span className="absolute top-8 right-20 text-2xl opacity-25 animate-bounce">🎀</span>

            <div className="absolute inset-0 flex flex-col justify-center pl-8">
              <span className="text-pink-100 text-xs font-nunito font-semibold uppercase tracking-widest mb-1">Collection</span>
              <h3 className="font-fredoka text-4xl md:text-5xl text-white drop-shadow-lg mb-1">Girls</h3>
              <p className="text-pink-100 text-sm font-poppins mb-4">Dresses • Tops • Accessories & more</p>
              <span className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-nunito font-bold px-5 py-2 rounded-full w-fit backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-pink-600">
                Shop Girls →
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
