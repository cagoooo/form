import React, { useState } from 'react';
import { Star, Heart } from 'lucide-react';

const RatingInput = ({ field, value, onChange, theme }) => {
    const maxRating = field.maxRating || 5;
    const iconType = field.icon || 'star';
    const [hover, setHover] = useState(0);

    const Icon = iconType === 'heart' ? Heart : Star;

    return (
        <div className="flex items-center gap-2 mt-2">
            {[...Array(maxRating)].map((_, index) => {
                const ratingValue = index + 1;
                const isActive = ratingValue <= (hover || value);

                return (
                    <button
                        key={index}
                        type="button"
                        className="focus:outline-none transition-transform active:scale-90"
                        onClick={() => onChange(field.id, ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                    >
                        <Icon
                            size={32}
                            className={`
                transition-all duration-200
                ${isActive
                                    ? `${theme.text.replace('text-', 'fill-')} ${theme.text}`
                                    : 'text-slate-200 fill-transparent'}
              `}
                        />
                    </button>
                );
            })}
            {value > 0 && (
                <span className={`ml-2 text-sm font-bold ${theme.text}`}>
                    {value} / {maxRating}
                </span>
            )}
        </div>
    );
};

export default RatingInput;
