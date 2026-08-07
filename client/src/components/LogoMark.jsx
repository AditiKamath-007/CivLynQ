import React from 'react';

export default function LogoMark({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer C — sharp, geometric arc */}
      <path
        d="M 72 20 L 38 20 Q 16 20 16 42 L 16 58 Q 16 80 38 80 L 72 80"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      {/* Inner L — crisp right-angle */}
      <path
        d="M 40 38 L 40 62 L 64 62"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}
