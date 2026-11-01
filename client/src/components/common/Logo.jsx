import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ size = 'default', showTagline = false, className = '' }) => {
  return (
    <Link to="/" className={`inline-flex flex-col group select-none ${className}`}>
      <div className="flex items-center gap-2">
        {/* Subtle abstract floral / sparkle symbol */}
        <div className="relative flex items-center justify-center w-7 h-7 text-[#C47B62] transition-transform duration-300 group-hover:rotate-12">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-current stroke-[1.5]">
            <path
              d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4771 12 22C12 16.4771 16.4771 12 22 12C16.4771 12 12 7.52285 12 2Z"
              fill="#C47B62"
              fillOpacity="0.12"
            />
            <circle cx="12" cy="12" r="1.75" fill="#C47B62" />
          </svg>
        </div>

        {/* Wordmark */}
        <span
          className={`font-serif tracking-[0.16em] uppercase font-medium text-[#252522] ${
            size === 'large' ? 'text-2xl' : size === 'small' ? 'text-lg' : 'text-xl'
          }`}
        >
          MOMENZA
        </span>
      </div>

      {showTagline && (
        <span className="text-[10px] tracking-[0.2em] uppercase text-[#85847F] mt-0.5 pl-9">
          Make Every Moment Matter.
        </span>
      )}
    </Link>
  );
};

export default Logo;
