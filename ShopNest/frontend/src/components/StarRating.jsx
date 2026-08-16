import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, count, size = 13 }) {
  return (
    <div className="flex items-center gap-1">
      <span className="flex items-center gap-0.5 bg-success/10 text-success text-xs font-semibold px-1.5 py-0.5 rounded">
        {rating.toFixed(1)}
        <Star size={size} fill="currentColor" strokeWidth={0} />
      </span>
      {count != null && <span className="text-xs text-slate">({count.toLocaleString()})</span>}
    </div>
  )
}
