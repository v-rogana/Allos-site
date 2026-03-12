'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange: (v: number) => void
  size?: number
}

export default function StarRating({ value, onChange, size = 32 }: StarRatingProps) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform duration-150 hover:scale-110"
        >
          <Star
            size={size}
            fill={(hover || value) >= star ? '#C84B31' : 'transparent'}
            stroke={(hover || value) >= star ? '#C84B31' : 'rgba(253,251,247,0.25)'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  )
}
