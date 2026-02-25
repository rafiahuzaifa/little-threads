import Link from 'next/link'
import { Instagram } from 'lucide-react'

// Static placeholder Instagram grid — replace with real IG API or images
const IG_POSTS = [
  { id: 1, emoji: '👗', bg: 'bg-gradient-to-br from-pink-200 to-bubblegum-300', likes: '1.2k', caption: 'New summer collection is here! 🌸' },
  { id: 2, emoji: '👦', bg: 'bg-gradient-to-br from-sky-200 to-skyblue-300', likes: '987', caption: 'Boys looking sharp this season! ⚡' },
  { id: 3, emoji: '🌟', bg: 'bg-gradient-to-br from-yellow-200 to-sunshine-300', likes: '2.1k', caption: 'Sale is LIVE! Up to 40% off 🔥' },
  { id: 4, emoji: '👶', bg: 'bg-gradient-to-br from-green-200 to-mintgreen-300', likes: '856', caption: 'Newborn essentials are restocked! 🍼' },
  { id: 5, emoji: '🎒', bg: 'bg-gradient-to-br from-purple-200 to-lavender-300', likes: '1.5k', caption: 'School season ready — shop uniforms! 📚' },
  { id: 6, emoji: '✨', bg: 'bg-gradient-to-br from-orange-200 to-coral-300', likes: '3.2k', caption: 'Happy customers make our day! 💕' },
]

export function InstagramGrid() {
  return (
    <section className="py-10 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-fredoka text-2xl md:text-3xl text-[#2D3748] flex items-center gap-2">
              <Instagram size={28} className="text-bubblegum-500" />
              Follow Our Journey
            </h2>
            <p className="text-gray-400 text-sm font-poppins mt-0.5">
              @littlethreads.pk — Join 50,000+ happy families
            </p>
          </div>
          <Link
            href="https://instagram.com/littlethreads.pk"
            target="_blank"
            className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-bubblegum-400 to-lavender-500 text-white text-sm font-nunito font-bold px-4 py-2 rounded-full hover:shadow-pink transition-shadow"
          >
            <Instagram size={16} />
            Follow Us
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {IG_POSTS.map((post) => (
            <Link
              key={post.id}
              href="https://instagram.com/littlethreads.pk"
              target="_blank"
              className={`group relative aspect-square rounded-2xl overflow-hidden ${post.bg} cursor-pointer`}
            >
              {/* Emoji content */}
              <div className="absolute inset-0 flex items-center justify-center text-5xl md:text-6xl opacity-70 group-hover:scale-110 transition-transform duration-300">
                {post.emoji}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-center text-white">
                  <Instagram size={20} className="mx-auto mb-1" />
                  <p className="text-xs font-nunito font-bold">❤️ {post.likes}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile follow button */}
        <div className="sm:hidden text-center mt-4">
          <Link
            href="https://instagram.com/littlethreads.pk"
            target="_blank"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-bubblegum-400 to-lavender-500 text-white text-sm font-nunito font-bold px-5 py-2.5 rounded-full"
          >
            <Instagram size={16} />
            Follow @littlethreads.pk
          </Link>
        </div>
      </div>
    </section>
  )
}
