export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden card-shadow animate-pulse">
      <div className="aspect-square bg-gray-200 shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded-lg shimmer w-3/4" />
        <div className="h-3 bg-gray-200 rounded-lg shimmer w-1/2" />
        <div className="flex justify-between items-center">
          <div className="h-5 bg-gray-200 rounded-lg shimmer w-1/3" />
          <div className="h-8 bg-gray-200 rounded-lg shimmer w-1/4" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonBanner() {
  return (
    <div className="w-full aspect-[16/7] bg-gray-200 rounded-2xl shimmer animate-pulse" />
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded shimmer"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  )
}
